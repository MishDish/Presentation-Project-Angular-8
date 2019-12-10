import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ElevatorUpdateRequestBody, ElevatorStats, Elevator } from '../models/dashboard.model';
import { API_BASE_ROUTE } from '@@core/core.model';

describe('DashboardService', () => {

  let httpTestingController: HttpTestingController;
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }),

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(DashboardService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('verifies that updateElevator is providing succesfull PUT request', async (done) => {
    // 1. Arrange
    const id = 2;
    const data: ElevatorUpdateRequestBody = {
      statusCode: '123',
      account: 1,
      buildingName: '321',
      elevatorCode: 'elev1'
    };
    // 2. Act
    const actualPromise = service.updateElevator(id, data);
    const request = httpMock.expectOne(`${API_BASE_ROUTE}elevator/${id}`);
    request.flush({});
    const actual = await actualPromise;
    // 3. Assert
    expect(actual).toBe('Ok!');
    done();
  });

  it('verifies that updateElevator is rejecting if input provided is not wrong', async (done) => {
    // 1. Arrange
    const id = 2;
    const data: ElevatorUpdateRequestBody = {
      statusCode: '123',
      account: 0,
      buildingName: '321',
      elevatorCode: 'elev1'
    };
    // 2. Act
    const actualPromise = service.updateElevator(id, data);
    const request = httpMock.expectOne(`${API_BASE_ROUTE}elevator/${id}`);
    request.flush({}, { status: 400, statusText: 'Bad Request' });

    actualPromise.catch((e) => {
      // 3. Assert
      expect(e).toBe('Updating elevator with id : 2');
      done();
    });
  });

  it('verifies that getElevatorStats gets and provides data properly', () => {
    // 1. Arrange
    const id = 2;
    const data: ElevatorStats = {
      id: 1,
      elevatorCode: '123',
      stats: {
        '27-5-44': 123354,
        '27-5s-44': 123354,
        '27-5a-44': 123354,
      }
    };
    // 2. Act
    service.getElevatorStats(id);
    const request = httpMock.expectOne(`${API_BASE_ROUTE}elevator-stats/${id}`);
    request.flush(data);

    // 3. Assert
    service.elevatorStats$.subscribe(r => {
      expect(r).toEqual(data);
    });
    service.elevatorStatsLoaded$.subscribe(b => {
      expect(b).toBeTruthy();
    });
  });

  it('verifies that getElevator gets and provides single elevator data properly', () => {
    // 1. Arrange
    const id = 2;
    const data: Elevator = {
      id: 1,
      elevatorCode: '123',
      statusCode: '123',
      statusDescription: 'desc',
      lastUpdated: null
    };
    // 2. Act
    service.getElevator(id);
    const request = httpMock.expectOne(`${API_BASE_ROUTE}elevator/${id}`);
    request.flush(data);

    // 3. Assert
    service.elevator$.subscribe(r => {
      expect(r).toEqual(data);
    });
    service.dashboardLoaded$.subscribe(b => {
      expect(b).toBeTruthy();
    });
  });
});
