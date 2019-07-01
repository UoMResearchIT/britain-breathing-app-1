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
    tiredness: 0,
    meds: 0,
    datetime: '',
    lat: 0.0,
    long: 0.0,
    rating: ['None', 'Mild', 'Moderate', 'Severe']
  };

  public page = {
    howfeeling: false,
    symptoms: true,
    thanks: true
  };

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private http: Http,
              public geo: Geolocation,
              private storage: Storage,
              public loadingCtrl: LoadingController
  ) {
    this.http = http;
  }

  symptomsPage(howfeeling) {
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
            this.symptoms.howfeeling = howfeeling;
            self.showSymptomsPage(false);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            this.symptoms.howfeeling = howfeeling;
            self.showSymptomsPage(true);
          }
        }
      ]
    });
    alert.present(alert);
  }


  // user clicks "Great" says if they took medicine then returns to home page after passing default values to Storage Connect
  symptomsNoPage(howfeeling){

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
            console.log('No clicked (No symptoms)');
            this.symptoms.howfeeling = howfeeling;
            self.showNoSymptomsPage(false);
            this.page.howfeeling = true;
            self.page.thanks = false;
            self.page.symptoms = true;
          },
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            this.symptoms.howfeeling = howfeeling;
            self.showNoSymptomsPage(true);
            this.page.howfeeling = true;
            self.page.thanks = false;
            self.page.symptoms = true;
            console.log('Default Symptoms Processed');
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

  // Processes defualt values
  showNoSymptomsPage(meds) {
    this.symptoms.meds = meds;
    this.processSymptoms()
  }

  processSymptoms() {
    console.log('Process Symptoms Function Called');
    var loading = this.loadingCtrl.create({
      content: 'Sending data...',
      dismissOnPageChange: false
    });
    loading.present();

    var self = this;

    this.storage.ready().then(() => {
      console.log('Storage Set-Up');
      let userdata;
      var bearerToken;
      var deviceID;
      this.storage.get('config').then((val) => { userdata = val;
        this.storage.get('bearerToken').then((val) => { bearerToken = val;
          this.storage.get('deviceID').then((val) => { deviceID = val;
            console.log('Get Device ID, bearer Token, userdata from config etc');
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
            console.log('Set-up Datetime');

            // Send the data to the API

            if (userdata.gender == 0) {
              var gender = 'M'
            }
            else if (userdata.gender == 1) {
              var gender = 'F'
            }
            else {
            var gender = 'PNTS'}


            console.log('Gender');

            // Update the location data
            this.geo.getCurrentPosition().then((resp) => {
              this.symptoms.lat = Number(resp.coords.latitude.toFixed(2));
              this.symptoms.long = Number(resp.coords.longitude.toFixed(2));
              console.log(this.symptoms.lat);
              console.log(this.symptoms.long);

              console.log('Location Data');

              var message = {
                "clientkey": "b62ba943-8ba8-4c51-82ff-d45768522fc3",
                "studyid": "bcc2a109-bd76-44b9-b9f6-5f6b4c0b2123",
                "deviceid": deviceID,
                "datapacket": {
                  "readingDate": this.symptoms.datetime,
                  "alerttime": userdata.alerttime,
                  "latitude": this.symptoms.lat,
                  "longitude": this.symptoms.long,
                  "gender": gender,
                  "yearOfBirth": parseInt(userdata.dob),
                  "allergyConsent": true,
          
                  // Respiratory
                  "asthma": userdata.allergies.asthma,
                  "sinusitis": userdata.allergies.sinusitis,
                  "rhinitis":userdata.allergies.rhinitis,
                  "res_others":userdata.allergies.res_others,
                  "res_none":userdata.allergies.res_none,
                  // Allergies
                  "hayFever": userdata.allergies.hayfever,
                  "dust": userdata.allergies.dust,
                  "pet_hair": userdata.allergies.pet_hair,
                  "mites": userdata.allergies.mites,
                  "smoke": userdata.allergies.smoke,
                  "al_others": userdata.allergies.al_others,
                  "al_none": userdata.allergies.al_none,
                  
                  "howimdoing": this.symptoms.howfeeling,
                  "nose": this.symptoms.nose,
                  "breathing": this.symptoms.breathing,
                  "eyes": this.symptoms.eyes,
                  "tiredness":this.symptoms.tiredness,
                  "takenMedication": this.symptoms.meds
                },
                  "eot":true
              };
              console.log(message);

              var baseURL = 'https://storageconnect.manchester.ac.uk';
              var apiURL = baseURL+'/api/v1/upload/';
              var headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer '+bearerToken});
              var options = new RequestOptions({ headers: headers });
              var messageString = JSON.stringify(message);

              // Sends the unsentData

              this.storage.get('unsentData').then((unsentData) => {

                // If the unsent data exists do the following
                if(unsentData) {

                  // Find the length of the array holding the unsent data (0 == 1 etc, hence -1)
                  var unsentDataLength = ((unsentData.length) - 1);

                  // for each value in the array
                  for (var unsentdata of unsentData )
                  {

                    // if the data sends successfully find the in index of the data in the array.
                    if (this.http.post(apiURL, unsentdata, options).map(res => res.json()).subscribe(data => {
                    })) {

                      var data_index = unsentData.indexOf(unsentdata);

                      // if the data is the last in the array remove all the data.
                      if (unsentDataLength == data_index) {

                        this.storage.remove('unsentData');

                      }
                      // unsentData.splice(index,1);


                      }

                    }
                  }});

                  this.http.post(apiURL, messageString, options).map(res => res.json()).subscribe(data => {
                    // Success
                    if(data.Code < 200) {
                      // Show the thanks page
                      loading.dismiss();
                      self.page.thanks = false;
                      self.page.symptoms = true;
                      console.log('Data Successfully Sent');
    
                      // Save the data locally for graphing
                      // Get the graph JSON to update
                      this.storage.get('graphdata').then((val) => {
                        graphData = val;
                        if(!graphData) {
                          // First time, create the graph JSON first
                          var graphData = {}
                        }
                        console.log(graphData);
                        console.log('Data Saved Locally for Graphing');
    
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
                      buttons: [{
                        text: 'OK',
                        handler: () => {
                          this.finishedSymptoms();
                    }
    
                      }]
    
                    });
    
                    //  Save Data Locally as unsentData variable (graphData is already saved)
                    this.storage.get('unsentData').then((val) => {
                      unsentData = val;
                      if (!unsentData) {
                        // First time, create
                        var unsentData = [];
                        unsentData.push(messageString);
                        this.storage.set('unsentData', unsentData);
                      }
    
                      else {
                        unsentData.push(messageString);
                        this.storage.set('unsentData', unsentData);
                      }
    
                    });
    
    
                    this.storage.get('graphdata').then((val) => { graphData = val;
                      if(!graphData) {
                        // First time, create the graph JSON first
                        var graphData = {}
                      }
                      // console.log(graphData);
                      console.log('Data Saved Locally for Graphing');
    
                      // Update with the new data
                      graphData[Date.now()] = message.datapacket;
    
                      // Save the graph JSON
                      this.storage.set('graphdata', graphData);
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

    this.page.howfeeling = false;
    this.page.thanks = true;

    this.navCtrl.setRoot(Home);


  }

}
