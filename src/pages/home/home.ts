import { Component } from '@angular/core';
import { NavController, Page } from 'ionic-angular';

import { Symptoms } from '../symptoms/symptoms';
import { Data } from '../data/data';
import { Allergies } from '../allergies/allergies';
import { Contact } from '../contact/contact';
import { Settings } from '../settings/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {

  constructor(public navCtrl: NavController) {
    this.symptoms = Symptoms;
    this.data = Data;
    this.allergies = Allergies;
    this.contact = Contact;
    this.settings = Settings;
  }

}
