import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Symptoms } from '../symptoms/symptoms';
import { Data } from '../data/data';
import { About } from '../about/about';
import { Settings } from '../settings/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  private symptoms = Symptoms;
  private data = Data;
  private about = About;
  private settings = Settings;

  constructor(public navCtrl: NavController) {
    this.symptoms = Symptoms;
    this.data = Data;
    this.about = About;
    this.settings = Settings;
  }

}
