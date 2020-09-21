import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import { SkyDocsCallSignatureDefinition, SkyDocsClassPropertyDefinition } from './type-definitions';
import { SkyDocsTypeDefinitionsFormatService } from './type-definitions-format.service';

import orderBy from 'lodash.orderby';

interface PropertyViewModel {
  callSignature: SkyDocsCallSignatureDefinition;
  defaultValue: string;
  deprecationWarning: string;
  description: string;
  formattedName: string;
  isOptional: boolean;
}

@Component({
  selector: 'sky-docs-property-definitions',
  templateUrl: './property-definitions.component.html',
  styleUrls: ['./property-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionsComponent implements OnInit {

  @Input()
  public set config(value: { properties: SkyDocsClassPropertyDefinition[]; }) {
    this._config = value;
    this.updateView();
  }

  public get config(): { properties: SkyDocsClassPropertyDefinition[]; } {
    return this._config || { properties: [] };
  }

  @Input()
  public propertyType = 'Property';

  @Input()
  public showOptionalStatus: boolean = true;

  public deprecationWarningPrefix = `<span class="sky-text-warning"></span>**Deprecated.** `;

  public isMobile: boolean = true;

  public properties: PropertyViewModel[] = [];

  private _config: {
    properties: SkyDocsClassPropertyDefinition[];
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private formatService: SkyDocsTypeDefinitionsFormatService,
    private mediaQueryService: SkyMediaQueryService
  ) { }

  public ngOnInit(): void {
    this.mediaQueryService.subscribe((breakpoints: SkyMediaBreakpoints) => {
      this.isMobile = (breakpoints <= SkyMediaBreakpoints.sm);
      this.changeDetector.markForCheck();
    });
  }

  private updateView(): void {
    const properties = orderBy(
      this.config.properties,
      ['isOptional', 'name'],
      ['asc', 'asc']
    );

    this.properties = properties.map(property => {
      const vm: PropertyViewModel = {
        defaultValue: this.formatService.escapeSpecialCharacters(property.defaultValue),
        deprecationWarning: property.deprecationWarning,
        description: property.description,
        formattedName: this.formatService.parseFormattedPropertyName(property),
        isOptional: property.isOptional,
        callSignature: property.type.callSignature
      };

      return vm;

      // const isMethodType: boolean = (property.kindString === 'Method');
      // const isCallSignatureType: boolean = (property.kindString === 'Call signature');

      // // Comments for methods are stored in a different location.
      // const comment = (isMethodType && property.signatures[0].comment) || property.comment;

      // const sourceCode = (isMethodType)
      //   ? this.formatService.parseFormattedType(property, {
      //       escapeSpecialCharacters: false
      //     })
      //   : undefined;

      // const tags = this.jsDocsService.parseCommentTags(comment);

      // const vm: PropertyViewModel = {
      //   callSignature: (isMethodType || isCallSignatureType) ? property : undefined,
      //   defaultValue: this.formatService.parseFormattedDefaultValue(property, tags),
      //   deprecationWarning: tags.deprecationWarning,
      //   description: tags.description,
      //   formattedName: this.formatService.parseFormattedPropertyName(property),
      //   isOptional: isTypeOptional(property, tags),
      //   name: property.name,
      //   showOptionalStatus: !(property.kindString === 'Method'),
      //   sourceCode
      // };

      // return vm;
    });
  }

}
