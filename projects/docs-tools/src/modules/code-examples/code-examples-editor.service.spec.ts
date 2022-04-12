import { expect } from '@skyux-sdk/testing';

import StackBlitzSDK from '@stackblitz/sdk';

import { SkyDocsCodeExample } from './code-example';

import { SkyDocsCodeExamplesEditorService } from './code-examples-editor.service';

import { SkyDocsCodeExampleTheme } from './code-example-theme';

//#region helpers
const moduleImports: string[] = [
  'BrowserAnimationsModule',
  'FormsModule',
  'ReactiveFormsModule',
  'RouterModule.forRoot([])',
];

const sampleModuleContents: string = `
import {
  NgModule
} from '@angular/core';

import {
  SampleDemoComponent
} from './foo.component';

@NgModule({
  declarations: [
    SampleDemoComponent
  ],
  exports: [
    SampleDemoComponent
  ]
})
export class SampleDemoModule {}
`;

const sampleModuleContentsNoExports: string = `
import {
  NgModule
} from '@angular/core';

@NgModule({})
export class SampleDemoModule {}
`;

const sampleComponentContents: string = `
import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-sample-demo',
  template: ''
})
export class SampleDemoComponent {}`;

const sampleModuleContentsMultipleExports: string = `
import {
  NgModule
} from '@angular/core';

import {
  SampleDemoComponent
} from './foo.component';

import {
  BarComponent
} from './bar.component';

@NgModule({
  declarations: [
    SampleDemoComponent,
    BarComponent
  ],
  exports: [
    SampleDemoComponent,
    BarComponent
  ]
})
export class SampleDemoModule {}
`;

const codeExample: SkyDocsCodeExample = {
  heading: 'Basic example',
  packageDependencies: {},
  sourceCode: [
    {
      fileName: 'foo.component.ts',
      filePath: './',
      rawContents: sampleComponentContents,
    },
    {
      fileName: 'foo.module.ts',
      filePath: './',
      rawContents: sampleModuleContents,
    },
  ],
  theme: SkyDocsCodeExampleTheme.Default,
};

const codeExampleNoExports: SkyDocsCodeExample = {
  heading: 'Basic example',
  packageDependencies: {},
  sourceCode: [
    {
      fileName: 'foo.module.ts',
      filePath: './',
      rawContents: sampleModuleContentsNoExports,
    },
  ],
  theme: SkyDocsCodeExampleTheme.Default,
};

const codeExampleMultipleExports: SkyDocsCodeExample = {
  heading: 'Basic example',
  packageDependencies: {},
  sourceCode: [
    {
      fileName: 'foo.module.ts',
      filePath: './',
      rawContents: sampleModuleContentsMultipleExports,
    },
  ],
  theme: SkyDocsCodeExampleTheme.Default,
};
//#endregion

describe('Code examples editor service', () => {
  let stackblitzSpy: jasmine.Spy;
  let service: SkyDocsCodeExamplesEditorService;

  beforeEach(() => {
    stackblitzSpy = spyOn(StackBlitzSDK, 'openProject').and.callFake(() => {});
    service = new SkyDocsCodeExamplesEditorService();
  });

  it('should set SkyTheme to modern when theme property is set to Modern', () => {
    codeExample.theme = SkyDocsCodeExampleTheme.Modern;

    service.launchEditor(codeExample);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    expect(spyArgs[0].files['src/app/app.component.ts']).toContain(
      `SkyTheme.presets['modern']`
    );
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain(
      'SkyThemeService'
    );
  });

  it('should set SkyTheme to default when theme property is set to Default', () => {
    codeExample.theme = SkyDocsCodeExampleTheme.Default;

    service.launchEditor(codeExample);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    expect(spyArgs[0].files['src/app/app.component.ts']).toContain(
      `SkyTheme.presets['default']`
    );
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain(
      'SkyThemeService'
    );
  });

  it('should add modules from code example to app.module.ts', () => {
    moduleImports.push('SampleDemoModule');

    service.launchEditor(codeExample);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain(
      `import {\n  SampleDemoModule\n} from './foo.module';`
    );
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain(
      `imports: [\n    ${moduleImports.join(',\n    ')}`
    );
  });

  it('should throw an error if code example module does not have any exports', () => {
    expect(() => {
      service.launchEditor(codeExampleNoExports);
    }).toThrow('You must export a component from the code example module!');
  });

  it('should throw an error if code example module has multiple exports', () => {
    try {
      service.launchEditor(codeExampleMultipleExports);
      fail('Expected test to throw error!');
    } catch (error) {
      expect(error).toContain(
        'You may only export a single component from the code example module'
      );
    }
  });

  it('should handle code example module with a component with a trailing comma in the exports section', () => {
    const example: SkyDocsCodeExample = {
      heading: 'Basic example',
      packageDependencies: {},
      sourceCode: [
        {
          fileName: 'foo.component.ts',
          filePath: './',
          rawContents: sampleComponentContents,
        },
        {
          fileName: 'foo.module.ts',
          filePath: './',
          rawContents: `
            import {
              NgModule
            } from '@angular/core';

            import {
              SampleDemoComponent
            } from './foo.component';

            import {
              BarComponent
            } from './bar.component';

            @NgModule({
              declarations: [
                SampleDemoComponent,
                BarComponent
              ],
              exports: [
                SampleDemoComponent,
              ]
            })
            export class SampleDemoModule {}
            `, // ^ Important, add trailing comma after component listed in exports.
        },
      ],
      theme: SkyDocsCodeExampleTheme.Default,
    };

    expect(() => service.launchEditor(example)).not.toThrow();
  });

  it('should convert "*" versions of SKY UX packages to "^6.0.0-0"', () => {
    codeExample.packageDependencies = {
      '@skyux/foobar': '*',
    };

    service.launchEditor(codeExample);

    expect(stackblitzSpy.calls.mostRecent().args[0].dependencies).toEqual({
      '@angular/animations': '^13.0.0',
      '@angular/common': '^13.0.0',
      '@angular/compiler': '^13.0.0',
      '@angular/core': '^13.0.0',
      '@angular/forms': '^13.0.0',
      '@angular/platform-browser': '^13.0.0',
      '@angular/platform-browser-dynamic': '^13.0.0',
      '@angular/router': '^13.0.0',
      '@skyux/animations': '^6.0.0-0',
      '@skyux/assets': '^6.0.0-0',
      '@skyux/config': '^6.0.0-0',
      '@skyux/core': '^6.0.0-0',
      '@skyux/errors': '^6.0.0-0',
      '@skyux/forms': '^6.0.0-0',
      '@skyux/http': '^6.0.0-0',
      '@skyux/i18n': '^6.0.0-0',
      '@skyux/indicators': '^6.0.0-0',
      '@skyux/layout': '^6.0.0-0',
      '@skyux/modals': '^6.0.0-0',
      '@skyux/popovers': '^6.0.0-0',
      '@skyux/router': '^6.0.0-0',
      '@skyux/theme': '^6.0.0-0',
      rxjs: '^7',
      tslib: '^2.3.0',
      'zone.js': '~0.11.4',
      '@skyux/foobar': '^6.0.0-0', // <-- Important
    });
  });

  it('should accept additional global stylesheets', () => {
    codeExample.stylesheets = ['@global/foo/css/styles.css'];
    service.launchEditor(codeExample);
    expect(
      JSON.parse(stackblitzSpy.calls.mostRecent().args[0].files['angular.json'])
        .projects.demo.architect.build.options.styles
    ).toEqual(['@global/foo/css/styles.css', 'src/styles.scss']);
  });
});
