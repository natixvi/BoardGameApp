import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { withInterceptorsFromDi, provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { JwtInterceptor } from './app/services/jwt/jwt.interceptor'


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(AppRoutingModule),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
    ]
})
  .catch(err => console.error(err));
