import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { Elevator } from '../../models/dashboard.model';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  elevators$: Observable<Elevator[]>;
  dashboardLoaded$: Observable<boolean>;
  displayedColumns: string[] = ['id', 'elevatorCode', 'statusCode', 'statusDescription', 'lastUpdated'];
  dataSource: MatTableDataSource<Elevator> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: DashboardService, ) { }

  ngOnInit() {
    this.service.getAllElevators();
    this.elevators$ = this.service.elevators$;
    this.dashboardLoaded$ = this.service.dashboardLoaded$.asObservable();

    this.service.elevators$.subscribe(d => {
      this.dataSource.data = d;
      this.dataSource.paginator = this.paginator;
    });

  }

  ngOnDestroy(): void {
    if (this.service.statusPoll) {
      this.service.statusPoll.unsubscribe();
    }
  }

}
