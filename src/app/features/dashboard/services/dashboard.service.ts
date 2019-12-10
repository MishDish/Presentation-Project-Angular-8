import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_ROUTE } from '@@core/core.model';
import {
    Elevator,
    ElevatorsResponse,
    ElevatorStats,
    ElevatorUpdateRequestBody
} from '../models/dashboard.model';
import { BehaviorSubject, Subscription, defer, of, pipe } from 'rxjs';
import { repeatWhen, delay, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    elevators$ = new BehaviorSubject<Elevator[]>([]);
    elevator$ = new BehaviorSubject<Elevator>({} as Elevator);
    elevatorStats$ = new BehaviorSubject<ElevatorStats>({} as ElevatorStats);
    dashboardLoaded$ = new BehaviorSubject<boolean>(false);
    elevatorStatsLoaded$ = new BehaviorSubject<boolean>(false);
    statusPoll: Subscription;

    apiBaseUrl: string;

    POLLING_TIME_INTERVAL = 50000;

    constructor(private httpClient: HttpClient) {
        this.apiBaseUrl = API_BASE_ROUTE;
    }

    /**
     * Gets all the elevators data
     */
    getAllElevators(pageSize: number = 50, pageNum: number = 1) {
        const apiUrl = `${this.apiBaseUrl}elevator/getAll?pageSize=${pageSize}&pageNumber=${pageNum}`;
        this.statusPoll = defer(() => this.httpClient.get<ElevatorsResponse>(apiUrl))
            .pipe(
                catchError(err => {
                    // console.log('Getting elevators has failed. TO DO: create error handling', err);
                    return of({} as ElevatorsResponse);
                }),
                repeatWhen(n => n.pipe(delay(this.POLLING_TIME_INTERVAL))))
            .subscribe(response => {
                this.elevators$.next(response.elevators);
                this.dashboardLoaded$.next(true);
            });
    }

    /**
     * Get single elevator
     * @param id
     */
    getElevator(id: number) {
        const apiUrl = `${this.apiBaseUrl}elevator/${id}`;
        this.httpClient.get<Elevator>(apiUrl)
            .subscribe(response => {
                this.elevator$.next(response);
                this.dashboardLoaded$.next(true);
            });
        return;
    }

    /**
     * Updates existing elevator
     * @param id
     * @param data Elevator data for saving
     */
    async updateElevator(id: number, data: ElevatorUpdateRequestBody): Promise<string> {
        // Just for a change and simplicity i'm using Promise here instead of Observable
        const apiUrl = `${this.apiBaseUrl}elevator/${id}`;
        try {
            await this.httpClient.put(apiUrl, data).toPromise();
            return Promise.resolve('Ok!');
        } catch (e) {
            // TO DO: Add error handling
            return Promise.reject(`Updating elevator with id : ${id}`);
        }

    }

    /**
     * Adds new elevator
     * @param data
     */
    addNewElevator(data: Elevator) {
        return;
    }

    /**
     * Gets all elevator status codes
     * @param id
     */
    getElevatorStatusCodes(id: number) {

    }

    /**
     * Gets last 5 days statics for elevator
     * @param id
     */
    getElevatorStats(id: number) {
        const apiUrl = `${this.apiBaseUrl}elevator-stats/${id}`;
        this.httpClient.get<ElevatorStats>(apiUrl)
            .pipe(catchError(err => {
                console.log('Getting elevators has failed. TO DO: create error handling', err);
                return of({} as ElevatorStats);
            }))
            .subscribe(response => {
                this.elevatorStats$.next(response);
                this.elevatorStatsLoaded$.next(true);
            });
        return;
    }

}
