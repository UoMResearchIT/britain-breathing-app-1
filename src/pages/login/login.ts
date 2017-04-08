import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController, LoadingController, ModalController, NavController } from 'ionic-angular';
import jsSHA from 'jssha';
import { Storage } from '@ionic/storage';

import { Terms } from './terms';
import { Home } from '../home/home';
import { Register } from '../register/register';
import { Settings } from '../settings/settings';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {

  constructor(public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public navCtrl: NavController,
              private http: Http,
              public alertCtrl: AlertController,
              private storage: Storage
            ) {
    this.http = http;
  }

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

  ionViewDidLoad() {
    // Show the loader
    let loading = this.loadingCtrl.create({
      content: "Checking login...",
      dismissOnPageChange: true
    });
    loading.present();

    this.storage.ready().then(() => {
      this.storage.get('userID').then((val) => {
        ///// User already registered; log them in
        if(val && val.length > 0) {
          this.navCtrl.setRoot(Home);
        } else {
          loading.dismiss();
        }
      });
    });
  }

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
    if(this.login.usercode.length <= 4) {
      // Invalid usercode
      this.login.error.message = 'Usercode must be at least 5 characters';
      this.login.error.hide = false;
    } else {
      this.login.error.hide = true;
      this.checkAllFields();
    }
  }

  /** Validate the password input */
  validatePassword() {
    if(this.login.password.length <= 7) {
      this.login.error.message = 'Password must be at least 8 characters';
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
      this.login.error.message = 'Your passwords don\'t match';
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
      if(this.login.usercode.length >= 5 && this.login.password.length >= 8 && this.login.password === this.login.confirmpassword) {
        // Show the button
        this.login.hidebutton = false;
      } else {
        this.login.hidebutton = true;
      }
    } else {
      // Signing in, check the usercode and password
      if(this.login.usercode.length >= 5 && this.login.password.length >= 8) {
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
      content: this.login.terms+"...",
      dismissOnPageChange: true
    });
    loading.present();

    // Do the ajax call
    this.postData(loading);
  }

  termsModal() {
    let modal = this.modalCtrl.create(Terms);
    modal.present();
  }

  /** Login or registration */
  postData(loading) {
    // Hash the usercode
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(this.login.usercode);
    var hashedUC = shaObj.getHash("HEX");

    // Password salt
    this.login.password = this.login.password+'s9!';

    // Create the json string
    var base64Credentials = window.btoa(hashedUC+':'+this.login.password);
    var message = {
      "clientkey": "b62ba943-8ba8-4c51-82ff-d45768522fc3",
      "studyid": "172ca793-9cab-4343-84fa-bf730f7a6693",
      "credentials": base64Credentials,
      "useragent": navigator.userAgent,
      "eot": true
    };

    // Save the data
    this.storage.ready().then(() => {
      this.storage.set('userdata', message);
    });

    if(this.login.register) {
      // Show the registration onboarding
      this.navCtrl.push(Register);

    } else {
      // Post the login details
      var messageString = JSON.stringify(message);
      localStorage.setItem('usercode', hashedUC);
      console.log(messageString);

      var baseURL = 'https://storageconnect.manchester.ac.uk';
      var apiURL = baseURL+'/api/v1/login/';
      var headers = new Headers({'Content-Type': 'application/json'});
      var options = new RequestOptions({ headers: headers });

      this.http.post(apiURL, messageString, options).map(res => res.json()).subscribe(data => {
        if(data.Code < 200) {
          // Login successful

          // Save the user details
          var userInfo = data.Details;
          userInfo = userInfo.split(':');
          var bearerToken = userInfo[0];
          var userCode = userInfo[1];
          var deviceID = userInfo[2];
          this.storage.set('bearerToken', bearerToken);
          this.storage.set('userID', userCode);
          this.storage.set('deviceID', deviceID);

          this.storage.ready().then(() => {
            this.storage.get('config').then((val) => {
                // Check if the user settings are present
                if(val) {
                  // Redirect to the homepage
                  this.navCtrl.setRoot(Home);

                  // Verify the registration
                  var apiURL = baseURL+'/api/v1/regverify/';
                  var headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer '+bearerToken});
                  var options = new RequestOptions({ headers: headers });
                  var message = {
                    "deviceid": deviceID,
                    "clientkey": "b62ba943-8ba8-4c51-82ff-d45768522fc3",
                    "studyid": "172ca793-9cab-4343-84fa-bf730f7a6693",
                    "eot": true
                  };
                  var messageString = JSON.stringify(message);

                  this.http.post(apiURL, messageString, options).map(res => res.json()).subscribe(data => {
                    this.storage.ready().then(() => {
                      // Redirect to the home page
                      this.navCtrl.setRoot(Home);

                      // Save the user details
                      this.storage.set('bearerToken', bearerToken);
                      this.storage.set('userID', userCode);
                      this.storage.set('deviceID', deviceID);
                    });
                  }, error => {
                      let alert = this.alertCtrl.create({
                        title: 'Registration Verify Error 1',
                        subTitle: 'An error occurred registering your details. You may need to close the app and start again.',
                        buttons: ['OK']
                      });
                      alert.present();
                  });
                } else {
                  // No details found
                  var registration = {
                    dob: 0,
                    gender: 0,
                    allergies: {
                      hayfever: false,
                      asthma: false,
                      other: false,
                      unknown: false
                    },
                    alert: 1,
                    alerttime: '09:00',
                    datasharing: 0,
                    dataprompt: 0,
                    email: ''
                  }
                  this.storage.set('config', registration);

                  // Verify the registration
                  var apiURL = baseURL+'/api/v1/regverify/';
                  var headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer '+bearerToken});
                  var options = new RequestOptions({ headers: headers });
                  var message = {
                    "deviceid": deviceID,
                    "clientkey": "b62ba943-8ba8-4c51-82ff-d45768522fc3",
                    "studyid": "172ca793-9cab-4343-84fa-bf730f7a6693",
                    "eot": true
                  };
                  var messageString = JSON.stringify(message);

                  this.http.post(apiURL, messageString, options).map(res => res.json()).subscribe(data => {
                    this.storage.ready().then(() => {
                      // Redirect to the settings page
                      this.navCtrl.setRoot(Settings);

                      // Save the user details
                      this.storage.set('bearerToken', bearerToken);
                      this.storage.set('userID', userCode);
                      this.storage.set('deviceID', deviceID);

                      // Display success message
                      // Show an alert about settings
                      let alert = this.alertCtrl.create({
                        title: 'New login',
                        subTitle: 'If you are logging in on a new device, please update your settings information.',
                        buttons: ['OK']
                      });
                      alert.present();
                    });
                  }, error => {
                      let alert = this.alertCtrl.create({
                        title: 'Registration Verify Error 2',
                        subTitle: 'An error occurred registering your details. You may need to close the app and start again.',
                        buttons: ['OK']
                      });
                      alert.present();
                  });
                }
              });
            });
        } else {
          // Login failed
          loading.dismiss();
          this.login.error.message = data.Message;
          this.login.error.hide = false;
        }
      }, error => {
          // Something went wrong
          loading.dismiss();
          this.login.error.message = error.Message;
          this.login.error.hide = false;
      });
    }
  }

}
