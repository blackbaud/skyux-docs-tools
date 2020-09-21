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
  selector: 'sky-docs-interface-definition',
  templateUrl: './interface-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsInterfaceDefinitionComponent {

  @Input()
  public set config(value: TypeDocEntry) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocEntry {
    return this._config;
  }

  public description: string;

  public properties: TypeDocEntryChild[];

  public sourceCode: string;

  private _config: TypeDocEntry;

  constructor(
    private jsDocsService: SkyDocsJSDocsService,
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    delete this.description;
    delete this.sourceCode;

    const tags = this.jsDocsService.parseCommentTags(this.config?.comment);
    this.description = tags.description;
    this.sourceCode = this.formatService.parseInterfaceSourceCodeSignature(this.config);
  }

}
