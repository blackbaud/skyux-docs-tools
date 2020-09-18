import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsJSDocsService
} from './jsdoc.service';

import {
  TypeDocItem,
  TypeDocItemMember
} from './typedoc-types';

@Component({
  selector: 'sky-docs-pipe-definition',
  templateUrl: './pipe-definition.component.html',
  styleUrls: ['./pipe-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPipeDefinitionComponent {

  @Input()
  public set config(value: TypeDocItem) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocItem {
    return this._config;
  }

  public codeExample: string;

  public codeExampleLanguage: string;

  public description: string;

  public transformMethod: TypeDocItemMember;

  private _config: TypeDocItem;

  constructor(
    private jsDocsService: SkyDocsJSDocsService
  ) { }

  private updateView(): void {
    const tags = this.jsDocsService.parseCommentTags(this.config.comment);
    this.description = tags.description;
    this.codeExample = tags.codeExample;
    this.codeExampleLanguage = tags.codeExampleLanguage;

    const transformMethod = this.config.children.find(child => {
      return (child.kindString === 'Method' && child.name === 'transform');
    });

    this.transformMethod = transformMethod;
  }

}
