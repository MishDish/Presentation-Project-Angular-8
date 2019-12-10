import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleElevatorComponent } from './single-elevator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@@core/material.module.exports';
import { ChartsModule } from 'ng2-charts';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SingleElevatorComponent', () => {
  let component: SingleElevatorComponent;
  let fixture: ComponentFixture<SingleElevatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleElevatorComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ChartsModule,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleElevatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
