import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, ToastController, Slides } from 'ionic-angular';

import { Symptoms } from '../symptoms/symptoms';
import { Terms } from '../login/terms';

import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class Register {
  @ViewChild(Slides) slides: Slides;

  public database: SQLite;

  public registration = {
    dob: '',
    gender: '',
    allergies: {
      hayfever: 0,
      asthma: 0,
      other: 0,
      unknown: 0
    },
    alert: 1,
    alerttime: '09:00',
    datasharing: 0,
    dataprompt: 0,
    email: ''
  }

  public allYears = [];

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private toastCtrl: ToastController) {
    this.addYears();
  }

  addYears() {
    var startYear = new Date().getFullYear();
    startYear = startYear-17;
    var i=100;
    this.allYears.push(startYear.toString());

    for(i;i>0;i--) {
      startYear = startYear-1;
      this.allYears.push(startYear.toString());
    }

    //console.log(this.allYears);
  }

  onboardingComplete() {
    // Redirect to the symptoms page
    this.navCtrl.setRoot(Symptoms);

    // Create the local database
    this.database = new SQLite();
    this.database.openDatabase({
      name: 'bbapp.db',
      location: 'default'
    }).then(() => {
      // Create the config table
      var configQuery = 'CREATE TABLE config(';
          configQuery += 'ID int,';
          configQuery += 'Terms int,';
          configQuery += 'YearOfBirth int,';
          configQuery += 'Gender int,';
          configQuery += 'AllergyConsent int,';
          configQuery += 'HayFever int,';
          configQuery += 'Asthma int,';
          configQuery += 'OtherAllergy int,';
          configQuery += 'UnknownAllergy int,';
          configQuery += 'Notifications int,';
          configQuery += 'NotificationAlert varchar(5),';
          configQuery += 'PromptForSubmit int,';
          configQuery += 'BearerToken varchar(50),';
          configQuery += 'Registered int,';
          configQuery += 'Usercode varchar(64)';
          configQuery += ')';

      this.database.executeSql(configQuery, {}).then(() => {
        // Add the registration details
        var insertReg = 'INSERT INTO config VALUES(';
            insertReg += '1';
            insertReg += this.registration.datasharing+',';
            insertReg += this.registration.dob+',';
            insertReg += this.registration.gender+',';
            insertReg += 'true,';
            insertReg += this.registration.allergies.hayfever+',';
            insertReg += this.registration.allergies.asthma+',';
            insertReg += this.registration.allergies.other+',';
            insertReg += this.registration.allergies.unknown+',';
            insertReg += this.registration.alert+',';
            insertReg += '""'+this.registration.alerttime+'"",';
            insertReg += this.registration.dataprompt+',';
            insertReg += '""'+'"",';
            insertReg += ',';
            insertReg += '""'+localStorage.getItem('usercode')+'"';
            insertReg += ')';

        // Show a message
        var toast = this.toastCtrl.create({
          message: 'Registration details saved',
          duration: 3000,
          position: 'bottom'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();

        // Send data to the API
        /*** TODO: NEED TO CLARFY THE END POINT FOR THIS DATA
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        this.http.post(apiURL, messageString, options).subscribe(data => {
            // callback
            }
        }, error => {
            //console.log(error);

        });
        ****/

        // TODO: Update the settings page


      }, (err) => {
        console.error('Unable to execute sql: ', err);
      });

      // Create the symptoms table
      var symptomsQuery = 'CREATE TABLE symptoms(';
      symptomsQuery += 'ID int,';
      symptomsQuery += 'Uploaded int,';
      symptomsQuery += 'SymptomDate datetime,';
      symptomsQuery += 'Latitude float,';
      symptomsQuery += 'Longitude float,';
      symptomsQuery += 'Nose int,';
      symptomsQuery += 'Breathing int,';
      symptomsQuery += 'Eyes int,';
      symptomsQuery += 'TakenMeds int';
      symptomsQuery += ')';

    }, (err) => {
      console.error('Unable to open database: ', err);
    });
  }

  termsModal() {
    let modal = this.modalCtrl.create(Terms);
    modal.present();
  }

  nextSlide() {
    this.slides.slideNext(500); 
  }

}
