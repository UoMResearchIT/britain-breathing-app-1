import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Symptoms } from '../pages/symptoms/symptoms';
import { Data } from '../pages/data/data';
import { Allergies } from '../pages/allergies/allergies';
import { Contact } from '../pages/contact/contact';
import { Settings } from '../pages/settings/settings';
//import { Register } from '../pages/register/register';
import { Login } from '../pages/login/login';
//import { Terms } from '../pages/login/terms';

// Check if already registered
var startPage;
if(localStorage.getItem('userID')) {
  startPage = Symptoms;
} else {
  startPage = Login;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = startPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();
    Splashscreen.show();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'My Symptoms', component: Symptoms },
      { title: 'My Data', component: Data },
      { title: 'About Allergies', component: Allergies },
      { title: 'Contact Us', component: Contact },
      { title: 'Settings', component: Settings }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
