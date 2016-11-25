import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { Symptoms } from '../pages/symptoms/symptoms';
import { Data } from '../pages/data/data';
import { Allergies } from '../pages/allergies/allergies';
import { Contact } from '../pages/contact/contact';
import { Settings } from '../pages/settings/settings';
import { Login } from '../pages/login/login';

@NgModule({
  declarations: [
    MyApp,
    Symptoms,
    Data,
    Allergies,
    Contact,
    Settings,
    Login
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Symptoms,
    Data,
    Allergies,
    Contact,
    Settings,
    Login
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
