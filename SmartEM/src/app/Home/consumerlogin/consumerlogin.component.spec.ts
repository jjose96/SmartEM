import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerloginComponent } from './consumerlogin.component';

describe('ConsumerloginComponent', () => {
  let component: ConsumerloginComponent;
  let fixture: ComponentFixture<ConsumerloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
