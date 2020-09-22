import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { SkyDocsClassDefinition } from './type-definitions';

@Component({
  selector: 'sky-docs-class-definition',
  templateUrl: './class-definition.component.html',
  styleUrls: ['./class-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsClassDefinitionComponent {

  @Input()
  public set config(value: SkyDocsClassDefinition) {
    this._config = value;
    this.updateView();
  }

  public get config(): SkyDocsClassDefinition {
    return this._config;
  }

  // public description: string;

  // public methods: TypeDocEntryChild[];

  // public properties: TypeDocEntryChild[];

  private _config: SkyDocsClassDefinition;

  constructor(
    // private jsDocsService: SkyDocsJSDocsService
  ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    // delete this.description;
    // delete this.properties;
    // delete this.methods;

    // const tags = this.jsDocsService.getCommentTags(this.config?.comment);
    // this.description = tags.description;
    // this.properties = this.config?.children?.filter(c => c.kindString === 'Property');
    // this.methods = this.config?.children?.filter(c => c.kindString === 'Method' && c.name !== 'ngOnDestroy');
  }

}
