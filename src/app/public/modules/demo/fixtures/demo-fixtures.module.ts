import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyRestrictedViewAuthService
} from '@blackbaud/skyux-lib-restricted-view/modules/restricted-view/restricted-view-auth.service';

import {
  SkyDocsDemoModule
} from '../demo.module';

import {
  DemoFixtureComponent
} from './demo.component.fixture';

import {
  RestrictedViewAuthMockService
} from './restricted-view-auth-mock.service';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsDemoModule
  ],
  exports: [
    DemoFixtureComponent
  ],
  declarations: [
    DemoFixtureComponent
  ],
  providers: [
    {
      provide: SkyRestrictedViewAuthService,
      useClass: RestrictedViewAuthMockService
    }
  ]
})
export class DemoFixturesModule { }
