import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginanotheComponent } from './loginanothe.component';

describe('LoginanotheComponent', () => {
  let component: LoginanotheComponent;
  let fixture: ComponentFixture<LoginanotheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginanotheComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginanotheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
