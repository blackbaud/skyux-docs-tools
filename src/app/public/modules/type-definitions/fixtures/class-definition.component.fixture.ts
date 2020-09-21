import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsClassDefinitionComponent
} from '../class-definition.component';

import {
  TypeDocEntry
} from '../typedoc-types';

@Component({
  selector: 'class-definition-test',
  templateUrl: './class-definition.component.fixture.html'
})
export class ClassDefinitionFixtureComponent {

  public config: TypeDocEntry;

  @ViewChild(SkyDocsClassDefinitionComponent)
  public classDefinitionRef: SkyDocsClassDefinitionComponent;

}
