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
  selector: 'sky-docs-class-definition',
  templateUrl: './class-definition.component.html',
  styleUrls: ['./class-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsClassDefinitionComponent {

  @Input()
  public set config(value: TypeDocEntry) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocEntry {
    return this._config;
  }

  public description: string;

  public methods: TypeDocEntryChild[];

  public properties: TypeDocEntryChild[];

  private _config: TypeDocEntry;

  constructor(
    private jsDocsService: SkyDocsJSDocsService
  ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    delete this.description;
    delete this.properties;
    delete this.methods;

    const tags = this.jsDocsService.parseCommentTags(this.config?.comment);
    this.description = tags.description;
    this.properties = this.config?.children?.filter(c => c.kindString === 'Property');
    this.methods = this.config?.children?.filter(c => c.kindString === 'Method' && c.name !== 'ngOnDestroy');
  }

}
