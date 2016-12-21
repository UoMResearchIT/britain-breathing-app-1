import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { Symptoms } from '../pages/symptoms/symptoms';
import { Data } from '../pages/data/data';
import { Allergies } from '../pages/allergies/allergies';
import { Contact } from '../pages/contact/contact';
import { Settings } from '../pages/settings/settings';
import { Register } from '../pages/register/register';
import { Login } from '../pages/login/login';
import { Terms } from '../pages/login/terms';

@NgModule({
  declarations: [
    MyApp,
    Symptoms,
    Data,
    Allergies,
    Contact,
    Settings,
    Register,
    Login,
    Terms
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
    Register,
    Login,
    Terms
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
