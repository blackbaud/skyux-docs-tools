import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsJSDocsService
} from './jsdoc.service';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

import {
  TypeDocEntry,
  TypeDocEntryChild
} from './typedoc-types';

@Component({
  selector: 'sky-docs-type-alias-definition',
  templateUrl: './type-alias-definition.component.html',
  styleUrls: ['./type-alias-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsTypeAliasDefinitionComponent {

  @Input()
  public set config(value: TypeDocEntry) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocEntry {
    return this._config;
  }

  public description: string;

  public sourceCode: string;

  public callSignature: TypeDocEntryChild;

  private _config: TypeDocEntry;

  constructor(
    private jsDocsService: SkyDocsJSDocsService,
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    delete this.callSignature;
    delete this.description;
    delete this.sourceCode;

    const tags = this.jsDocsService.parseCommentTags(this.config?.comment);
    this.description = tags.description;

    this.sourceCode = this.formatService.parseTypeAliasSourceCodeSignature(this.config);

    this.callSignature = (this.config?.type?.declaration?.signatures)
      ? {
        comment: this.config?.comment,
        kindString: 'Call signature',
        type: this.config?.type
      }
      : undefined;
  }

}
