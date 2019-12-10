import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.isAuthenticate$.pipe(map(logged => {
            const isTokenExpired = this.authService.isTokenExpired();
            // TO DO: Create extend token functionality
            if (!logged || isTokenExpired) {
                this.router.navigate(['/login']);
                return false;
            }
            // TO DO: add saved active route after login and redirеct
            return true;
        })
        );
    }

}
