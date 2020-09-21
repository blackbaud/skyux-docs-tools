import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsPropertyDefinitionsComponent
} from '../property-definitions.component';

@Component({
  selector: 'property-definition-test',
  templateUrl: './property-definitions.component.fixture.html'
})
export class PropertyDefinitionsFixtureComponent {

  @ViewChild(SkyDocsPropertyDefinitionsComponent)
  public propertyDefinitionsRef: SkyDocsPropertyDefinitionsComponent;

}
