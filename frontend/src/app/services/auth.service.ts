import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //BehaviorSubject jest używany do śledzenia bieżącego stanu zalogowania, a Observable umożliwia subskrybowanie tych zmian.

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false); // Obiekt zachowujacy swoja wartosc w czasie, moze byc obserwowany, ale dodatkowo przechuwje swoja ostatnia wartosc,
  //która była wysłana, dzięki czemu nowi subskrybenci otrzymają bieżącą wartość od razu po subskrypcji.
  isLoggedIn$: Observable<boolean> = this._isLoggedIn$.asObservable(); //Wlasciwosc publiczna ($ bo obseravble - taka konwencja), dzieki ktorej mozna ja uzywac i subskybowac zmiany stanu zalogowania ale nie ozna go zmieniac
  router = inject(Router);

  constructor() { 
    this.checkToken();
  }

  private checkToken(){
    const token = this.getToken();
    this._isLoggedIn$.next(!!token);
    console.log(this._isLoggedIn$)
  }

  login(token: string) {
    this.setToken(token);
    this._isLoggedIn$.next(true);
  }

  getParsedToken(){
    const token = this.getToken() ?? "";
    return JSON.parse(atob(token.split('.')[1]))
  }

  setToken(token: string){
    localStorage.setItem('authToken', token);
  }

  getToken(){
    return localStorage.getItem('authToken');
  }

  removeToken(){
    localStorage.removeItem('authToken');
  }

  logout(){
    this.removeToken();
    this._isLoggedIn$.next(false);
    this.router.navigate(['login']);
  }
}
