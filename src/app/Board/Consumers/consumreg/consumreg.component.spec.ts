import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumregComponent } from './consumreg.component';

describe('ConsumregComponent', () => {
  let component: ConsumregComponent;
  let fixture: ComponentFixture<ConsumregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
