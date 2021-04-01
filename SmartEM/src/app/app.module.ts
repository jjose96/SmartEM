import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomepageComponent } from './Home/homepage/homepage.component';
import { ConsumerloginComponent } from './Home/consumerlogin/consumerlogin.component';
import { BoardloginComponent } from './Home/boardlogin/boardlogin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ConsumerloginComponent,
    BoardloginComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
