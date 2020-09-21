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
  TypeDocEntryChild
} from './typedoc-types';

/**
 * "Call signatures" include methods, functions, and inline arrow functions.
 * This component is used to document both the return type and parameters of a given call signature.
 */
@Component({
  selector: 'sky-docs-call-signature-definition',
  templateUrl: './call-signature-definition.component.html',
  styleUrls: ['./call-signature-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCallSignatureDefinitionComponent {

  @Input()
  public set config(value: TypeDocEntryChild) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocEntryChild {
    return this._config;
  }

  public codeExample: string;

  public codeExampleLanguage: string;

  public hasParameters: boolean;

  public returnType: string;

  private _config: TypeDocEntryChild;

  constructor(
    private jsDocsService: SkyDocsJSDocsService,
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    delete this.codeExample;
    delete this.codeExampleLanguage;
    delete this.hasParameters;
    delete this.returnType;

    const callSignatures = this.config?.signatures || this.config?.type?.declaration?.signatures;
    if (callSignatures) {
      const tags = this.jsDocsService.parseCommentTags(callSignatures[0].comment);
      this.returnType = this.formatService.parseFormattedType(callSignatures[0]);
      this.hasParameters = !!(callSignatures[0].parameters);
      this.codeExample = tags.codeExample;
      this.codeExampleLanguage = tags.codeExampleLanguage;
    }
  }

}
