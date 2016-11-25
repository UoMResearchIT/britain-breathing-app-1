import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {

  constructor(public loadingCtrl: LoadingController) {}

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
    
    // Error handling, or redirect to app
    localStorage.setItem("userID", "Smith");

    // This needs a better transition to the main app
    window.location.reload();
  }

}
