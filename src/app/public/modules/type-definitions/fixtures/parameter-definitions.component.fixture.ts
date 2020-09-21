import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsParameterDefinitionsComponent
} from '../parameter-definitions.component';

import {
  TypeDocEntryChild
} from '../typedoc-types';

@Component({
  selector: 'parameter-definition-test',
  templateUrl: './parameter-definitions.component.fixture.html'
})
export class ParameterDefinitionsFixtureComponent {

  public config: TypeDocEntryChild;

  @ViewChild(SkyDocsParameterDefinitionsComponent)
  public parameterDefinitionsRef: SkyDocsParameterDefinitionsComponent;

}
