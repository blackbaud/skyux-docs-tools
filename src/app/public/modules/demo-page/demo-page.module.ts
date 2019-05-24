import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  StachePageAnchorModule,
  StachePageSummaryModule,
  StacheWrapperModule
} from '@blackbaud/skyux-lib-stache';

import {
  SkyDocsBehaviorDemoModule
} from '../behavior-demo';

import {
  SkyDocsCodeExamplesModule
} from '../code-examples';

import {
  SkyDocsModuleInfoModule
} from '../module-info';

import {
  SkyDocsDemoPageSectionComponent
} from './demo-page-section.component';

import {
  SkyDocsDemoPageSummaryComponent
} from './demo-page-summary.component';

import {
  SkyDocsDemoPageTitleService
} from './demo-page-title.service';

import {
  SkyDocsDemoPageComponent
} from './demo-page.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsBehaviorDemoModule,
    SkyDocsModuleInfoModule,
    StachePageAnchorModule,
    StachePageSummaryModule,
    StacheWrapperModule
  ],
  declarations: [
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent
  ],
  exports: [
    SkyDocsCodeExamplesModule,
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent
  ],
  providers: [
    SkyDocsDemoPageTitleService
  ]
})
export class SkyDocsDemoPageModule { }
