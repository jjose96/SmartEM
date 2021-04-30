import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitwarningComponent } from './limitwarning.component';

describe('LimitwarningComponent', () => {
  let component: LimitwarningComponent;
  let fixture: ComponentFixture<LimitwarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitwarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitwarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
