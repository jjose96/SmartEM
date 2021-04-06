import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomepageComponent } from './Home/homepage/homepage.component';
import { ConsumerloginComponent } from './Home/consumerlogin/consumerlogin.component';
import { BoardloginComponent } from './Home/boardlogin/boardlogin.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, children: [
    { path: '', component: ConsumerloginComponent },
    { path: 'board', component: BoardloginComponent },
  ]}
];
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ConsumerloginComponent,
    BoardloginComponent
  ],
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
