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
  selector: 'sky-docs-directive-definition',
  templateUrl: './directive-definition.component.html',
  styleUrls: ['./directive-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDirectiveDefinitionComponent {

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

  public eventProperties: TypeDocItemMember[];

  public inputProperties: TypeDocItemMember[];

  public selector: string;

  private _config: TypeDocItem;

  constructor(
    private jsDocsService: SkyDocsJSDocsService
  ) { }

  private parseSelector(item: TypeDocItem): string {
    const decoratorSource = item.decorators[0].arguments.obj;
    return (decoratorSource.indexOf('selector: `') > -1)
      ? decoratorSource.split('selector: `')[1].split('`')[0].replace(/\s\s+/g, ' ')
      : decoratorSource.split('selector: \'')[1].split('\'')[0];
  }

  private updateView(): void {
    this.selector = this.parseSelector(this.config);

    const tags = this.jsDocsService.parseCommentTags(this.config.comment);
    this.codeExample = tags.codeExample;
    this.codeExampleLanguage = tags.codeExampleLanguage;
    this.description = tags.description;

    if (this.config.children) {
      this.inputProperties = this.config.children.filter(c => c.decorators && c.decorators[0].name === 'Input');
      this.eventProperties = this.config.children.filter(c => c.decorators && c.decorators[0].name === 'Output');
    }
  }

}
