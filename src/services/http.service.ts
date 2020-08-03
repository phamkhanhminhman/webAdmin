
import {throwError as observableThrowError,  Observable ,  Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { UserService } from './user.service';

declare const CryptoJS: any;

@Injectable()
/**
 * export component
 */
export class HttpService {

  private currentUser = this._userService.getProfile()
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': '123'
    })
  };

  /**
   * Constructor function
   */
  constructor(
    private _http: HttpClient,
    private _userService: UserService,
    private _router: Router) {
  }
  /**
   * get method
   * @param path : url
   */
  getHttp(path: string, token = false): Observable<any> {
    const self = this;
    return this._http.get(path, this.httpOptions)
      .pipe(
        map((res: Response) => res),
        catchError((err, caught) => {
          // return Observable.empty();
          return self.handleError(err);
        })
      );
  }
  /**
   * post method
   * @param path : url
   * @param body : Object body
   */
  postHttp(path: string, body: Object, token = false): Observable<any> {
    const self = this;
    return this._http.post(path, body) // ...using post request
      .pipe(
        map((res: Response) => res), // ...and calling .json() on the response to return data
        catchError((err, caught) => {
          // return Observable.empty();
          return self.handleError(err);
        })
      );
  }

  // /**
  //  * put method
  //  * @param path : url
  //  * @param body : Object body
  //  */
  // putHttp(path: string, body: Object, token = false): Observable<any> {
  //   const self = this;
  //   return this._http.put(path, body, this.sendToken(token)) // ...using put request
  //     .pipe(
  //       map((res: Response) => res.json()), // ...and calling .json() on the response to return data
  //       catchError((err, caught) => {
  //         // return Observable.empty();
  //         return self.handleError(err);
  //       })
  //     );
  //     // .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
  // }
  // /**
  //  * delete method
  //  * @param path : url
  //  */
  // deleteHttp(path: string, token = false): Observable<any> {
  //   const self = this;
  //   return this._http.delete(path, this.sendToken(token)) // ...using put request
  //   .pipe(
  //     map((res: Response) => res.json()), // ...and calling .json() on the response to return data
  //     catchError((err, caught) => {
  //       // return Observable.empty();
  //       return self.handleError(err);
  //     })
  //   );
  //     // .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
  // }

  /**
   * Sent token for each request.
   */
  private sendToken(token) {
    // create authorization header with jwt token
    const currentUser = this._userService.getProfile();
    // const lang = localStorage.getItem('currentLanguage');
    if (currentUser && currentUser.access_token && token === true) {
      const headers = new Headers({
        'Authorization': currentUser.access_token,
        // 'Accept-Language': lang,
      });
      return new HttpHeaders({ 'Authorization': currentUser.access_token });
    } else {
      const headers = new Headers({
        // 'Accept-Language': lang,
      });
      return new HttpHeaders({  });
    }
  }

  /**
   * Handle exception
   * @param  {any}    error [array]
   * @return {[String]}    Info err.
   */
   private handleError(error: any) {
    if (error.status === 503) {

      this._router.navigate(['/503']);
    } else if (error.status === 403) {
      const errBody = JSON.parse(error._body);

      if (errBody.errors[0].error_code === 4003 || errBody.errors[0].error_code === 40303 ) {
        this._userService.destroy();
        // this._router.navigate(['/login']);
      }

      this._router.navigate(['/login']);
    // } else if (error.status === 405) {

    //   this._userService.destroy();
    //   this._router.navigate(['/login']);
    } else {
    }

    return observableThrowError(error);
  }
}
