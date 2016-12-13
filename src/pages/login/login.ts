import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Terms } from './terms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {

  constructor(public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private http: Http
            ) {}

  login = {
    usercode: '',
    password: '',
    confirmpassword: '',
    register: true,
    button: 'Register',
    hidebutton: true,
    terms: 'registering',
    error: {
      hide: true,
      message: 'No errors here...'
    }
  };

  /** Change text depending on the register toggle value */
  buttonText() {
    if(this.login.register) {
      // Change the button text
      this.login.button = 'Register';

      // Update the terms text
      this.login.terms = 'registering';
    } else {
      this.login.button = 'Sign in';
      this.login.terms = 'signing in';
    }
  }

  /** Validate the usercodeinput */
  validateUsercode() {
    if(this.login.usercode.length <= 8) {
      // Invalid usercode
      this.login.error.message = 'Sorry, that usercode is invalid.';
      this.login.error.hide = false;
    } else {
      this.login.error.hide = true;
      this.checkAllFields();
    }
  }

  /** Validate the password input */
  validatePassword() {
    if(this.login.password.length <= 8) {
      this.login.error.message = 'Sorry, that password is invalid.';
      this.login.error.hide = false;
    } else {
      this.login.error.hide = true;
      this.checkAllFields();
    }
  }

  /** Validate the confirm password input */
  validateConfirmPassword() {
    if(this.login.password !== this.login.confirmpassword) {
      // Passwords don't match
      this.login.error.message = 'Your passwords don\'t match.';
      this.login.error.hide = false;
    } else {
      this.login.error.hide = true;
      this.checkAllFields();
    }
  }

  /** Show the sign in/up button if all fields are valid */
  checkAllFields() {
    this.login.error.hide = true;

    if(this.login.register) {
      // Registering, check the usercode, password and confirm password...
      if(this.login.usercode.length >= 8 && this.login.password.length >= 8 && this.login.password === this.login.confirmpassword) {
        // Show the button
        this.login.hidebutton = false;
      } else {
        this.login.hidebutton = true;
      }
    } else {
      // Signing in, check the usercode and password
      if(this.login.usercode.length >= 8 && this.login.password.length >= 8) {
        // Show the button
        this.login.hidebutton = false;
      } else {
        this.login.hidebutton = true;
      }
    }
  }

  /** Sign in or register the user */
  signInUp() {
    // Show the loader
    let loading = this.loadingCtrl.create({
      content: "Signing in...",
      dismissOnPageChange: true
    });
    loading.present();

    // Do the ajax call
    this.postData();
  }

  termsModal() {
    let modal = this.modalCtrl.create(Terms);
    modal.present();
  }

  /** Post the login or registration data */
  postData() {
    var base64Credentials = window.btoa(this.login.usercode+':'+this.login.password);
    var body = {
      "clientkey": "583c09d1-0d2c-49ae-bff5-de02c8af5ca7",
      "studyid": "123",
      "credentials": base64Credentials,
      "useragent": navigator.userAgent,
      "eot": true
      }

      /***

        TODO: BASE URL TO BE UPDATED FOR PRODUCTION

      ***/
      var baseURL = 'http://webnet.humanities.manchester.ac.uk/StorageConnect';
      var apiURL = '';
      if(this.login.register) {
        // Post the registration details
        apiURL = baseURL+'/api/v1/register/';
      } else {
        // Post the login details
        apiURL = baseURL+'/api/v1/login/.';
      }

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post(apiURL, body, { headers: headers }).subscribe(data => {
        alert('ok');
      }, error => {
          this.login.error.message = 'An error occurred contacting the server. Please try again later.';
          this.login.error.hide = false;
      });
  }

}
