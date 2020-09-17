import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsTypeAliasDefinition
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
  public config: SkyDocsTypeAliasDefinition;

  public get callSignature(): any | undefined {
    return (typeof this.config.type === 'string')
      ? undefined
      : this.config.type?.callSignature;
  }

  public get sourceCode(): string {
    return this.formatService.getTypeAliasSignature(this.config);
  }

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

}
