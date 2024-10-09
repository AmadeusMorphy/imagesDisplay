import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProfileComponent } from './users-profile.component';

describe('UsersProfileComponent', () => {
  let component: UsersProfileComponent;
  let fixture: ComponentFixture<UsersProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersProfileComponent]
    });
    fixture = TestBed.createComponent(UsersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
