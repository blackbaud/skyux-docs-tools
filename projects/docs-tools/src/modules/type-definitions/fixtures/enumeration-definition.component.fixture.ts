import { Component, ViewChild } from '@angular/core';

import { SkyDocsEnumerationDefinition } from '../enumeration-definition';

import { SkyDocsEnumerationDefinitionComponent } from '../enumeration-definition.component';

@Component({
  selector: 'sky-enumeration-definition-test',
  templateUrl: './enumeration-definition.component.fixture.html',
  standalone: false,
})
export class EnumerationDefinitionFixtureComponent {
  public config: SkyDocsEnumerationDefinition;

  @ViewChild(SkyDocsEnumerationDefinitionComponent)
  public enumerationDefinitionRef: SkyDocsEnumerationDefinitionComponent;
}
