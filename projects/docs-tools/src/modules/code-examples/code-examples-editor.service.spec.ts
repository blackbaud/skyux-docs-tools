import { VERSION as ANGULAR_VERSION } from '@angular/core';
import { expect } from '@skyux-sdk/testing';
import { VERSION as SKY_UX_VERSION } from '@skyux/core';
import { VERSION as SKY_UX_ICONS_VERSION } from '@skyux/icons';
import StackBlitzSDK from '@stackblitz/sdk';

import { SkyDocsCodeExample } from './code-example';
import { SkyDocsCodeExampleTheme } from './code-example-theme';
import { SkyDocsCodeExamplesEditorService } from './code-examples-editor.service';

//#region helpers
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

const sampleComponentSpecContents: string = `
  import { TestBed } from '@angular/core/testing';
  import { SampleDemoComponent } from './foo.component';
  import { SampleDemoModule } from './foo.module';

  describe('sample demo component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SampleDemoModule]
      });
      TestBed.createComponent(SampleDemoComponent);
    })

    it('should test something', () => {
      expect(2).toBe(2);
    });
  });
`;

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
      fileName: 'demo.component.html',
      filePath: './',
      rawContents: `<app-sample-demo></app-sample-demo>`,
    },
    {
      fileName: 'foo.module.ts',
      filePath: './',
      rawContents: sampleModuleContents,
    },
  ],
  theme: SkyDocsCodeExampleTheme.Default,
};

const codeExampleWithSpec: SkyDocsCodeExample = {
  heading: 'Basic example',
  packageDependencies: {},
  sourceCode: [
    {
      fileName: 'foo.component.spec.ts',
      filePath: './',
      rawContents: sampleComponentSpecContents,
    },
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

const codeExampleWithStandaloneComponent: SkyDocsCodeExample = {
  heading: 'Standalone example',
  packageDependencies: {},
  sourceCode: [
    {
      fileName: 'demo.component.ts',
      filePath: './',
      rawContents: sampleComponentContents,
    },
  ],
  theme: SkyDocsCodeExampleTheme.Default,
};
//#endregion

describe('Code examples editor service', () => {
  let moduleImports: string[];
  let stackblitzSpy: jasmine.Spy;
  let service: SkyDocsCodeExamplesEditorService;

  beforeEach(() => {
    moduleImports = [
      'BrowserAnimationsModule',
      'FormsModule',
      'ReactiveFormsModule',
      'RouterModule.forRoot([])',
    ];

    stackblitzSpy = spyOn(StackBlitzSDK, 'openProject').and.callFake(() => {});
    service = new SkyDocsCodeExamplesEditorService();
  });

  it('should set SkyTheme to modern when theme property is set to Modern', () => {
    codeExample.theme = SkyDocsCodeExampleTheme.Modern;

    service.launchEditor(codeExample);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    expect(spyArgs[0].files['src/app/app.component.ts']).toContain(
      `SkyTheme.presets['modern']`,
    );
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain(
      'SkyThemeService',
    );
  });

  it('should set SkyTheme to default when theme property is set to Default', () => {
    codeExample.theme = SkyDocsCodeExampleTheme.Default;

    service.launchEditor(codeExample);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    expect(spyArgs[0].files['src/app/app.component.ts']).toContain(
      `SkyTheme.presets['default']`,
    );
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain(
      'SkyThemeService',
    );
  });

  it('should handle a spec file in the code example contents', () => {
    service.launchEditor(codeExampleWithSpec);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;

    expect(spyArgs[0].files['src/app/foo.component.spec.ts']).toBeDefined();
  });

  it('should add modules from code example to app.module.ts', () => {
    moduleImports.push('SampleDemoModule');

    service.launchEditor(codeExample);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain(
      `import {\n  SampleDemoModule\n} from './foo.module';`,
    );
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain(
      `imports: [\n    ${moduleImports.join(',\n    ')}`,
    );
  });

  it('should add standalone components from code example to app.module.ts', () => {
    moduleImports.push('DemoComponent');
    service.launchEditor(codeExampleWithStandaloneComponent);

    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    const appModuleContents = spyArgs[0].files['src/app/app.module.ts'];

    expect(appModuleContents).toContain(
      `import {\n  DemoComponent\n} from './demo.component';`,
    );

    expect(appModuleContents).toContain(
      `imports: [\n    ${moduleImports.join(',\n    ')}`,
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
        'You may only export a single component from the code example module',
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

  it('should convert "*" versions of SKY UX packages to "^9.0.0"', () => {
    codeExample.packageDependencies = {
      '@skyux/foobar': '*',
    };

    service.launchEditor(codeExample);

    const angularVersion = `^${ANGULAR_VERSION.major}`;
    const skyuxVersion = `^${SKY_UX_VERSION.full}`;

    expect(stackblitzSpy.calls.mostRecent().args[0].dependencies).toEqual({
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
      '@skyux/indicators': skyuxVersion,
      '@skyux/layout': skyuxVersion,
      '@skyux/modals': skyuxVersion,
      '@skyux/packages': skyuxVersion,
      '@skyux/popovers': skyuxVersion,
      '@skyux/router': skyuxVersion,
      '@skyux/theme': skyuxVersion,
      '@types/jasmine': '~4.3.1',
      'ng2-dragula': '^5.0.1',
      rxjs: '^7',
      tslib: '^2.5.0',
      typescript: '~5.1.6',
      'zone.js': '~0.13.1',
      '@skyux/foobar': skyuxVersion, // <-- Important
    });
  });

  it('should accept additional global stylesheets', () => {
    codeExample.stylesheets = ['@global/foo/css/styles.css'];
    service.launchEditor(codeExample);
    expect(
      JSON.parse(stackblitzSpy.calls.mostRecent().args[0].files['angular.json'])
        .projects.demo.architect.build.options.styles,
    ).toEqual(['@global/foo/css/styles.css', 'src/styles.scss']);
  });

  it('should add the icons stylesheet', () => {
    service.launchEditor(codeExample);

    expect(
      stackblitzSpy.calls.mostRecent().args[0].files['src/index.html'],
    ).toContain(
      `<link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/static/skyux-icons/${SKY_UX_ICONS_VERSION.full}/assets/css/skyux-icons.min.css" crossorigin="anonymous">`,
    );
  });
});
