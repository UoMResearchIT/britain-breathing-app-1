import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Symptoms } from '../symptoms/symptoms';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class Register {

  constructor(public navCtrl: NavController) {
    this.addYears();
  }

  registration = {
    dob: '',
    gender: '',
    allergies: {
      hayfever: false,
      asthma: false,
      other: false,
      unknown: false
    },
    alert: true,
    alerttime: '09:00',
    datasharing: false,
    dataprompt: false
  }

  allYears = []

  addYears() {
    var startYear = new Date().getFullYear();
    startYear = startYear-17;
    var i=100;
    this.allYears.push(startYear);

    for(i;i>0;i--) {
      startYear = startYear-1;
      this.allYears.push(startYear);
    }

    console.log(this.allYears);
  }

  onboardingComplete() {
    this.navCtrl.setRoot(Symptoms);
    //this.navCtrl.push(Symptoms);

    console.log(this.registration);
  }

}
