import {
  NgModule
} from '@angular/core';

import {
  SkyDocsCodeExamplesModule
} from './modules/code-examples/code-examples.module';

import {
  SkyDocsDemoModule
} from './modules/demo';

import {
  SkyDocsDemoPageModule
} from './modules/demo-page/demo-page.module';

import {
  SkyDocsDesignGuidelinesModule
} from './modules/design-guidelines/design-guidelines.module';

import {
  SkyDocsSupportalService
} from './modules/shared/docs-tools-supportal.service';

/**
 * This module conveniently exports the most commonly used modules.
 */
@NgModule({
  exports: [
    SkyDocsCodeExamplesModule,
    SkyDocsDemoModule,
    SkyDocsDemoPageModule,
    SkyDocsDesignGuidelinesModule
  ],
  providers: [
    SkyDocsSupportalService
  ]
})
export class SkyDocsToolsModule { }
