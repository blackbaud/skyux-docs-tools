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
  TypeDocItem,
  TypeDocItemMember
} from './typedoc-types';

@Component({
  selector: 'sky-docs-type-alias-definition',
  templateUrl: './type-alias-definition.component.html',
  styleUrls: ['./type-alias-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsTypeAliasDefinitionComponent {

  @Input()
  public set config(value: TypeDocItem) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocItem {
    return this._config;
  }

  public description: string;

  public sourceCode: string;

  public callSignature: TypeDocItemMember;

  private _config: TypeDocItem;

  constructor(
    private jsDocsService: SkyDocsJSDocsService,
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {
    const tags = this.jsDocsService.parseCommentTags(this.config.comment);

    this.description = tags.description;
    this.sourceCode = this.formatService.getTypeAliasSignatureHTML(this.config);

    if (this.config.type.declaration?.signatures) {
      this.callSignature = {
        comment: this.config.comment,
        type: this.config.type
      };
    } else {
      this.callSignature = undefined;
    }
  }

}
