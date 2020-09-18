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

import orderBy from 'lodash.orderby';

interface Property {
  callSignature?: TypeDocItemMember;
  defaultValue: string;
  deprecationWarning: string;
  description: string;
  isOptional: boolean;
  name: string;
  signature: string;
}

@Component({
  selector: 'sky-docs-property-definitions',
  templateUrl: './property-definitions.component.html',
  styleUrls: ['./property-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionsComponent implements OnInit {

  @Input()
  public set config(value: { properties: TypeDocItemMember[]; }) {
    this._config = value;
    this.updateView();
  }

  public get config(): { properties: TypeDocItemMember[]; } {
    return this._config || { properties: [] };
  }

  @Input()
  public propertyType = 'Property';

  public deprecationWarningPrefix = `<span class="sky-text-warning"></span>**Deprecated.** `;

  public isMobile: boolean = true;

  public properties: Property[] = [];

  private _config: { properties: TypeDocItemMember[]; };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private jsDocsService: SkyDocsJSDocsService,
    private formatService: SkyDocsTypeDefinitionsFormatService,
    private typeDefinitionService: SkyDocsTypeDefinitionsService,
    private mediaQueryService: SkyMediaQueryService
  ) { }

  public ngOnInit(): void {
    this.mediaQueryService.subscribe((breakpoints: SkyMediaBreakpoints) => {
      this.isMobile = (breakpoints <= SkyMediaBreakpoints.sm);
      this.changeDetector.markForCheck();
    });
  }

  private getPropertySignature(item: TypeDocItemMember): string {
    return this.formatService.getPropertySignatureHTML(item);
  }

  private updateView(): void {
    const properties = this.config.properties.map(p => {
      const tags = this.jsDocsService.parseCommentTags((p.signatures && p.signatures[0].comment) || p.comment);
      const property: Property = {
        callSignature: (p.signatures || p.type?.declaration?.signatures) ? p : undefined,
        defaultValue: this.formatService.getDefaultValueHTML(p, tags),
        deprecationWarning: tags.deprecationWarning,
        description: tags.description,
        isOptional: this.typeDefinitionService.isOptional(p, tags),
        name: p.name,
        signature: this.getPropertySignature(p)
      };
      return property;
    });

    this.properties = orderBy(
      properties,
      ['isOptional', 'name'],
      ['asc', 'asc']
    );
  }

}
