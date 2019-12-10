import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import {
  Elevator,
  ElevatorStats,
  ElevatorUpdateRequestBody
} from '../../models/dashboard.model';
import { combineLatest, Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-single-elevator',
  templateUrl: './single-elevator.component.html',
  styleUrls: ['./single-elevator.component.scss']
})
export class SingleElevatorComponent implements OnInit {

  elevatorId: number;
  elevatorData$: Elevator;
  elevatorStats$: ElevatorStats;

  editMode = false;

  form: FormGroup;

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Elavator availability in the Last 5 days' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: false,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  lineChartLegend = true;
  lineChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private dashboardService: DashboardService, private activedRoute: ActivatedRoute, private formBuilder: FormBuilder, ) {

  }

  async onSubmit() {
    const updatedElevator: ElevatorUpdateRequestBody = {
      elevatorCode: this.form.value.elevatorName,
      buildingName: '222', // Important : check with the backend team about this value. For the moment it is init. to default 222
      statusCode: this.elevatorData$.statusCode,
      account: 1  // Important : check with the backend team about this value. For the moment it is init. to default 1
    };

    await this.dashboardService.updateElevator(this.elevatorId, updatedElevator);
    this.elevatorData$.elevatorCode = this.form.value.elevatorName;
    this.editMode = false;
  }

  ngOnInit() {
    this.elevatorId = this.activedRoute.snapshot.params.id;

    this.form = this.formBuilder.group({
      elevatorName: ['']
    });

    this.dashboardService.getElevator(this.elevatorId);
    this.dashboardService.getElevatorStats(this.elevatorId);

    combineLatest([this.dashboardService.elevator$, this.dashboardService.elevatorStats$])
      .pipe(tap(([elevator, elevatorStats]) => [elevator, elevatorStats]))
      .subscribe(([elevator, elevatorStats]) => {
        this.elevatorData$ = elevator;
        this.form.get('elevatorName').setValue(this.elevatorData$.elevatorCode);
        this.elevatorStats$ = elevatorStats;

        if (elevatorStats.stats) {
          Object.keys(elevatorStats.stats).forEach(i => {
            this.lineChartData[0].data.push(this.elevatorStats$.stats[i]);
            this.lineChartLabels.push(i);
          });
        }

      });
  }

}
