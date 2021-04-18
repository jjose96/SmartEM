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


const routes: Routes = [
  { path: '', component: HomePageComponent, children: [
    { path: '', component: ConsumerComponent },
    { path: 'board', component: BoardComponent },
    { path: 'register', component: ConsumregComponent },
  ]},
  { path: 'dashboard', component: MergeComponent, children: [
    { path: '', component: DashboardComponent },
    { path: 'consumerall', component: ConsumerallComponent, children: [
      { path: '', component: NewconsumerComponent},
      { path: 'new', component: ConsumregComponent }
    ]
  },
  {path: 'pending', component: ConsumerpendingComponent},
  {path: 'bills', component: BillsComponent}
  ]},
  { path: 'userpanel', component: UserpanelComponent, children: [
    { path: '', component: PanelComponent },
    {path: 'usages', component: UsagesComponent},
    {path: 'bills', component: BillComponent},
    {path: 'profile', component: ProfileComponent}


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
    NewconsumerComponent,
    SidebardashComponent,
    UserpanelComponent,
    PanelComponent,
    UsagesComponent,
    BillComponent,
    ProfileComponent,
    BillsComponent,  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
