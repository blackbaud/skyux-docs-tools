import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { SkyDocsTypeAliasDefinition } from './type-definitions';
import { SkyDocsTypeDefinitionsFormatService } from './type-definitions-format.service';

@Component({
  selector: 'sky-docs-type-alias-definition',
  templateUrl: './type-alias-definition.component.html',
  styleUrls: ['./type-alias-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsTypeAliasDefinitionComponent {

  @Input()
  public set config(value: SkyDocsTypeAliasDefinition) {
    this._config = value;
    this.updateView();
  }

  public get config(): SkyDocsTypeAliasDefinition {
    return this._config;
  }

  public sourceCode: string;

  private _config: SkyDocsTypeAliasDefinition;

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    delete this.sourceCode;

    this.sourceCode = this.formatService.getTypeAliasSourceCode(this.config);
  }

}
