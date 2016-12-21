import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Symptoms } from '../symptoms/symptoms';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class Register {

  constructor(public navCtrl: NavController) {}

  onboardingComplete() {
    this.navCtrl.setRoot(Symptoms);
    //this.navCtrl.push(Symptoms);
  }

}
