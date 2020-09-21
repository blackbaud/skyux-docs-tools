import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsDirectiveDefinitionComponent
} from '../directive-definition.component';

import {
  TypeDocEntry
} from '../typedoc-types';

@Component({
  selector: 'directive-definition-test',
  templateUrl: './directive-definition.component.fixture.html'
})
export class DirectiveDefinitionFixtureComponent {

  public config: TypeDocEntry;

  @ViewChild(SkyDocsDirectiveDefinitionComponent)
  public directiveDefinitionRef: SkyDocsDirectiveDefinitionComponent;

}
