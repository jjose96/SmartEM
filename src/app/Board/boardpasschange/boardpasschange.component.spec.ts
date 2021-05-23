import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardpasschangeComponent } from './boardpasschange.component';

describe('BoardpasschangeComponent', () => {
  let component: BoardpasschangeComponent;
  let fixture: ComponentFixture<BoardpasschangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardpasschangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardpasschangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
