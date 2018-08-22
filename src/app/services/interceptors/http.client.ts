import {Http, Request, Response, RequestOptions, Headers, XHRBackend} from '@angular/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

@Injectable()
// custom http class, add interceptor functions here
export class HttpClient extends Http {

  private _user;
  private _system;

  private _refreshToken: string = localStorage.getItem('refreshToken');

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private _store: Store<any>) {
    super(backend, defaultOptions);
    _store.select('user').distinctUntilChanged().subscribe(user => this._user = user);
  }

  createHeader(headers: Headers) {
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('auth-token', this._user['account']['token'] || '');
  }

  get(url: string, params?: Object): Observable<Response> {
    params = params || new Object;
    console.info('getting...', url, params);
    let requestHeader = new Headers();
    this.createHeader(requestHeader);
    // attach 

    let options = {
      search: params,
      headers: requestHeader
    };
    return super.get(url, options);
  }

  post(url: string, body?: Object): Observable<Response> {
    body = body || new Object;
    // attach 

    let requestHeader = new Headers();
    this.createHeader(requestHeader);
    let options = new RequestOptions({
      headers: requestHeader
    });
    console.info('posting...');
    return super.post(url, body, options);
  };

}
