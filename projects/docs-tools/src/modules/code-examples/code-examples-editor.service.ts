import { Injectable } from '@angular/core';

import StackBlitzSDK from '@stackblitz/sdk';

import {
  OpenOptions as StackBlitzOpenOptions,
  Project as StackBlitzProject,
} from '@stackblitz/sdk/typings/interfaces';

import { SkyDocsSourceCodeFile } from '../source-code/source-code-file';

import { SkyDocsCodeExampleModuleDependencies } from './code-example-module-dependencies';

import { SkyDocsCodeExampleTheme } from './code-example-theme';

import { SkyDocsCodeExample } from './code-example';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyDocsCodeExamplesEditorService {
  public launchEditor(codeExample: SkyDocsCodeExample): void {
    const project = this.getPayload(codeExample);
    const options: StackBlitzOpenOptions = {};

    StackBlitzSDK.openProject(project, options);
  }

  private getPayload(codeExample: SkyDocsCodeExample): StackBlitzProject {
    const angularVersion = '^15.0.0';
    const skyuxVersion = '^8.0.0';

    const defaultDependencies: SkyDocsCodeExampleModuleDependencies = {
      '@angular/animations': angularVersion,
      '@angular/cdk': angularVersion,
      '@angular/common': angularVersion,
      '@angular/compiler': angularVersion,
      '@angular/core': angularVersion,
      '@angular/forms': angularVersion,
      '@angular/platform-browser': angularVersion,
      '@angular/platform-browser-dynamic': angularVersion,
      '@angular/router': angularVersion,
      '@skyux/animations': skyuxVersion,
      '@skyux/assets': skyuxVersion,
      '@skyux/config': skyuxVersion,
      '@skyux/core': skyuxVersion,
      '@skyux/errors': skyuxVersion,
      '@skyux/forms': skyuxVersion,
      '@skyux/http': skyuxVersion,
      '@skyux/i18n': skyuxVersion,
      '@skyux/indicators': skyuxVersion,
      '@skyux/layout': skyuxVersion,
      '@skyux/modals': skyuxVersion,
      '@skyux/packages': skyuxVersion,
      '@skyux/popovers': skyuxVersion,
      '@skyux/router': skyuxVersion,
      '@skyux/theme': skyuxVersion,
      '@types/jasmine': '~4.0.3',
      // We must define Dragula deliberately so that StackBlitz runs NGCC against it.
      'ng2-dragula': '2.1.1',
      rxjs: '^7',
      tslib: '^2.3.0',
      typescript: '~4.9.5',
      'zone.js': '~0.12.0',
    };

    const mergedDependencies = Object.assign(
      {},
      defaultDependencies,
      codeExample.packageDependencies
    );

    // Ensure any @skyux dependencies list the correct version of SKY UX.
    // e.g. `"@skyux/core": "*"` --> `"@skyux/core": "5.0.0"`
    for (const packageName in mergedDependencies) {
      /*istanbul ignore else*/
      if (mergedDependencies.hasOwnProperty(packageName)) {
        const version = mergedDependencies[packageName];
        if (
          version === '*' &&
          /^(@blackbaud\/skyux-lib-|@skyux)/.test(packageName)
        ) {
          mergedDependencies[packageName] = skyuxVersion;
        }
      }
    }

    const files = this.parseStackBlitzFiles(
      codeExample.sourceCode,
      mergedDependencies,
      codeExample.theme,
      codeExample.stylesheets
    );

    return {
      files,
      title: 'SKY UX Demo',
      description: 'SKY UX Demo',
      template: 'angular-cli',
      dependencies: mergedDependencies,
      settings: {
        compile: {
          clearConsole: false,
        },
      },
    };
  }

  private parseStackBlitzFiles(
    sourceCode: SkyDocsSourceCodeFile[],
    dependencies: SkyDocsCodeExampleModuleDependencies,
    theme: SkyDocsCodeExampleTheme,
    stylesheets: string[] = []
  ): {
    [path: string]: string;
  } {
    const srcPath = 'src/';
    const appPath = `${srcPath}app/`;

    const banner = `/**
 * This file is needed for the StackBlitz demo only.
 * It is automatically provided when using the Angular CLI.
 **/
 `;

    const moduleImportStatements: string[] = [
      `import {\n  NgModule\n} from '@angular/core';`,
      `import {\n  FormsModule,\n  ReactiveFormsModule\n} from '@angular/forms';`,
      `import {\n  BrowserAnimationsModule\n} from '@angular/platform-browser/animations';`,
      `import {\n  RouterModule\n} from '@angular/router';`,
      `import {\n  SkyAppLocaleProvider\n} from '@skyux/i18n';`,
      `import {\n  SkyThemeService\n} from '@skyux/theme';`,
      `import {\n  of as observableOf\n} from 'rxjs';`,
      `import {\n  AppComponent\n} from './app.component';`,
    ];

    const moduleImports: string[] = [
      'BrowserAnimationsModule',
      'FormsModule',
      'ReactiveFormsModule',
      'RouterModule.forRoot([])',
    ];

    const files: { [_: string]: string } = {};

    let appComponentTemplate = '';

    sourceCode.forEach((file) => {
      files[`${appPath}${file.fileName}`] = file.rawContents;

      // Setup module imports and component selectors.
      if (file.fileName.indexOf('.module.ts') > -1) {
        const moduleName = this.getModuleName(file.rawContents);
        const importPath = `./${this.getFilenameNoExtension(file.fileName)}`;

        const exportedComponent = this.getExportedComponent(file.rawContents);
        const componentSelector = this.getComponentSelector(
          exportedComponent,
          sourceCode
        );

        appComponentTemplate += `<${componentSelector}></${componentSelector}>`;

        moduleImports.push(moduleName);
        moduleImportStatements.push(
          `import {\n  ${moduleName}\n} from '${importPath}';`
        );
      }
    });

    files[`${appPath}app.component.ts`] = `${banner}
import {
  Component,
  Renderer2
} from '@angular/core';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sky-demo-app',
  template: '${appComponentTemplate}'
})
export class AppComponent {

  constructor(
    themeSvc: SkyThemeService,
    renderer: Renderer2
  ) {
    const themeSettings = new SkyThemeSettings(
      SkyTheme.presets['${
        theme === SkyDocsCodeExampleTheme.Modern ? 'modern' : 'default'
      }'],
      SkyThemeMode.presets.light
    );

    themeSvc.init(
      document.body,
      renderer,
      themeSettings
    );
  }

}`;

    files[`${appPath}app.module.ts`] = `${moduleImportStatements.join('\n\n')}

@NgModule({
  imports: [
    ${moduleImports.join(',\n    ')}
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    SkyThemeService,
    {
      provide: SkyAppLocaleProvider,
      useValue: {
        getLocaleInfo: () => observableOf({
          locale: 'en-US'
        })
      }
    }
  ]
})
export class AppModule { }
`;

    files[`${srcPath}index.html`] = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sky UX Demo</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!--
    The CSS links are needed for the StackBlitz demo only.
    This is a workaround for a known bug that prevents external imports in CSS.
    https://github.com/stackblitz/core/issues/133
  -->
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
  <link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/static/skyux-icons/6.0.0/assets/css/skyux-icons.min.css" />
</head>
<body>
  <sky-demo-app>
    Loading...
  </sky-demo-app>
</body>
</html>
`;

    files[`${srcPath}main.ts`] = `${banner}
import 'zone.js';
import '@skyux/packages/polyfills';

import {
  platformBrowserDynamic
} from '@angular/platform-browser-dynamic';

import {
  AppModule
} from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

`;

    files[`${srcPath}styles.scss`] = `@import '@skyux/theme/css/sky';
@import '@skyux/theme/css/themes/modern/styles';

body {
  background-color: #fff;
  margin: 15px;
}`;

    stylesheets.push('src/styles.scss');

    files['angular.json'] = JSON.stringify(
      {
        projects: {
          demo: {
            architect: {
              build: {
                options: {
                  index: 'src/index.html',
                  main: 'src/main.ts',
                  inlineStyleLanguage: 'scss',
                  styles: stylesheets,
                },
              },
            },
          },
        },
      },
      undefined,
      2
    );

    files['package.json'] = JSON.stringify(
      {
        dependencies,
      },
      undefined,
      2
    );

    files['tsconfig.json'] = JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          forceConsistentCasingInFileNames: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          target: 'ES2022',
          module: 'ES2022',
          moduleResolution: 'node',
          declaration: false,
          downlevelIteration: true,
          esModuleInterop: true,
          experimentalDecorators: true,
          importHelpers: true,
          typeRoots: ['node_modules/@types'],
          useDefineForClassFields: false,
          lib: ['ES2022', 'dom'],
        },
        angularCompilerOptions: {
          fullTemplateTypeCheck: true,
          strictInjectionParameters: true,
          strictInputAccessModifiers: true,
          strictTemplates: true,
        },
      },
      undefined,
      2
    );

    return files;
  }

  private getModuleName(contents: string): string {
    return contents.split('export class ')[1].split(' {')[0];
  }

  private getFilenameNoExtension(fileName: string): string {
    const extension = fileName.split('.').pop();
    return fileName.replace(`.${extension}`, '');
  }

  private getExportedComponent(contents: string): string {
    const trimmed = contents.replace(/\s/g, '');

    let fragment = trimmed.split('exports:[')[1];
    if (!fragment) {
      throw 'You must export a component from the code example module!';
    }

    fragment = fragment.split(']')[0];

    const components = fragment.split(',').filter((x) => x);

    if (components.length > 1) {
      throw (
        'You may only export a single component from the code example module' +
        `(we found ${components.length}: ${components.join(', ')}).` +
        'Is it possible to create a new code example with the extra components?'
      );
    }

    return components[0];
  }

  private getComponentSelector(
    componentClassName: string,
    sourceCode: SkyDocsSourceCodeFile[]
  ): string {
    const found = sourceCode.find((file) => {
      return file.rawContents.indexOf(`class ${componentClassName}`) > -1;
    });

    const trimmed = found.rawContents.replace(/\s/g, '');

    return trimmed.split(`selector:'`)[1].split(`'`)[0];
  }
}
