import { Component } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
    providers: [LocalNotifications]
})

export class Settings {
  constructor(public viewCtrl: ViewController,
              private storage: Storage,
              public alertCtrl: AlertController,
              private http: Http,
              private localNotifications: LocalNotifications) {
                this.addYears();
                this.http = http;
              }

  // User vars
  public allYears = [];
  public registration = {
    dob: '',
    gender: '',
    allergies: {
      hayfever: 0,
      asthma: 0,
      other: 0,
      unknown: 0
    },
    alert: 1,
    alerttime: '09:00',
    datasharing: 0,
    dataprompt: 0,
    email: ''
  };

  ionViewDidLoad() {
    this.getUserDetails();
  }

  // Get the saved registration data
  getUserDetails() {
    var self = this;

    this.storage.ready().then(() => {
       // Or to get a key/value pair
       this.storage.get('config').then((data) => {
         console.log(data);
         self.registration = data;
       })
     });
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

  saveSettings(updateEmail) {
    var email = this.registration.email;
    var bearerToken;
    var deviceID;

    // Save the settings
    this.storage.ready().then(() => {
       // Save settings
       this.storage.set('config', this.registration);

       if(updateEmail === true) {
        this.storage.get('bearerToken').then((val) => { bearerToken = val;
          this.storage.get('deviceID').then((val) => { deviceID = val;
             // Send the updated email to the API
               var message = {
                 "clientkey": "b62ba943-8ba8-4c51-82ff-d45768522fc3",
                 "studyid": "53266d21-d8ed-43e4-8f3a-e2ff8a433be7",
                 "deviceid": deviceID,
                 "emailaddress": email,
                 "setting": true,
                 "eot":true
                };

               if(email.length == 0) {
                 // Remove from the mailing list if no email
                 message.emailaddress = 'removed';
                 message.setting = false;
               }

               var baseURL = 'https://storageconnect.manchester.ac.uk';
               var apiURL = baseURL+'/api/v1/mailinglistflag/';
               var headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer '+bearerToken});
               var options = new RequestOptions({ headers: headers });
               var messageString = JSON.stringify(message);

               // Save the email update
               this.http.post(apiURL, messageString, options).map(res => res.json()).subscribe(data => {
                 // email updated
                 let alert = this.alertCtrl.create({
                   title: 'Mailing List',
                   subTitle: 'Your details have been updated. '+data.Message,
                   buttons: ['OK']
                 });
                 alert.present();
               }, error => {
                 // update failed
                 let alert = this.alertCtrl.create({
                   title: 'Mailing List Error',
                   subTitle: 'An error occurred updating your mailing list settings. Details: '+JSON.stringify(error),
                   buttons: ['OK']
                 });
                 alert.present();
               });
             });
           });
         }
     });

     // Update the Notification
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
     } else {
       // Delete the notification
       this.localNotifications.cancelAll().then(() => {});
     }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
