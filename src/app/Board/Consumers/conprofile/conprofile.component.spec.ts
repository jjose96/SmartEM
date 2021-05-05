import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConprofileComponent } from './conprofile.component';

describe('ConprofileComponent', () => {
  let component: ConprofileComponent;
  let fixture: ComponentFixture<ConprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
