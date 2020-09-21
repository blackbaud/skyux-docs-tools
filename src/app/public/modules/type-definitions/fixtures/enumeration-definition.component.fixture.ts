import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsEnumerationDefinitionComponent
} from '../enumeration-definition.component';

@Component({
  selector: 'enumeration-definition-test',
  templateUrl: './enumeration-definition.component.fixture.html'
})
export class EnumerationDefinitionFixtureComponent {

  @ViewChild(SkyDocsEnumerationDefinitionComponent)
  public enumerationDefinitionRef: SkyDocsEnumerationDefinitionComponent;

}
