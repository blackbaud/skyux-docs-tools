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
  selector: 'sky-docs-class-definition',
  templateUrl: './class-definition.component.html',
  styleUrls: ['./class-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsClassDefinitionComponent {

  @Input()
  public set config(value: TypeDocItem) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocItem {
    return this._config;
  }

  public description: string;

  public methods: TypeDocItemMember[];

  public properties: TypeDocItemMember[];

  private _config: TypeDocItem;

  constructor(
    private jsDocsService: SkyDocsJSDocsService
  ) { }

  private updateView(): void {
    const tags = this.jsDocsService.parseCommentTags(this.config.comment);
    this.description = tags.description;

    if (this.config.children) {
      this.properties = this.config.children.filter(c => c.kindString === 'Property');
      this.methods = this.config.children
        .filter(c => c.kindString === 'Method' && c.name !== 'ngOnDestroy')
        .map(c => c.signatures[0]);
    }
  }

}
