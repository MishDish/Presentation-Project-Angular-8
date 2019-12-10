import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/view/dashboard.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { AuthGuard } from './features/auth/services/auth-guard';
import { SingleElevatorComponent } from './features/dashboard/components/single-elevator/single-elevator.component';


const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'elevator/:id',
    component: SingleElevatorComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
