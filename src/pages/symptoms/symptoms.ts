import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { Home } from '../home/home';

import { sizeof } from 'sizeof';

@Component({
  selector: 'page-symptoms',
  templateUrl: 'symptoms.html'
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
              public alertCtrl: AlertController
              ) {}

  symptomsPage(feeling) {
    var self = this;
    this.symptoms.howfeeling = feeling;

    if(this.symptoms.howfeeling == 0) {
      // Show the thanks page
      this.page.howfeeling = true;
      this.page.thanks = false;
    } else {
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
              self.showSymptomsPage(0);
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked');
              self.showSymptomsPage(1);
            }
          }
        ]
      });
      alert.present(alert);
    }
  }

  showSymptomsPage(meds) {
    this.symptoms.meds = meds;

    this.page.howfeeling = true;
    this.page.symptoms = false;
  }

  submitSymptoms() {
    var self = this;

    let alert = this.alertCtrl.create({
      title: 'Please confirm:',
      message: 'Do you want send your data now? This will use 0.2MB of data.', 
      // TODO:message: 'Do you want send your data now? \nData: '+(sizeof(self.symptoms)/1048576)+'MB',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
            self.processSymptoms(false);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            self.processSymptoms(true);
          }
        }
      ]
    });
    alert.present(alert);
  }

  processSymptoms(send) {
    console.log('Process symptoms');
    // TODO: Save and/or send the data to the API


    // Show the thanks page
    this.page.thanks = false;
    this.page.symptoms = true;
  }

  finishedSymptoms() {
    console.log('Finished symptoms');

    this.navCtrl.setRoot(Home);

    this.page.howfeeling = false;
    this.page.thanks = true;
  }
}
