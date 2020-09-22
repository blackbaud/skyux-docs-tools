import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsClassPropertyDefinition
} from '../class-property-definition';

import {
  SkyDocsPropertyDefinitionsComponent
} from '../property-definitions.component';

@Component({
  selector: 'property-definition-test',
  templateUrl: './property-definitions.component.fixture.html'
})
export class PropertyDefinitionsFixtureComponent {

  public config: SkyDocsClassPropertyDefinition;

  @ViewChild(SkyDocsPropertyDefinitionsComponent)
  public propertyDefinitionsRef: SkyDocsPropertyDefinitionsComponent;

}
