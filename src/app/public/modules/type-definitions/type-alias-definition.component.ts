import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsTypeAliasFunctionDefinition,
  SkyDocsTypeAliasIndexSignatureDefinition,
  SkyDocsTypeAliasUnionDefinition
} from './type-alias-definition';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

@Component({
  selector: 'sky-docs-type-alias-definition',
  templateUrl: './type-alias-definition.component.html',
  styleUrls: ['./type-alias-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsTypeAliasDefinitionComponent {

  @Input()
  public config: SkyDocsTypeAliasIndexSignatureDefinition |
    SkyDocsTypeAliasFunctionDefinition |
    SkyDocsTypeAliasUnionDefinition;

  public get sourceCode(): string {
    return this.formatService.getTypeAliasSignature(this.config);
  }

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

}
