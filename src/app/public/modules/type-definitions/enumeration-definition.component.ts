import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsJSDocsService
} from './jsdoc.service';

import {
  TypeDocEntry
} from './typedoc-types';

@Component({
  selector: 'sky-docs-enumeration-definition',
  templateUrl: './enumeration-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsEnumerationDefinitionComponent {

  @Input()
  public set config(value: TypeDocEntry) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocEntry {
    return this._config;
  }

  public description: string;

  private _config: TypeDocEntry;

  constructor(
    private jsDocsService: SkyDocsJSDocsService
  ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    delete this.description;

    const tags = this.jsDocsService.parseCommentTags(this.config.comment);
    this.description = tags.description;
  }

}
