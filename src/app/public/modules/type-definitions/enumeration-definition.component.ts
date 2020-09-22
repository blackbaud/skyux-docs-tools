import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsEnumerationDefinition
} from './enumeration-definition';

@Component({
  selector: 'sky-docs-enumeration-definition',
  templateUrl: './enumeration-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsEnumerationDefinitionComponent {

  @Input()
  public set config(value: SkyDocsEnumerationDefinition) {
    this._config = value;
    this.updateView();
  }

  public get config(): SkyDocsEnumerationDefinition {
    return this._config;
  }

  private _config: SkyDocsEnumerationDefinition;

  private updateView(): void {

    // Reset view properties when the config changes.
    // delete this.description;

    // const tags = this.jsDocsService.getCommentTags(this.config.comment);
    // this.description = tags.description;
  }

}
