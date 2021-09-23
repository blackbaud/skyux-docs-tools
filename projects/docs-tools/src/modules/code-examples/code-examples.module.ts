import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyVerticalTabsetModule
} from '@skyux/tabs';

import {
  SkyDocsToolsResourcesModule
} from '../shared/docs-tools-resources.module';

import {
  SkyDocsSourceCodeModule
} from '../source-code/source-code.module';

import {
  SkyDocsCodeExampleComponent
} from './code-example.component';

import {
  SkyDocsCodeExamplesComponent
} from './code-examples.component';

import {
  SkyDocsCodeExamplesEditorService
} from './code-examples-editor.service';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeBlockModule,
    SkyDocsSourceCodeModule,
    SkyDocsToolsResourcesModule,
    SkyIconModule,
    SkyRepeaterModule,
    SkyVerticalTabsetModule
  ],
  declarations: [
    SkyDocsCodeExampleComponent,
    SkyDocsCodeExamplesComponent
  ],
  exports: [
    SkyDocsCodeExampleComponent,
    SkyDocsCodeExamplesComponent
  ],
  providers: [
    SkyDocsCodeExamplesEditorService
  ]
})
export class SkyDocsCodeExamplesModule { }
