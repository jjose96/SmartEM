import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerallComponent } from './consumerall.component';

describe('ConsumerallComponent', () => {
  let component: ConsumerallComponent;
  let fixture: ComponentFixture<ConsumerallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
