import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsDirectiveDefinition
} from './type-definitions';

@Component({
  selector: 'sky-docs-directive-definition',
  templateUrl: './directive-definition.component.html',
  styleUrls: ['./directive-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDirectiveDefinitionComponent {

  @Input()
  public set config(value: SkyDocsDirectiveDefinition) {
    this._config = value;
    this.updateView();
  }

  public get config(): SkyDocsDirectiveDefinition {
    return this._config;
  }

  // public codeExample: string;

  // public codeExampleLanguage: string;

  // public description: string;

  // public eventProperties: SkyDocsClassPropertyDefinition[];

  // public inputProperties: SkyDocsClassPropertyDefinition[];

  // public selector: string;

  private _config: SkyDocsDirectiveDefinition;

  // constructor(
  //   private jsDocsService: SkyDocsJSDocsService
  // ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    // delete this.codeExample;
    // delete this.codeExampleLanguage;
    // delete this.description;
    // delete this.eventProperties;
    // delete this.inputProperties;
    // delete this.selector;

    // const tags = this.jsDocsService.parseCommentTags(this.config?.comment);
    // this.codeExample = tags.codeExample;
    // this.codeExampleLanguage = tags.codeExampleLanguage;
    // this.description = tags.description;

    // this.selector = this.config?.selector;
    // this.inputProperties = this.config?.children?.filter(c => c.decorators && c.decorators[0].name === 'Input');
    // this.eventProperties = this.config?.children?.filter(c => c.decorators && c.decorators[0].name === 'Output');
  }

}
