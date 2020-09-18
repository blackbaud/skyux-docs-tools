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
  TypeDocItemMember
} from './typedoc-types';

@Component({
  selector: 'sky-docs-call-signature-definition',
  template: `
  <sky-code-block
    class="sky-docs-code-block"
    languageType="typescript"
    [code]="signature"
    [hideHeader]="true"
  ></sky-code-block>

  <ng-container *ngIf="hasParameters">
    <h4 class="sky-docs-type-alias-definition-heading">
      Parameters
    </h4>
    <sky-docs-parameter-definitions
      [config]="config"
    ></sky-docs-parameter-definitions>
  </ng-container>

  <ng-container *ngIf="returnType">
    <h4 class="sky-docs-type-alias-definition-heading">
      Returns
    </h4>

    <p class="sky-docs-type-alias-definition-return-type">
      <sky-code><span
        [innerHtml]="returnType | skyDocsTypeAnchorLinks:'no-code-tags'"
      ></span></sky-code>
    </p>
  </ng-container>

  <ng-container *ngIf="codeExample">
    <h4 class="sky-docs-class-definition-heading">
      Example
    </h4>
    <sky-code-block
      class="sky-docs-code-block"
      [code]="codeExample"
      [hideHeader]="true"
      [languageType]="codeExampleLanguage"
    >
    </sky-code-block>
  </ng-container>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCallSignatureDefinitionComponent {

  @Input()
  public set config(value: TypeDocItemMember) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocItemMember {
    return this._config;
  }

  public codeExample: string;

  public codeExampleLanguage: string;

  public hasParameters: boolean;

  public returnType: string;

  public signature: string;

  private _config: TypeDocItemMember;

  constructor(
    private jsDocsService: SkyDocsJSDocsService,
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {
    const callSignatures = this.config.signatures || this.config.type.declaration.signatures;
    const tags = this.jsDocsService.parseCommentTags(callSignatures[0].comment);
    this.returnType = this.formatService.parseFormattedType(callSignatures[0]);
    this.hasParameters = !!(callSignatures[0].parameters);
    this.signature = this.formatService.parseFormattedType(this.config);
    this.codeExample = tags.codeExample;
    this.codeExampleLanguage = tags.codeExampleLanguage;
  }

}
