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
    var bearerToken;
    var deviceID;

    // Save the settings
    this.storage.ready().then(() => {
       // Save settings
       this.storage.set('config', this.registration);
         
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
     console.log(this.localNotifications)
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
