import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

import {
  TypeDocItemMember
} from './typedoc-types';

@Component({
  selector: 'sky-docs-call-signature-definition',
  template: `
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

  public hasParameters: boolean;

  public returnType: string;

  private _config: TypeDocItemMember;

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {
    this.returnType = this.formatService.parseFormattedType(this.config.type.declaration.signatures[0]);
    this.hasParameters = !!(this.config.type.declaration.signatures[0].parameters);
  }

}
