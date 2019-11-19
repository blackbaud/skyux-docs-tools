import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  pluck
} from 'rxjs/operators';

import {
  SkyDocsComponentInfo
} from './docs-tools-component-info';

@Injectable()
export class SkyDocsSupportalService {
  constructor(
    private http: HttpClient
  ) {}

  public getComponentsInfo(): Observable<SkyDocsComponentInfo[]> {
    return this.http
      .get('https://sky-pusa01.app.blackbaud.net/skysp/v1/docs/components-info')
      .pipe(
        pluck('components')
      );
  }
}
