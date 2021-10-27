import {
  Injectable
} from '@angular/core';

import { getParameters } from 'codesandbox/lib/api/define';

import {
  SkyDocsSourceCodeFile
} from '../source-code/source-code-file';

// import {
//   SkyDocsCodeExampleModuleDependencies
// } from './code-example-module-dependencies';

// import {
//   SkyDocsCodeExampleTheme
// } from './code-example-theme';

import {
  SkyDocsCodeExample
} from './code-example';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class SkyDocsCodeExamplesEditorService {

  public launchEditor(codeExample: SkyDocsCodeExample): void {
    const parameters = this.getParameters(codeExample);

    const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;

    window.open(url, '_blank');
  }

  private getParameters(codeExample: SkyDocsCodeExample) {
    const angularVersion = '^12.2.9';
    const skyuxVersion = '^5';

    const packageJson = {
      dependencies: {
        '@angular/animations': angularVersion,
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
        '@skyux/forms': skyuxVersion,
        '@skyux/i18n': skyuxVersion,
        '@skyux/indicators': skyuxVersion,
        '@skyux/theme': skyuxVersion,
        'core-js': '~3.8.3',
        rxjs: '~6.6.7',
        tslib: '^2.3.1',
        'zone.js': '~0.11.4'
      },
      devDependencies: {
        '@angular-devkit/build-angular': angularVersion,
        '@angular/cli': angularVersion,
        '@angular/compiler-cli': angularVersion,
        '@types/jasmine': '~3.8.2',
        '@types/node': '~12.20.28',
        'ts-node': '~8.3.0',
        typescript: '~4.3.5'
      }
    };

    Object.assign(packageJson.dependencies, codeExample.packageDependencies);

    const moduleImportStatements: string[] = [];
    const moduleImports: string[] = [];

    const files: {[filePath: string]: {content: any}} = {};

    let appComponentTemplate = '';

    codeExample.sourceCode.forEach((file) => {
      files[`src/app/${file.fileName}`] = {
        content: file.rawContents
      };

      // Setup module imports and component selectors.
      if (file.fileName.indexOf('.module.ts') > -1) {
        const moduleName = this.getModuleName(file.rawContents);
        const importPath = `./${this.getFilenameNoExtension(file.fileName)}`;

        const exportedComponent = this.getExportedComponent(file.rawContents);
        const componentSelector = this.getComponentSelector(exportedComponent, codeExample.sourceCode);

        appComponentTemplate += `<${componentSelector}></${componentSelector}>`;

        moduleImports.push(moduleName);
        moduleImportStatements.push(`import { ${moduleName} } from '${importPath}';`);
      }
    });

    files['src/app/app.component.html'] = {
      content: `<div *ngIf="isLoaded">
  ${appComponentTemplate}
</div>
`
    };

    files['src/app/app.component.scss'] = {
      content: ''
    };

    files['src/app/app.component.ts'] = {
      content: `import { Component, Renderer2 } from '@angular/core';

import {
  SkyAppStyleLoader,
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isLoaded = false;

  constructor(
    renderer: Renderer2,
    themeService: SkyThemeService,
    styleLoader: SkyAppStyleLoader
  ) {
    themeService.init(
      document.body,
      renderer,
      new SkyThemeSettings(
        SkyTheme.presets['${codeExample.theme}'],
        SkyThemeMode.presets.light
      )
    );

    styleLoader.loadStyles().then(() => {
      this.isLoaded = true;
    });
  }
}
`
    };

    files['src/app/app.module.ts'] = {
      content: `import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SkyAppLocaleProvider } from '@skyux/i18n';
import { SkyThemeService } from '@skyux/theme';

${moduleImportStatements.join('\n')}

import { of as observableOf } from 'rxjs';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ${moduleImports.join(',\n    ')}
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
`
    };

    files['src/environments/environment.ts'] = {
      content: `export const environment = {
  production: false
};
`
    };

    files['src/environments/environment.prod.ts'] = {
      content: `export const environment = {
  production: true
};
`
    };

    files['src/index.html'] = {
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>SKY UX Showcase</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`
    };

    files['src/main.ts'] = {
      content: `import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
`
    };

    files['src/polyfills.ts'] = {
      content: `import 'zone.js';

/** Evergreen browsers require these. **/
// Used for reflect-metadata in JIT. If you use AOT (and only Angular decorators), you can remove.
import 'core-js/proposals/reflect-metadata';

// Fix for crossvent "global is not defined" error. The crossvent library is used by Dragula,
// which in turn is used by multiple SKY UX components.
// https://github.com/bevacqua/dragula/issues/602
(window as any).global = window;
`
    };

    files['src/styles.scss'] = {
      content: `@import '~@skyux/theme/css/sky';
@import '~@skyux/theme/css/themes/modern/styles';

body, html {
  font-family: 'system-ui';
  padding: 15px;
}
`
    };

    files['.angular-cli.json'] = {
      content: `{
  "apps": [
    {
      "root": "src",
      "outDir": "dist",
      "assets": ["assets", "favicon.ico"],
      "index": "index.html",
      "main": "main.ts",
      "polyfills": "polyfills.ts",
      "prefix": "app",
      "styles": ["styles.scss"],
      "scripts": [],
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    }
  ]
}
`
    };

    files['package.json'] = {
      content: packageJson
    };

    files['tsconfig.json'] = {
      content: `{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2015",
    "module": "es2020",
    "lib": [
      "es2018",
      "dom"
    ]
  }
}`
    };

    const parameters = getParameters({
      template: 'angular-cli',
      files,
    } as any);

    return parameters;
  }

//   private getPayload(codeExample: SkyDocsCodeExample): StackBlitzProject {
//     const angularVersion = '^12.2.0';
//     const skyuxVersion = '^5';

//     const defaultDependencies: SkyDocsCodeExampleModuleDependencies = {
//       '@angular/animations': angularVersion,
//       '@angular/common': angularVersion,
//       '@angular/compiler': angularVersion,
//       '@angular/core': angularVersion,
//       '@angular/forms': angularVersion,
//       '@angular/platform-browser': angularVersion,
//       '@angular/platform-browser-dynamic': angularVersion,
//       '@angular/router': angularVersion,
//       '@skyux/animations': skyuxVersion,
//       '@skyux/assets': skyuxVersion,
//       '@skyux/config': skyuxVersion,
//       '@skyux/core': skyuxVersion,
//       '@skyux/errors': skyuxVersion,
//       '@skyux/forms': skyuxVersion,
//       '@skyux/http': skyuxVersion,
//       '@skyux/i18n': skyuxVersion,
//       '@skyux/indicators': skyuxVersion,
//       '@skyux/layout': skyuxVersion,
//       '@skyux/modals': skyuxVersion,
//       '@skyux/popovers': skyuxVersion,
//       '@skyux/router': skyuxVersion,
//       '@skyux/theme': skyuxVersion,
//       'rxjs': '^6.6.0',
//       'tslib': '^2.3.0',
//       'zone.js': '~0.11.4'
//     };

//     const mergedDependencies = Object.assign(
//       {},
//       defaultDependencies,
//       codeExample.packageDependencies
//     );

//     const files = this.parseStackBlitzFiles(
//       codeExample.sourceCode,
//       mergedDependencies,
//       codeExample.theme
//     );

//     return {
//       files,
//       title: 'SKY UX Demo',
//       description: 'SKY UX Demo',
//       template: 'angular-cli',
//       dependencies: mergedDependencies,
//       settings: {
//         compile: {
//           clearConsole: false
//         }
//       }
//     };
//   }

//   private parseStackBlitzFiles(
//     sourceCode: SkyDocsSourceCodeFile[],
//     dependencies: SkyDocsCodeExampleModuleDependencies,
//     theme: SkyDocsCodeExampleTheme
//   ): {
//     [path: string]: string;
//   } {

//     const srcPath = 'src/';
//     const appPath = `${srcPath}app/`;

//     const banner = `/**
//  * This file is needed for the StackBlitz demo only.
//  * It is automatically provided when using the Angular CLI.
//  **/
//  `;

//     const moduleImportStatements: string[] = [
//       `import {\n  Component,\n  NgModule\n} from '@angular/core';`,
//       `import {\n  FormsModule,\n  ReactiveFormsModule\n} from '@angular/forms';`,
//       `import {\n  platformBrowserDynamic\n} from '@angular/platform-browser-dynamic';`,
//       `import {\n  BrowserModule\n} from '@angular/platform-browser';`,
//       `import {\n  RouterModule\n} from '@angular/router';`,
//       `import {\n  SkyAppLocaleProvider\n} from '@skyux/i18n';`,
//       `import {\n  SkyThemeService\n} from '@skyux/theme';`,
//       `import {\n  of as observableOf\n} from 'rxjs';`,
//       `import {\n  AppComponent\n} from './app.component';`
//     ];

//     const moduleImports: string[] = [
//       'BrowserModule',
//       'FormsModule',
//       'ReactiveFormsModule',
//       'RouterModule.forRoot([])'
//     ];

//     const files: {[_: string]: string} = {};

//     let appComponentTemplate = '';

//     sourceCode.forEach((file) => {
//       files[`${appPath}${file.fileName}`] = file.rawContents;

//       // Setup module imports and component selectors.
//       if (file.fileName.indexOf('.module.ts') > -1) {
//         const moduleName = this.getModuleName(file.rawContents);
//         const importPath = `./${this.getFilenameNoExtension(file.fileName)}`;

//         const exportedComponent = this.getExportedComponent(file.rawContents);
//         const componentSelector = this.getComponentSelector(exportedComponent, sourceCode);

//         appComponentTemplate += `<${componentSelector}></${componentSelector}>`;

//         moduleImports.push(moduleName);
//         moduleImportStatements.push(`import {\n  ${moduleName}\n} from '${importPath}';`);
//       }
//     });

//       files[`${appPath}app.component.ts`] = `${banner}
// import {
//   Component,
//   Renderer2
// } from '@angular/core';

// import {
//   SkyTheme,
//   SkyThemeMode,
//   SkyThemeService,
//   SkyThemeSettings
// } from '@skyux/theme';

// @Component({
//   selector: 'sky-demo-app',
//   template: '${appComponentTemplate}'
// })
// export class AppComponent {

//   constructor(
//     themeSvc: SkyThemeService,
//     renderer?: Renderer2
//   ) {
//       const themeSettings = new SkyThemeSettings(
//         SkyTheme.presets['${theme === SkyDocsCodeExampleTheme.Modern ? 'modern' : 'default'}'],
//         SkyThemeMode.presets.light
//       );

//       themeSvc.init(
//         document.body,
//         renderer,
//         themeSettings
//       );
//   }

// }`;

//     files[`${appPath}app.module.ts`] = `${moduleImportStatements.join('\n\n')}

// `;

//     files[`${srcPath}index.html`] = `<!--
//   The CSS links are needed for the StackBlitz demo only.
//   This is a workaround for a known bug that prevents external imports in CSS.
//   https://github.com/stackblitz/core/issues/133
// -->
// <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />${theme === SkyDocsCodeExampleTheme.Modern ? `<link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/static/skyux-icons/5.0.0/assets/css/skyux-icons.min.css" />` : ``}

// <sky-demo-app>
//   Loading...
// </sky-demo-app>`;

//     files[`${srcPath}main.ts`] = `${banner}
// import './polyfills';

// import {
//   enableProdMode
// } from '@angular/core';

// import {
//   platformBrowserDynamic
// } from '@angular/platform-browser-dynamic';

// import {
//   AppModule
// } from './app/app.module';

// platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
//   if (window['ngRef']) {
//     window['ngRef'].destroy();
//   }

//   window['ngRef'] = ref;
// }).catch(err => console.error(err));
// `;

//     files[`${srcPath}polyfills.ts`] = `${banner}
// import 'zone.js';
// `;

//     files[`${srcPath}styles.scss`] = `@import '~@skyux/theme/css/sky';
// ${theme === SkyDocsCodeExampleTheme.Modern ? `@import '~@skyux/theme/css/themes/modern/styles';` : ``}
// body {
//   background-color: #fff;
//   margin: 15px;
// }`;

//     files['angular.json'] = `{
//   "projects": {
//     "demo": {
//       "architect": {
//         "build": {
//           "options": {
//             "index": "src/index.html",
//             "styles": [
//               "src/styles.scss"
//             ]
//           }
//         }
//       }
//     }
//   }
// }`;

//     files['package.json'] = JSON.stringify({
//       dependencies
//     }, undefined, 2);

//     files['tsconfig.json'] = `{
//   "compilerOptions": {
//     "target": "es2017",
//     "moduleResolution": "node",
//     "emitDecoratorMetadata": true,
//     "experimentalDecorators": true,
//     "importHelpers": true,
//     "lib": [
//       "es2018",
//       "dom"
//     ]
//   }
// }`;

//     return files;
//   }

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

    const components = fragment.split(',');

    if (components.length > 1) {
      throw 'You may only export a single component from the code example module' +
        `(we found ${components.length}: ${components.join(', ')}).` +
        'Is it possible to create a new code example with the extra components?';
    }

    return components[0];
  }

  private getComponentSelector(
    componentClassName: string,
    sourceCode: SkyDocsSourceCodeFile[]
  ): string {

    const found = sourceCode.find((file) => {
      return (file.rawContents.indexOf(componentClassName) > -1);
    });

    const trimmed = found.rawContents.replace(/\s/g, '');

    return trimmed.split(`selector:'`)[1].split(`'`)[0];
  }

}
