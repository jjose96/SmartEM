import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceslabComponent } from './priceslab.component';

describe('PriceslabComponent', () => {
  let component: PriceslabComponent;
  let fixture: ComponentFixture<PriceslabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceslabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceslabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
