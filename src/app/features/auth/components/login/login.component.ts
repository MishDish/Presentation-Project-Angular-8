import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, Form, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  successMessage: boolean;
  wrongPassword: boolean;
  isAuthenticate$: Observable<boolean>;

  readonly REDIRECT_TIMEOUT = 1000;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.isAuthenticate$ = this.authService.isAuthenticate$.asObservable();

    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login() {
    try {
      await this.authService.login(this.loginForm.value.userName, this.loginForm.value.password);
      this.successMessage = true;

      setTimeout(() => {
        if (this.activatedRoute.snapshot.params.redirect) {
          this.router.navigateByUrl(this.activatedRoute.snapshot.params.redirect);
        } else {
          this.router.navigate(['/']);
        }
      }, this.REDIRECT_TIMEOUT);

    } catch (error) {
      this.wrongPassword = true;
      this.loginForm.controls.password.setErrors({ wrongPassword: true });
    }
  }

}
