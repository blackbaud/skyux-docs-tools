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

import {
  ParameterDefinitionsFixtureComponent
} from './parameter-definitions.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsTypeDefinitionsModule
  ],
  exports: [
    ParameterDefinitionsFixtureComponent,
    PropertyDefinitionsFixtureComponent
  ],
  declarations: [
    ParameterDefinitionsFixtureComponent,
    PropertyDefinitionsFixtureComponent
  ]
})
export class TypeDefinitionsFixturesModule { }
