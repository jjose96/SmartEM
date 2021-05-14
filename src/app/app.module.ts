import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomePageComponent } from './Home/home-page/home-page.component';
import { ConsumerComponent } from './Home/consumer/consumer.component';
import { BoardComponent } from './Home/board/board.component';
import { Routes, RouterModule } from '@angular/router';
import { ConsumregComponent } from './Board/Consumers/consumreg/consumreg.component';
import { SidebarComponent } from './Board/sidebar/sidebar.component';
import { DashboardComponent } from './Board/dashboard/dashboard.component';
import { MergeComponent } from './Board/merge/merge.component';
import { ConsumerallComponent } from './Board/Consumers/consumerall/consumerall.component';
import { NewconsumerComponent } from './Board/Consumers/newconsumer/newconsumer.component';
import { SidebardashComponent } from './Consumers/sidebardash/sidebardash.component';
import { UserpanelComponent } from './Consumers/userpanel/userpanel.component';
import { PanelComponent } from './Consumers/panel/panel.component';
import { UsagesComponent } from './Consumers/usages/usages.component';
import { BillComponent } from './Consumers/bill/bill.component';
import { ConsumerpendingComponent } from './Board/Consumers/consumerpending/consumerpending.component';
import { ProfileComponent } from './Consumers/profile/profile.component';
import { BillsComponent } from './Board/bills/bills.component';
import { PasswordchangeComponent } from './Consumers/passwordchange/passwordchange.component';
import { CompareDirective } from './Consumers/passwordchange/passwordchange.directive';
import { LimitwarningComponent } from './Consumers/limitwarning/limitwarning.component';
import { PushNotificationsModule } from 'ng-push';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DailychartComponent } from './Consumers/dailychart/dailychart.component';
import { WeeklychartComponent } from './Consumers/weeklychart/weeklychart.component';
import { MonthlychartComponent } from './Consumers/monthlychart/monthlychart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ConprofileComponent } from './Board/Consumers/conprofile/conprofile.component';
import { MeterreaderComponent } from './Board/meterreader/meterreader.component';
import { VerifyuserComponent } from './Board/verifyuser/verifyuser.component';
import { VerifyPasswordDirective} from './Board/verifyuser/verifyuser.directive';
import { AdminloginComponent } from './Administrator/adminlogin/adminlogin.component';
import { AdmindashComponent } from './Administrator/admindash/admindash.component';
import { HolderComponent } from './Administrator/holder/holder.component';
import { AuthComponent } from './Administrator/auth/auth.component';
const routes: Routes = [
  { path: '', component: HomePageComponent, children: [
    { path: '', component: ConsumerComponent },
    { path: 'board', component: BoardComponent },
    { path: 'register', component: ConsumregComponent },
  ]},
  { path: 'dashboard', component: MergeComponent, children: [
    { path: '', component: DashboardComponent },
    { path: 'consumers', component: ConsumerallComponent, children: [
      { path: 'new', component: ConsumregComponent },
      {path: ':id', component: ConprofileComponent},
      { path: '', component: NewconsumerComponent},
    ]
  },
  {path: 'pending', component: ConsumerpendingComponent},
  {path: 'bills', component: BillsComponent}
  ]},
  { path: 'userpanel', component: UserpanelComponent, children: [
    { path: '', component: PanelComponent },
    {path: 'usages', component: UsagesComponent},
    {path: 'bills', component: BillComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'passwordchange', component: PasswordchangeComponent},
    {path: 'limit', component: LimitwarningComponent}
  ]},
  { path: 'verify', component: VerifyuserComponent },
  { path: 'admin', component: AdminloginComponent},
  { path: 'administrator', component: AuthComponent, children: [
    { path: '', component: AdmindashComponent }
  ]}


];
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ConsumerComponent,
    BoardComponent,
    ConsumregComponent,
    SidebarComponent,
    DashboardComponent,
    MergeComponent,
    ConsumerallComponent,
    ConsumerpendingComponent,
    NewconsumerComponent,
    SidebardashComponent,
    UserpanelComponent,
    PanelComponent,
    UsagesComponent,
    BillComponent,
    ProfileComponent,
    BillsComponent,
    PasswordchangeComponent,
    CompareDirective,
    VerifyPasswordDirective,
    LimitwarningComponent,
    DailychartComponent,
    WeeklychartComponent,
    MonthlychartComponent,
    ConprofileComponent,
    MeterreaderComponent,
    VerifyuserComponent,
    AdminloginComponent,
    AdmindashComponent,
    HolderComponent,
    AuthComponent,
     ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule ,
    PushNotificationsModule,
    NgApexchartsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  exports: [RouterModule, CompareDirective, VerifyPasswordDirective  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
