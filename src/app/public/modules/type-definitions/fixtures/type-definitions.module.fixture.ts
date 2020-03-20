import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsModule
} from '../type-definitions.module';

import {
  PropertyDefinitionsFixtureComponent
} from './property-definitions.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsTypeDefinitionsModule
  ],
  exports: [
    PropertyDefinitionsFixtureComponent
  ],
  declarations: [
    PropertyDefinitionsFixtureComponent
  ]
})
export class TypeDefinitionsFixturesModule { }
