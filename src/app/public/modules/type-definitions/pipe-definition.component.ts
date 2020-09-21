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
  selector: 'sky-docs-pipe-definition',
  templateUrl: './pipe-definition.component.html',
  styleUrls: ['./pipe-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPipeDefinitionComponent {

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

  public transformMethod: TypeDocEntryChild;

  private _config: TypeDocEntry;

  constructor(
    private jsDocsService: SkyDocsJSDocsService
  ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    delete this.codeExample;
    delete this.codeExampleLanguage;
    delete this.description;
    delete this.transformMethod;

    const tags = this.jsDocsService.parseCommentTags(this.config.comment);
    this.description = tags.description;
    this.codeExample = tags.codeExample;
    this.codeExampleLanguage = tags.codeExampleLanguage;

    this.transformMethod = this.config.children
      .find(c => !!(c.kindString === 'Method' && c.name === 'transform'));
  }

}
