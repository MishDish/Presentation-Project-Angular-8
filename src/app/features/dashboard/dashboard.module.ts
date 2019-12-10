import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/view/dashboard.component';
import { CoreModule } from '@@core/core.module';
import { RouterModule } from '@angular/router';
import { SingleElevatorComponent } from './components/single-elevator/single-elevator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [DashboardComponent, SingleElevatorComponent],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ]
})
export class DashboardModule { }
