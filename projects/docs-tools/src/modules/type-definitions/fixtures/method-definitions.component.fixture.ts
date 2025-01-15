import { Component, ViewChild } from '@angular/core';

import { SkyDocsClassMethodDefinition } from '../method-definition';

import { SkyDocsMethodDefinitionsComponent } from '../method-definitions.component';

@Component({
  selector: 'sky-method-definitions-test',
  templateUrl: './method-definitions.component.fixture.html',
  standalone: false,
})
export class MethodDefinitionsFixtureComponent {
  public config: { methods?: SkyDocsClassMethodDefinition[] };

  @ViewChild(SkyDocsMethodDefinitionsComponent)
  public methodDefinitionsRef: SkyDocsMethodDefinitionsComponent;
}
