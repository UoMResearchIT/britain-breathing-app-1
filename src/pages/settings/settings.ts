import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class Settings {
  constructor(public viewCtrl: ViewController,
              private storage: Storage) {
                this.addYears();
                this.getUserDetails();
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

  saveSettings() {
    setTimeout(function() {
      this.storage.ready().then(() => {
         // Save settings
         this.storage.set('config', this.registration);
       },500);
     });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
