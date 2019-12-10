import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@@core/material.module.exports';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { of } from 'rxjs';

import { Elevator } from '../../models/dashboard.model';

class MockDashboardService extends DashboardService {

  elevators$ = new BehaviorSubject<Elevator[]>([]);
  dashboardLoaded$ = new BehaviorSubject<boolean>(false);
  statusPoll: Subscription;

  getAllElevators() {
    this.elevators$.next([{
      id: 0,
      elevatorCode: 'string',
      statusCode: 'string',
      statusDescription: 'string',
      lastUpdated: new Date('2019-10-23T10:25:54.337298+00:00')
    }]);

    this.dashboardLoaded$.next(true);
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: DashboardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientModule, RouterTestingModule, MaterialModule],
      providers: [{ provide: DashboardService, useClass: MockDashboardService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    service = TestBed.get(DashboardService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (service.statusPoll && service.statusPoll.unsubscribe) {
      service.statusPoll.unsubscribe();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector('.content span').textContent).toContain('app is running!');
  });

  it('verifies that ngOnInit is initializes the data properly', () => {
    // 1 .Arrange
    const expectedElevators = [{
      id: 0,
      elevatorCode: 'string',
      statusCode: 'string',
      statusDescription: 'string',
      lastUpdated: new Date('2019-10-23T10:25:54.337298+00:00')
    }];

    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    spyOn(service, 'getAllElevators');
    // 2 .Act
    component.ngOnInit();
    // 3 .Assert
    expect(service.getAllElevators).toHaveBeenCalled();
    component.elevators$.subscribe(r => {
      expect(r).toEqual(expectedElevators);
      expect(component.dataSource.data).toEqual(expectedElevators);
    });
    component.dashboardLoaded$.subscribe(r => {
      expect(r).toBe(true);
    });
  });

  it('verifies that ngOnDestroy is not unsubscribing before statusPoll is defined', () => {
    // 1 .Arrange
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // 2 .Act
    component.ngOnDestroy();
    // 3 .Assert
    expect(service.statusPoll).toBeUndefined();
  });

  it('verifies that ngOnDestroy is unsubscribing if statusPoll is subscribed', () => {
    // 1 .Arrange
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    service.statusPoll = of({}).subscribe();
    spyOn(service.statusPoll, 'unsubscribe');
    // 2 .Act
    component.ngOnDestroy();
    // 3 .Assert
    expect(service.statusPoll.unsubscribe).toHaveBeenCalled();
  });
});
