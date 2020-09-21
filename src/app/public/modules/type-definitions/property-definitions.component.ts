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

import {
  isTypeOptional
} from './is-type-optional';

import {
  SkyDocsJSDocsService
} from './jsdoc.service';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

import {
  TypeDocEntryChild
} from './typedoc-types';

import orderBy from 'lodash.orderby';

interface PropertyViewModel {
  callSignature?: TypeDocEntryChild;
  defaultValue: string;
  deprecationWarning: string;
  description: string;
  formattedName: string;
  isOptional: boolean;
  name: string;
  showOptionalStatus: boolean;
  sourceCode: string;
}

@Component({
  selector: 'sky-docs-property-definitions',
  templateUrl: './property-definitions.component.html',
  styleUrls: ['./property-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionsComponent implements OnInit {

  @Input()
  public set config(value: { properties: TypeDocEntryChild[]; }) {
    this._config = value;
    this.updateView();
  }

  public get config(): { properties: TypeDocEntryChild[]; } {
    return this._config || { properties: [] };
  }

  @Input()
  public propertyType = 'Property';

  public deprecationWarningPrefix = `<span class="sky-text-warning"></span>**Deprecated.** `;

  public isMobile: boolean = true;

  public properties: PropertyViewModel[] = [];

  private _config: {
    properties: TypeDocEntryChild[];
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private jsDocsService: SkyDocsJSDocsService,
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
    const properties = this.config?.properties?.map(property => {

      const isMethodType: boolean = (property.kindString === 'Method');
      const isCallSignatureType: boolean = (property.kindString === 'Call signature');

      // Comments for methods are stored in a different location.
      const comment = (isMethodType && property.signatures[0].comment) || property.comment;

      const sourceCode = (isMethodType)
        ? this.formatService.parseFormattedType(property, {
            escapeSpecialCharacters: false
          })
        : undefined;

      const tags = this.jsDocsService.parseCommentTags(comment);

      const vm: PropertyViewModel = {
        callSignature: (isMethodType || isCallSignatureType) ? property : undefined,
        defaultValue: this.formatService.parseFormattedDefaultValue(property, tags),
        deprecationWarning: tags.deprecationWarning,
        description: tags.description,
        formattedName: this.formatService.parseFormattedPropertyName(property),
        isOptional: isTypeOptional(property, tags),
        name: property.name,
        showOptionalStatus: !(property.kindString === 'Method'),
        sourceCode
      };

      return vm;
    });

    this.properties = orderBy(
      properties,
      ['isOptional', 'name'],
      ['asc', 'asc']
    );
  }

}
