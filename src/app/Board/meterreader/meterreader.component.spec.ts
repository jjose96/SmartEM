import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterreaderComponent } from './meterreader.component';

describe('MeterreaderComponent', () => {
  let component: MeterreaderComponent;
  let fixture: ComponentFixture<MeterreaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterreaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterreaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
