import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Home } from '../home/home';

import * as moment from 'moment-timezone';

@Component({
  selector: 'page-symptoms',
  templateUrl: 'symptoms.html',
  providers: [Geolocation]
})
export class Symptoms {

  public symptoms = {
    howfeeling: 0,
    nose: 0,
    breathing: 0,
    eyes: 0,
    meds: 0,
    datetime: '',
    lat: 0.0,
    long: 0.0,
    rating: ['None', 'Mild', 'Moderate', 'Severe']
  }

  public page = {
    howfeeling: false,
    symptoms: true,
    thanks: true
  }

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private http: Http,
              public geo: Geolocation,
              private storage: Storage,
              public loadingCtrl: LoadingController
              ) {
    this.http = http;
  }

  symptomsPage(feeling) {
    var self = this;

    // Confirm medication taken, then show allergy symptoms page
    let alert = this.alertCtrl.create({
      title: 'Please confirm:',
      message: 'Have you taken your medication for allergies today?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
            self.showSymptomsPage(false);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            self.showSymptomsPage(true);
          }
        }
      ]
    });
    alert.present(alert);
  }

  showSymptomsPage(meds) {
    this.symptoms.meds = meds;

    this.page.howfeeling = true;
    this.page.symptoms = false;
  }

  processSymptoms() {
    var loading = this.loadingCtrl.create({
      content: 'Sending data...',
      dismissOnPageChange: false
    });
    loading.present();

    var self = this;

    this.storage.ready().then(() => {
      var userdata;
      var bearerToken;
      var deviceID;
      this.storage.get('config').then((val) => { userdata = val;
        this.storage.get('bearerToken').then((val) => { bearerToken = val;
          this.storage.get('deviceID').then((val) => { deviceID = val;
            /*
            let alert = this.alertCtrl.create({
              title: 'Saved Data',
              subTitle: userdata+' - '+bearerToken+' - '+deviceID,
              buttons: ['OK']
            });
            alert.present();
            */

            // Set the datetime
            this.symptoms.datetime = moment.tz("Europe/London").format();

            // Update the location data
            this.geo.getCurrentPosition().then((resp) => {
              this.symptoms.lat = Number((resp.coords.latitude).toFixed(3));
              this.symptoms.long = Number((resp.coords.longitude).toFixed(3));

              // Send the data to the API
              var gender = (userdata.gender == 0) ? 'M': 'F';

              var message = {
                "clientkey": "b62ba943-8ba8-4c51-82ff-d45768522fc3",
                "studyid": "e666e943-3cec-4b8d-9e80-e37bb3cafd76",
                "deviceid": deviceID,
                "datapacket": {
                  "readingDate": this.symptoms.datetime,
                  "latitude": this.symptoms.lat,
                  "longitude": this.symptoms.long,
                  "gender": gender,
                  "yearOfBirth": parseInt(userdata.dob),
                  "allergyConsent": true,
                  "hayFever": userdata.allergies.hayfever,
                  "asthma": userdata.allergies.asthma,
                  "otherAllegy": userdata.allergies.other,
                  "unknownAllergy": userdata.allergies.unknown,
                  "nose": this.symptoms.nose,
                  "breathing": this.symptoms.breathing,
                  "eyes": this.symptoms.eyes,
                  "takenMedication": this.symptoms.meds
                },
                  "eot":true
              };

              var baseURL = 'https://storageconnect.manchester.ac.uk';
              var apiURL = baseURL+'/api/v1/upload/';
              var headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer '+bearerToken});
              var options = new RequestOptions({ headers: headers });
              var messageString = JSON.stringify(message);

              this.http.post(apiURL, messageString, options).map(res => res.json()).subscribe(data => {
                // Success
                if(data.Code < 200) {
                  // Show the thanks page
                  loading.dismiss();
                  self.page.thanks = false;
                  self.page.symptoms = true;

                  // Save the data locally for graphing
                  // Get the graph JSON to update
                  this.storage.get('graphdata').then((val) => { graphData = val;
                    if(!graphData) {
                      // First time, create the graph JSON first
                      var graphData = {}
                    }

                    // Update with the new data
                    graphData[Date.now()] = message.datapacket;

                    // Save the graph JSON
                    this.storage.set('graphdata', graphData);
                  });
                } else {
                  loading.dismiss();
                  let alert = this.alertCtrl.create({
                    title: 'Error Sending Data',
                    subTitle: data.Message,
                    buttons: ['OK']
                  });
                  alert.present();
                }

              }, error => {
                  // Something went wrong
                  loading.dismiss();
                  let alert = this.alertCtrl.create({
                    title: 'Error Sending Data',
                    subTitle: 'Your data could not be sent at this time. Please check your connection and try again.',
                    buttons: ['OK']
                  });
                  alert.present();
              });
            }).catch((error) => {
              //console.log('Error getting location', error);
              loading.dismiss();
            });
          });
        });
      });
    });
  }

  finishedSymptoms() {
    console.log('Finished symptoms');

    this.navCtrl.setRoot(Home);

    this.page.howfeeling = false;
    this.page.thanks = true;
  }

}
