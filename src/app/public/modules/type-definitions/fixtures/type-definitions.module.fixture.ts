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
  DirectiveDefinitionFixtureComponent
} from './directive-definition.component.fixture';

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
    DirectiveDefinitionFixtureComponent,
    ParameterDefinitionsFixtureComponent,
    PropertyDefinitionsFixtureComponent
  ],
  declarations: [
    DirectiveDefinitionFixtureComponent,
    ParameterDefinitionsFixtureComponent,
    PropertyDefinitionsFixtureComponent
  ]
})
export class TypeDefinitionsFixturesModule { }
