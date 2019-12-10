import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token-interceptor.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('TokenInterceptor', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [TokenInterceptor]
    }));

    it('should be created', () => {
        const service: TokenInterceptor = TestBed.get(TokenInterceptor);
        expect(service).toBeTruthy();
    });
});
