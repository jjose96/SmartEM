import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-testdata',
  templateUrl: './testdata.component.html',
  styleUrls: ['./testdata.component.css']
})
export class TestdataComponent implements OnInit {
  ReadingList: Array<any>;

  constructor(private http: HttpClient) {

    this.http.post<any>(environment.url + '/api/GetTest', {}, {}).subscribe(result => {
       this.ReadingList = result.Reading;
        });
   }

  ngOnInit(): void {
  }

}
