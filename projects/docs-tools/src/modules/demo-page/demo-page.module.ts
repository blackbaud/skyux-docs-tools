import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  StachePageSummaryModule,
  StacheWrapperModule
} from '@blackbaud/skyux-lib-stache';

import {
  RouterModule
} from '@angular/router';

import {
  SkyTabsModule
} from '@skyux/tabs';

import {
  SkyDocsDemoModule
} from '../demo/demo.module';

import {
  SkyDocsHeadingAnchorModule
} from '../heading-anchor/heading-anchor.module';

import {
  SkyDocsMarkdownModule
} from '../markdown/markdown.module';

import {
  SkyDocsModuleInfoModule
} from '../module-info/module-info.module';

import {
  SkyDocsTypeDefinitionsModule
} from '../type-definitions/type-definitions.module';

import {
  SkyDocsDemoPageSectionComponent
} from './demo-page-section.component';

import {
  SkyDocsDemoPageSummaryComponent
} from './demo-page-summary.component';

import {
  SkyDocsDemoPageComponent
} from './demo-page.component';

import {
  SkyDocsDemoPageModuleInfoComponent
} from './demo-page-module-info.component';

import {
  SkyDocsDemoPageTypeDefinitionsComponent
} from './demo-page-type-definitions.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsDemoModule,
    SkyDocsHeadingAnchorModule,
    SkyDocsMarkdownModule,
    SkyDocsModuleInfoModule,
    SkyDocsTypeDefinitionsModule,
    SkyTabsModule,
    StachePageSummaryModule,
    StacheWrapperModule
  ],
  declarations: [
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageModuleInfoComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsDemoPageTypeDefinitionsComponent
  ],
  exports: [
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageModuleInfoComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsDemoPageTypeDefinitionsComponent
  ]
})
export class SkyDocsDemoPageModule { }
