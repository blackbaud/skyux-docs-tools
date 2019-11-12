import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  SkyDocsSourceCodeService
} from '../source-code/source-code.service';

import {
  SkyDocsCodeExamplesEditorService
} from './code-examples-editor.service';

import {
  SkyDocsCodeExampleComponent
} from './code-example.component';

import {
  SkyDocsCodeExampleModuleDependencies
} from './code-example-module-dependencies';

import {
  SkyDocsCodeExample
} from './code-example';

/**
 * Wraps all code examples and handles their configuration and styles.
 * @example
 * ```
 * <sky-docs-code-examples
 *   [packageDependencies]="{
 *     "foobar": "*",
 *     "baz": "1.2.3"
 *   }"
 * >
 *   <sky-docs-code-example>
 *   </sky-docs-code-example>
 * </sky-docs-code-examples>
 * ```
 */
@Component({
  selector: 'sky-docs-code-examples',
  templateUrl: './code-examples.component.html',
  styleUrls: ['./code-examples.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCodeExamplesComponent implements AfterContentInit {

  /**
   * Any extra NPM package dependencies that are needed for the editor to run the code example.
   * @default {}
   */
  @Input()
  public set packageDependencies(value: SkyDocsCodeExampleModuleDependencies) {
    this._packageDependencies = value;
  }

  public get packageDependencies(): SkyDocsCodeExampleModuleDependencies {
    return this._packageDependencies || {};
  }

  public codeExamples: SkyDocsCodeExample[] = [];

  @ContentChildren(SkyDocsCodeExampleComponent)
  private codeExampleComponents: QueryList<SkyDocsCodeExampleComponent>;

  private _packageDependencies: SkyDocsCodeExampleModuleDependencies;

  constructor(
    private editorService: SkyDocsCodeExamplesEditorService,
    private sourceCodeService: SkyDocsSourceCodeService
  ) { }

  public ngAfterContentInit(): void {
    this.codeExampleComponents.forEach((component) => {
      const sourceCode = this.sourceCodeService.getSourceCode(component.sourceCodePath);

      if (!sourceCode.length) {
        throw `No source code found at location "${component.sourceCodePath}" for "${component.heading}"!`;
      }

      this.codeExamples.push({
        heading: component.heading,
        sourceCode,
        packageDependencies: this.packageDependencies
      });
    });
  }

  public launchEditor(codeExample: SkyDocsCodeExample): void {
    this.editorService.launchEditor(codeExample);
  }

  /**
   * Returns a string representing one of PrismJS's supported language types.
   * See: https://prismjs.com/#supported-languages
   */
  public parseCodeLanguageType(fileName: string): string {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'ts':
        return 'typescript';
      case 'html':
        return 'markup';
      default:
        return extension;
    }
  }
}
