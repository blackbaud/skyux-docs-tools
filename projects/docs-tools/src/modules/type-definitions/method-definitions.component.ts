import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { SkyDocsCallSignatureDefinition } from './call-signature-definition';

import { SkyDocsClassMethodDefinition } from './method-definition';

import { SkyDocsTypeDefinitionsFormatService } from './type-definitions-format.service';

interface MethodViewModel {
  callSignature: SkyDocsCallSignatureDefinition;
  codeExample: string;
  codeExampleLanguage: string;
  deprecationWarning: string;
  description: string;
  formattedName: string;
  sourceCode: string;
  isStatic: boolean;
  isPreview: boolean;
}

@Component({
  selector: 'sky-docs-method-definitions',
  templateUrl: './method-definitions.component.html',
  styleUrls: ['./method-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDocsMethodDefinitionsComponent implements OnInit {
  @Input()
  public set config(value: { methods?: SkyDocsClassMethodDefinition[] }) {
    this.#_config = value;
    this.updateView();
  }

  public get config(): { methods?: SkyDocsClassMethodDefinition[] } {
    return this.#_config || {};
  }

  public deprecationWarningPrefix = `<span class="sky-text-warning"></span>**Deprecated.** `;

  public isMobile: boolean = true;

  public methods: MethodViewModel[];

  public staticMethods: MethodViewModel[];

  #_config: {
    methods?: SkyDocsClassMethodDefinition[];
  };

  #changeDetector: ChangeDetectorRef;
  #formatService: SkyDocsTypeDefinitionsFormatService;
  #mediaQueryService: SkyMediaQueryService;

  constructor(
    changeDetector: ChangeDetectorRef,
    formatService: SkyDocsTypeDefinitionsFormatService,
    mediaQueryService: SkyMediaQueryService,
  ) {
    this.#changeDetector = changeDetector;
    this.#formatService = formatService;
    this.#mediaQueryService = mediaQueryService;
  }

  public ngOnInit(): void {
    this.#mediaQueryService.subscribe((breakpoints: SkyMediaBreakpoints) => {
      this.isMobile = breakpoints <= SkyMediaBreakpoints.sm;
      this.#changeDetector.markForCheck();
    });
  }

  private updateView(): void {
    if (this.config.methods?.length > 0) {
      this.methods = [];
      this.staticMethods = [];
      for (let method of this.config.methods) {
        const vm: MethodViewModel = {
          callSignature: method.type.callSignature,
          codeExample: method.codeExample,
          codeExampleLanguage: method.codeExampleLanguage,
          deprecationWarning: method.deprecationWarning,
          description: method.description,
          formattedName: this.#formatService.getFormattedMethodName(method),
          sourceCode: this.#formatService.getMethodSourceCode(method),
          isStatic: method.isStatic,
          isPreview: method.isPreview,
        };

        if (vm.isStatic) {
          this.staticMethods.push(vm);
        } else {
          this.methods.push(vm);
        }
      }
    }
  }
}
