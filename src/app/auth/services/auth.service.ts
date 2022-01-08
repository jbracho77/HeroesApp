import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Auth } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;

  get auth() {
    return { ...this._auth }
  }
  
  constructor( private http: HttpClient ) { }

  verificarAutenticacion(): Observable<boolean> {

    let token: string | null = localStorage.getItem('token');

    if ( !token ) {
      return of( false );
    }

    return this.http.get<Auth>(`${ this.baseUrl }/usuarios/${ token }`)
                .pipe(
                  map( auth => {
                    this._auth = auth
                    return true;
                  })
                );

  }
  
  login( id: string = '1') {
    return this.http.get<Auth>(`${ this.baseUrl }/usuarios/${ id }`)
              .pipe(
                tap( resp => this._auth = resp ),
                tap( resp => localStorage.setItem('token', resp.id)) 
              );
  }

  logout() {
    this._auth = undefined;
    
  }

}
