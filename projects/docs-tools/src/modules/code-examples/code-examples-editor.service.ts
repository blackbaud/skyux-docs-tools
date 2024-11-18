import { VERSION as ANGULAR_VERSION, Injectable } from '@angular/core';
import { VERSION as SKY_UX_VERSION } from '@skyux/core';
import { VERSION as SKY_UX_ICONS_VERSION } from '@skyux/icons';
import StackBlitzSDK from '@stackblitz/sdk';
import {
  OpenOptions as StackBlitzOpenOptions,
  Project as StackBlitzProject,
} from '@stackblitz/sdk';

import { SkyDocsSourceCodeFile } from '../source-code/source-code-file';

import { SkyDocsCodeExample } from './code-example';
import { SkyDocsCodeExampleModuleDependencies } from './code-example-module-dependencies';
import { SkyDocsCodeExampleTheme } from './code-example-theme';

type StackblitzTemplate = 'angular-cli' | 'node';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyDocsCodeExamplesEditorService {
  public launchEditor(
    codeExample: SkyDocsCodeExample,
    template: StackblitzTemplate = 'angular-cli',
  ): void {
    const project = this.#getPayload(codeExample, template);
    const openFile: string[] = [];
    if (project.files['src/app/demo.component.html']) {
      openFile.push('src/app/demo.component.html');
    } else if (project.files['src/app/demo.component.ts']) {
      openFile.push('src/app/demo.component.ts');
    }
    const options: StackBlitzOpenOptions = {
      openFile,
    };

    StackBlitzSDK.openProject(project, options);
  }

  #getPayload(
    codeExample: SkyDocsCodeExample,
    template: StackblitzTemplate,
  ): StackBlitzProject {
    const angularVersion = `^${ANGULAR_VERSION.major}`;
    const skyuxVersion = `^${SKY_UX_VERSION.full}`;

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
      '@skyux/i18n': skyuxVersion,
      '@skyux/icon': skyuxVersion,
      '@skyux/indicators': skyuxVersion,
      '@skyux/layout': skyuxVersion,
      '@skyux/modals': skyuxVersion,
      '@skyux/packages': skyuxVersion,
      '@skyux/popovers': skyuxVersion,
      '@skyux/router': skyuxVersion,
      '@skyux/theme': skyuxVersion,
      '@types/jasmine': '~5.1.4',
      rxjs: '^7',
      tslib: '^2.6.2',
      typescript: '~5.5.3',
      'zone.js': '~0.14.4',
    };

    const mergedDependencies = Object.assign(
      {},
      defaultDependencies,
      codeExample.packageDependencies,
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
      codeExample.stylesheets,
    );

    return {
      files,
      title: 'SKY UX Demo',
      description: 'SKY UX Demo',
      template,
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
    stylesheets: string[] = [],
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
      `import { NgModule } from '@angular/core';`,
      `import { FormsModule, ReactiveFormsModule } from '@angular/forms';`,
      `import { BrowserAnimationsModule } from '@angular/platform-browser/animations';`,
      `import { RouterModule } from '@angular/router';`,
      `import { provideInitialTheme } from '@skyux/theme';`,
      `import { AppComponent } from './app.component';`,
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
          sourceCode,
        );

        appComponentTemplate += `<${componentSelector}></${componentSelector}>`;

        moduleImports.push(moduleName);
        moduleImportStatements.push(
          `import { ${moduleName} } from '${importPath}';`,
        );
      }

      // Standalone entry components are named demo.component.ts.
      if (file.fileName === 'demo.component.ts') {
        const componentName = 'DemoComponent';
        const componentSelector = 'app-demo';
        const importPath = `./${this.getFilenameNoExtension(file.fileName)}`;

        appComponentTemplate += `<${componentSelector} />`;

        moduleImports.push(componentName);
        moduleImportStatements.push(
          `import { ${componentName} } from '${importPath}';`,
        );
      }
    });

    files[`${appPath}app.component.ts`] = `${banner}
import { Component } from '@angular/core';

@Component({
  selector: 'sky-demo-app',
  template: '${appComponentTemplate}'
})
export class AppComponent {}
`;

    files[`${appPath}app.module.ts`] = `${moduleImportStatements.join('\n\n')}

@NgModule({
  imports: [
    ${moduleImports.join(',\n    ')}
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideInitialTheme('${theme}')],
})
export class AppModule {}
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
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossorigin="anonymous">
  <link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/static/skyux-icons/${SKY_UX_ICONS_VERSION.full}/assets/css/skyux-icons.min.css" crossorigin="anonymous">
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

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
`;

    files[`${srcPath}styles.scss`] = `@import '@skyux/theme/css/sky';
@import '@skyux/theme/css/themes/modern/styles';

body {
  background-color: #fff;
  margin: 15px;
}
`;

    stylesheets.push('src/styles.scss');

    files['angular.json'] = JSON.stringify(
      {
        $schema: './node_modules/@angular/cli/lib/config/schema.json',
        version: 1,
        projects: {
          demo: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            prefix: 'app',
            architect: {
              build: {
                builder: '@angular-devkit/build-angular:application',
                options: {
                  index: 'src/index.html',
                  browser: 'src/main.ts',
                  outputPath: 'dist/demo',
                  tsConfig: 'tsconfig.app.json',
                  inlineStyleLanguage: 'scss',
                  styles: stylesheets,
                  allowedCommonJsDependencies: [
                    '@skyux/icons',
                    'dom-autoscroller',
                    'fontfaceobserver',
                  ],
                },
                configurations: {
                  development: {
                    optimization: false,
                    extractLicenses: false,
                    sourceMap: true,
                  },
                },
                defaultConfiguration: 'development',
              },
              serve: {
                builder: '@angular-devkit/build-angular:dev-server',
                configurations: {
                  development: {
                    buildTarget: 'demo:build:development',
                  },
                },
                defaultConfiguration: 'development',
              },
            },
          },
        },
      },
      undefined,
      2,
    );

    files['package.json'] = JSON.stringify(
      {
        name: 'skyux-spa-demo',
        version: '0.0.0',
        dependencies,
        scripts: {
          start: 'ng serve',
          build: 'ng build',
        },
        overrides: {
          'ng2-dragula@5.0.1': {
            '@angular/animations': `^${ANGULAR_VERSION.major}`,
            '@angular/core': `^${ANGULAR_VERSION.major}`,
            '@angular/common': `^${ANGULAR_VERSION.major}`,
          },
        },
      },
      undefined,
      2,
    );

    files['tsconfig.app.json'] = JSON.stringify(
      {
        extends: './tsconfig.json',
        compilerOptions: {
          outDir: './out-tsc/app',
          types: [],
        },
        files: ['src/main.ts'],
        include: ['src/**/*.d.ts'],
      },
      undefined,
      2,
    );

    files['tsconfig.json'] = JSON.stringify(
      {
        compileOnSave: false,
        compilerOptions: {
          strict: true,
          forceConsistentCasingInFileNames: true,
          noImplicitOverride: true,
          noPropertyAccessFromIndexSignature: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          sourceMap: true,
          declaration: false,
          downlevelIteration: true,
          esModuleInterop: true,
          experimentalDecorators: true,
          moduleResolution: 'node',
          importHelpers: true,
          typeRoots: ['node_modules/@types'],
          target: 'ES2015',
          module: 'ES2022',
          useDefineForClassFields: false,
          lib: ['ES2022', 'dom'],
        },
        angularCompilerOptions: {
          fullTemplateTypeCheck: true,
          enableI18nLegacyMessageIdFormat: false,
          strictInjectionParameters: true,
          strictInputAccessModifiers: true,
          strictTemplates: true,
        },
      },
      undefined,
      2,
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
    sourceCode: SkyDocsSourceCodeFile[],
  ): string {
    const found = sourceCode.find((file) => {
      return file.rawContents.indexOf(`class ${componentClassName}`) > -1;
    });

    const trimmed = found.rawContents.replace(/\s/g, '');

    return trimmed.split(`selector:'`)[1].split(`'`)[0];
  }
}
