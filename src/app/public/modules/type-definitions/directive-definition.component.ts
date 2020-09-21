import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsJSDocsService
} from './jsdoc.service';

import {
  TypeDocEntry,
  TypeDocEntryChild
} from './typedoc-types';

@Component({
  selector: 'sky-docs-directive-definition',
  templateUrl: './directive-definition.component.html',
  styleUrls: ['./directive-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDirectiveDefinitionComponent {

  @Input()
  public set config(value: TypeDocEntry) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocEntry {
    return this._config;
  }

  public codeExample: string;

  public codeExampleLanguage: string;

  public description: string;

  public eventProperties: TypeDocEntryChild[];

  public inputProperties: TypeDocEntryChild[];

  public selector: string;

  private _config: TypeDocEntry;

  constructor(
    private jsDocsService: SkyDocsJSDocsService
  ) { }

  private parseSelector(item: TypeDocEntry): string {
    if (!item) {
      return '';
    }

    const decoratorSource = item.decorators[0].arguments.obj;
    return (decoratorSource.indexOf('selector: `') > -1)
      ? decoratorSource.split('selector: `')[1].split('`')[0].replace(/\s\s+/g, ' ')
      : decoratorSource.split('selector: \'')[1].split('\'')[0];
  }

  private updateView(): void {

    // Reset view properties when the config changes.
    delete this.codeExample;
    delete this.codeExampleLanguage;
    delete this.description;
    delete this.eventProperties;
    delete this.inputProperties;
    delete this.selector;

    const tags = this.jsDocsService.parseCommentTags(this.config.comment);
    this.codeExample = tags.codeExample;
    this.codeExampleLanguage = tags.codeExampleLanguage;
    this.description = tags.description;

    this.selector = this.parseSelector(this.config);
    this.inputProperties = this.config?.children?.filter(c => c.decorators && c.decorators[0].name === 'Input');
    this.eventProperties = this.config?.children?.filter(c => c.decorators && c.decorators[0].name === 'Output');
  }

}
