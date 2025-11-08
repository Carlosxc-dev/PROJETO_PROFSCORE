import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthenticateService } from '../../../modules/auth-module/services/authenticate/service-authenticate';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private authenticationService: AuthenticateService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.authenticationService.checkAuthentication();

    if (!token) {
      this.authenticationService.logout();
      return false;
    }

    return true;
  }
}