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
    const files = Object.keys(project.files);
    const options: StackBlitzOpenOptions = {
      openFile: files.shift(),
      newWindow: !codeExample.sameWindow,
    };

    StackBlitzSDK.openProject(project, options);
  }

  private getPayload(codeExample: SkyDocsCodeExample): StackBlitzProject {
    const angularVersion = '^13.0.0';
    const skyuxVersion = '^6.0.0-0';

    const defaultDependencies: SkyDocsCodeExampleModuleDependencies = {
      '@angular-devkit/build-angular': angularVersion,
      '@angular/animations': angularVersion,
      '@angular/cdk': angularVersion,
      '@angular/cli': angularVersion,
      '@angular/common': angularVersion,
      '@angular/compiler': angularVersion,
      '@angular/compiler-cli': angularVersion,
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
      '@skyux/popovers': skyuxVersion,
      '@skyux/router': skyuxVersion,
      '@skyux/theme': skyuxVersion,
      // We must define Dragula deliberately so that StackBlitz runs NGCC against it.
      'ng2-dragula': '2.1.1',
      rxjs: '^7',
      tslib: '^2.3.0',
      typescript: '~4.6.3',
      'zone.js': '~0.11.4',
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
      template: 'angular-cli', // WebContainers: switch to 'node' template
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
      `import {\n  APP_BASE_HREF\n} from '@angular/common';`,
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
    },
    {
      provide: APP_BASE_HREF,
      useValue: '/',
    }
  ]
})
export class AppModule { }
`;

    files[`${srcPath}index.html`] = `<!--
  The CSS links are needed for the StackBlitz demo only.
  This is a workaround for a known bug that prevents external imports in CSS.
  https://github.com/stackblitz/core/issues/133
-->
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
<link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/static/skyux-icons/5.0.0/assets/css/skyux-icons.min.css" />

<sky-demo-app>
  Loading...
</sky-demo-app>`;

    files[`${srcPath}main.ts`] = `${banner}
import './polyfills';

import {
  platformBrowserDynamic
} from '@angular/platform-browser-dynamic';

import {
  AppModule
} from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }

  window['ngRef'] = ref;
}).catch(err => console.error(err));
`;

    files[`${srcPath}polyfills.ts`] = `${banner}
import 'zone.js';

// Fix for crossvent \`global is not defined\` error. The crossvent library is used by Dragula,
// which in turn is used by multiple SKY UX components.
// https://github.com/bevacqua/dragula/issues/602
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).global = window;
`;

    files[`${srcPath}styles.css`] = `body {
  background-color: #fff;
  margin: 15px;
}`;

    files['angular.json'] = JSON.stringify(
      {
        $schema: './node_modules/@angular/cli/lib/config/schema.json',
        version: 1,
        projects: {
          demo: {
            root: '',
            sourceRoot: 'src',
            projectType: 'application',
            architect: {
              build: {
                builder: '@angular-devkit/build-angular:browser',
                options: {
                  allowedCommonJsDependencies: ['dragula', 'ng2-dragula'],
                  outputPath: 'dist/demo',
                  index: `${srcPath}index.html`,
                  main: `${srcPath}main.ts`,
                  polyfills: `${srcPath}polyfills.ts`,
                  stylePreprocessorOptions: {
                    includePaths: ['node_modules/'],
                  },
                  styles: [
                    'node_modules/@skyux/theme/css/sky.css',
                    'node_modules/@skyux/theme/css/themes/modern/styles.css',
                    `${srcPath}styles.css`,
                    ...stylesheets,
                  ],
                  tsConfig: 'tsconfig.app.json',
                },
                configurations: {
                  production: {
                    budgets: [
                      {
                        type: 'initial',
                        maximumWarning: '500kb',
                        maximumError: '10mb',
                      },
                      {
                        type: 'anyComponentStyle',
                        maximumWarning: '2kb',
                        maximumError: '400kb',
                      },
                    ],
                    outputHashing: 'all',
                  },
                  development: {
                    buildOptimizer: false,
                    optimization: false,
                    vendorChunk: true,
                    extractLicenses: false,
                    sourceMap: true,
                    namedChunks: true,
                  },
                },
                defaultConfiguration: 'production',
              },
              serve: {
                builder: '@angular-devkit/build-angular:dev-server',
                configurations: {
                  production: {
                    browserTarget: 'demo:build:production',
                  },
                  development: {
                    browserTarget: 'demo:build:development',
                  },
                },
                defaultConfiguration: 'development',
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
        name: 'angular',
        version: '0.0.0',
        private: true,
        scripts: {
          ng: 'ng',
          dev: 'ng serve',
          start: 'ng serve',
          build: 'ng build',
          watch: 'ng build --watch --configuration development',
        },
        dependencies,
        browserslist: [
          'last 1 Chrome version',
          'last 1 Firefox version',
          'last 1 Edge major versions',
        ],
      },
      undefined,
      2
    );

    files['tsconfig.json'] = JSON.stringify(
      {
        compileOnSave: false,
        compilerOptions: {
          baseUrl: './',
          outDir: './dist/out-tsc',
          forceConsistentCasingInFileNames: true,
          sourceMap: true,
          declaration: false,
          downlevelIteration: true,
          target: 'es2020',
          module: 'es2020',
          moduleResolution: 'node',
          experimentalDecorators: true,
          importHelpers: true,
          typeRoots: ['./node_modules/@types'],
          lib: ['es2020', 'dom'],
          esModuleInterop: true,
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

    files['tsconfig.app.json'] = JSON.stringify(
      {
        extends: './tsconfig.json',
        compilerOptions: {
          outDir: './out-tsc/app',
          types: [],
        },
        files: ['src/main.ts', 'src/polyfills.ts'],
        include: ['src/**/*.d.ts'],
      },
      undefined,
      2
    );

    files['.stackblitzrc'] = JSON.stringify(
      {
        installDependencies: true,
        env: {
          ENABLE_CJS_IMPORTS: true,
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
      return file.rawContents.indexOf(componentClassName) > -1;
    });

    const trimmed = found.rawContents.replace(/\s/g, '');

    return trimmed.split(`selector:'`)[1].split(`'`)[0];
  }
}
