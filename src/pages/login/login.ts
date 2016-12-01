import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Terms } from './terms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {

  constructor(public loadingCtrl: LoadingController, public modalCtrl: ModalController) {}

  login = {
    usercode: '',
    password: '',
    register: '',
    button: 'Register',
    terms: 'registering'
  };

  buttonText() {
    if(this.login.register) {
      this.login.button = 'Register';
      this.login.terms = 'registering';
    } else {
      this.login.button = 'Sign in';
      this.login.terms = 'signing in';
    }
  }

  signUp() {
    // Input validation

    // Show the loader
    let loading = this.loadingCtrl.create({
      content: "Signing in...",
      duration: 3000,
      dismissOnPageChange: true
    });
    loading.present();

    // Do the ajax call
    

      // Set the userID on callback
      localStorage.setItem("userID", "Smith");

      // Error handling, or redirect to app


    // This needs a better transition to the main app
    window.location.reload();
  }

  termsModal() {
    let modal = this.modalCtrl.create(Terms);
    modal.present();
  }

}
