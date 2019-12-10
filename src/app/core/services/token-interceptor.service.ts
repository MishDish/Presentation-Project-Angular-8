import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './../../features/auth/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private router: Router, private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if ((request.url.indexOf('/auth/') === -1 && request.url.indexOf('assets/') === -1)) {
            const authService = this.injector.get(AuthService);
            const token = authService.getToken();

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(tap(o => {
            if (o instanceof HttpResponse) {
                // TO DO : add handling for load time, progress bar or something
            }
        }), catchError((error, caught) => {
            this.handleAuthError(error);
            return of(error);
        }) as any);
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401 || err.status === 403) {
            const authService = this.injector.get(AuthService);
            authService.logout();
            this.router.navigate([`/login`]);
        }
        throw err;
    }
}
