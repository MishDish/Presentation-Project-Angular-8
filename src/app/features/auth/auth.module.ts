import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@@core/core.module';
import { AuthService } from './services/auth.service';
@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        CoreModule,
    ],
    providers: [AuthService],
    exports: [
        FormsModule,
        LoginComponent
    ],
})
export class AuthModule { }
