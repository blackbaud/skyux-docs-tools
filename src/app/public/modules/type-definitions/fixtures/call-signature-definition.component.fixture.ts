import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsCallSignatureDefinitionComponent
} from '../call-signature-definition.component';

import {
  TypeDocEntryChild
} from '../typedoc-types';

@Component({
  selector: 'call-signature-definition-test',
  templateUrl: './call-signature-definition.component.fixture.html'
})
export class CallSignatureDefinitionFixtureComponent {

  public config: TypeDocEntryChild;

  @ViewChild(SkyDocsCallSignatureDefinitionComponent)
  public callSignatureDefinitionRef: SkyDocsCallSignatureDefinitionComponent;

}
