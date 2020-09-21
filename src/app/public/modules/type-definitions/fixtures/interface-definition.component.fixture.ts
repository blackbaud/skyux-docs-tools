import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsInterfaceDefinitionComponent
} from '../interface-definition.component';

@Component({
  selector: 'interface-definition-test',
  templateUrl: './interface-definition.component.fixture.html'
})
export class InterfaceDefinitionFixtureComponent {

  @ViewChild(SkyDocsInterfaceDefinitionComponent)
  public interfaceDefinitionRef: SkyDocsInterfaceDefinitionComponent;

}
