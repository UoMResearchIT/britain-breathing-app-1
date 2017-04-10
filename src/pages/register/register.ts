import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, NavController, ModalController, ToastController, Slides } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Symptoms } from '../symptoms/symptoms';
import { Terms } from '../login/terms';

import { Storage } from '@ionic/storage';
import 'rxjs/Rx';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [LocalNotifications]
})
export class Register {
  @ViewChild(Slides) slides: Slides;

  public registration = {
    dob: 0,
    gender: null,
    allergies: {
      hayfever: false,
      asthma: false,
      other: false,
      unknown: false
    },
    alert: 1,
    alerttime: '09:00',
    datasharing: 0,
    dataprompt: 0,
    email: ''
  }

  public allYears = [];

  public terms = { 'notagreed': true };

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private http: Http,
              private storage: Storage,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private localNotifications: LocalNotifications
            ) {
    this.addYears();
    this.http = http;
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
  }

  addYears() {
    var startYear = new Date().getFullYear();
    startYear = startYear-17;
    var i=100;
    this.allYears.push(startYear.toString());

    for(i;i>0;i--) {
      startYear = startYear-1;
      this.allYears.push(startYear.toString());
    }

    //console.log(this.allYears);
  }

  onboardingComplete() {
    // Show the loader
    var loading = this.loadingCtrl.create({
      content: 'Saving your details...'
    });
    loading.present();

    // Send data to the API
    // Post the registration details
    this.storage.ready().then(() => {
      this.storage.get('userdata').then((val) => {
        var message = val;

        // If an email address has been added, add them to the mailing list
        var email = this.registration.email;
        if(email.length > 0) {
          message.emailaddress = this.registration.email;
          message.mailinglist = true;
        } else {
          message.mailinglist = false;
        }

        var messageString = JSON.stringify(message);
        //console.log(messageString);

        var baseURL = 'https://storageconnect.manchester.ac.uk';
        var apiURL = baseURL+'/api/v1/register/';
        var headers = new Headers({'Content-Type': 'application/json'});
        var options = new RequestOptions({ headers: headers });

        // Save the registration data
        this.http.post(apiURL, messageString, options).map(res => res.json()).subscribe(data => {
            // Registration successful, save the relevant details
            loading.dismiss();

            //var userInfo = JSON.stringify(data.Details).split(':');
            var userInfo = data.Details;
            userInfo = userInfo.split(':');
            var bearerToken = userInfo[0];
            var userCode = userInfo[1];
            var deviceID = userInfo[2];

            // Verify the registration
            var apiURL = baseURL+'/api/v1/regverify/';
            var headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer '+bearerToken});
            var options = new RequestOptions({ headers: headers });
            var message = {
              "deviceid": deviceID,
              "clientkey": "b62ba943-8ba8-4c51-82ff-d45768522fc3",
              "studyid": "e666e943-3cec-4b8d-9e80-e37bb3cafd76",
              "eot": true
            };
            var messageString = JSON.stringify(message);

            this.http.post(apiURL, messageString, options).map(res => res.json()).subscribe(data => {
              this.storage.ready().then(() => {
                // Redirect to the symptoms page
                this.navCtrl.setRoot(Symptoms);

                // Save the user details
                this.storage.set('bearerToken', bearerToken);
                this.storage.set('userID', userCode);
                this.storage.set('deviceID', deviceID);
                this.storage.set('config', this.registration);

                // Display success message
                var toast = this.toastCtrl.create({
                  message: 'Registration details saved',
                  duration: 5000,
                  position: 'bottom'
                });
                toast.onDidDismiss(() => {});
                toast.present();

                // Save the notification
                if(this.registration.alert == 1) {
                  var alerttime = this.registration.alerttime;
                  var hoursminutes = alerttime.split(':');
                  var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                  tomorrow.setHours(Number(hoursminutes[0]));
                  tomorrow.setMinutes(Number(hoursminutes[1]));
                  tomorrow.setSeconds(0);

                  // Clear any previously set notification
                  this.localNotifications.cancelAll().then(() => {
                    // Set the notification
                    this.localNotifications.schedule({
                      id: 1,
                      text: 'Please log your symptoms for today.',
                      every: 'day',
                      at: tomorrow
                    });
                  });
                }
              });
            }, error => {
                let alert = this.alertCtrl.create({
                  title: 'Registration Verify Error',
                  subTitle: 'An error occurred registering your details. You may need to close the app and start again. Details: '+error.Message,
                  buttons: ['OK']
                });
                alert.present();
            });
        }, error => {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Registration Error',
              subTitle: 'An error occurred registering your details. You may need to close the app and start again. Details: '+error.Message,
              buttons: ['OK']
            });
            alert.present();
        });
      });
    });
  }

  termsModal() {
    let modal = this.modalCtrl.create(Terms);
    modal.present();
  }

  termsAgreed() {
    if(!this.registration.datasharing) {
      let alert = this.alertCtrl.create({
        title: 'Terms & Conditions',
        subTitle: 'You must agree to data sharing and the terms and condtions to use this app.',
        buttons: ['OK']
      });
      alert.present();

      // Hide the 'next' link
      this.terms.notagreed = true;
    } else {
      // Show the 'next' link
      this.terms.notagreed = false;
    }
  }

  nextSlide() {
    this.slides.lockSwipes(false);
    this.slides.slideNext(500);
    this.slides.lockSwipes(true);
  }

}
