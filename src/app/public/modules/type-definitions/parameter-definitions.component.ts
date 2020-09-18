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
  SkyDocsTypeDefinitionsService
} from './type-definitions.service';

import {
  TypeDocItemMember
} from './typedoc-types';

interface Parameter {
  description: string;
  signature: string;
}

@Component({
  selector: 'sky-docs-parameter-definitions',
  templateUrl: './parameter-definitions.component.html',
  styleUrls: ['./parameter-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsParameterDefinitionsComponent {

  @Input()
  public set config(value: TypeDocItemMember) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocItemMember {
    return this._config;
  }

  public parameters: Parameter[];

  private _config: TypeDocItemMember;

  constructor(
    private jsDocsService: SkyDocsJSDocsService,
    private formatService: SkyDocsTypeDefinitionsFormatService,
    private typeDefinitionsService: SkyDocsTypeDefinitionsService
  ) { }

  private updateView(): void {
    const parentTags = this.jsDocsService.parseCommentTags(this.config.comment);
    this.parameters = this.config.type.declaration.signatures[0].parameters.map(p => {
      const tags = this.jsDocsService.parseParameterCommentTags(p, parentTags);
      return {
        description: tags.description,
        isOptional: this.typeDefinitionsService.isOptional(p, tags),
        signature: this.formatService.getParameterSignatureHTML(p)
      };
    });
  }
}
