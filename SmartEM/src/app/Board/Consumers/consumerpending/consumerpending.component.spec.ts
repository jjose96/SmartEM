import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerpendingComponent } from './consumerpending.component';

describe('ConsumerpendingComponent', () => {
  let component: ConsumerpendingComponent;
  let fixture: ComponentFixture<ConsumerpendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerpendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
