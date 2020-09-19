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
  selector: 'sky-docs-interface-definition',
  templateUrl: './interface-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsInterfaceDefinitionComponent {

  @Input()
  public set config(value: TypeDocItem) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocItem {
    return this._config;
  }

  public description: string;

  public properties: TypeDocItemMember[];

  public sourceCode: string;

  private _config: TypeDocItem;

  constructor(
    private jsDocsService: SkyDocsJSDocsService,
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {
    const tags = this.jsDocsService.parseCommentTags(this.config.comment);
    this.description = tags.description;
    this.sourceCode = this.formatService.getInterfaceSignatureHTML(this.config);
  }

}
