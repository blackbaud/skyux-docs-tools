import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsTypeAliasDefinitionComponent
} from '../type-alias-definition.component';

@Component({
  selector: 'type-alias-definition-test',
  templateUrl: './type-alias-definition.component.fixture.html'
})
export class TypeAliasDefinitionFixtureComponent {

  @ViewChild(SkyDocsTypeAliasDefinitionComponent)
  public typeAliasDefinitionRef: SkyDocsTypeAliasDefinitionComponent;

}
