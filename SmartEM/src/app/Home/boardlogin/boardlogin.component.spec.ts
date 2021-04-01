import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardloginComponent } from './boardlogin.component';

describe('BoardloginComponent', () => {
  let component: BoardloginComponent;
  let fixture: ComponentFixture<BoardloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
