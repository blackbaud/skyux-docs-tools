import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

// import {
//   isTypeOptional
// } from './is-type-optional';

// import {
//   SkyDocsJSDocsService
// } from './jsdoc.service';

// import {
//   SkyDocsTypeDefinitionsFormatService
// } from './type-definitions-format.service';

import {
  TypeDocEntryChild
} from './typedoc-types';

interface ParameterViewModel {
  defaultValue: string;
  description: string;
  formattedName: string;
  isOptional: boolean;
}

@Component({
  selector: 'sky-docs-parameter-definitions',
  templateUrl: './parameter-definitions.component.html',
  styleUrls: ['./parameter-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsParameterDefinitionsComponent {

  @Input()
  public set config(value: TypeDocEntryChild) {
    this._config = value;
    this.updateView();
  }

  public get config(): TypeDocEntryChild {
    return this._config;
  }

  public parameters: ParameterViewModel[];

  private _config: TypeDocEntryChild;

  // constructor(
  //   private jsDocsService: SkyDocsJSDocsService,
  //   private formatService: SkyDocsTypeDefinitionsFormatService
  // ) { }

  private updateView(): void {

    // Reset view properties when the config changes.
    // delete this.parameters;

    // const callSignatures = this.config?.signatures || this.config?.type?.declaration.signatures;
    // if (!callSignatures) {
    //   return;
    // }

    // const parentTags = this.jsDocsService.parseCommentTags(this.config?.comment);

    // this.parameters = callSignatures[0].parameters.map(p => {
    //   const tags = this.jsDocsService.parseParameterCommentTags(p, parentTags);
    //   const defaultValue = this.formatService.parseFormattedDefaultValue(p, tags);

    //   const vm: ParameterViewModel = {
    //     defaultValue,
    //     description: tags.description,
    //     formattedName: this.formatService.parseFormattedParameterName(p),
    //     isOptional: !!(defaultValue || isTypeOptional(p, tags))
    //   };

    //   return vm;
    // });
  }
}
