import {
  expect
} from '@skyux-sdk/testing';

import StackBlitzSDK from '@stackblitz/sdk';

import {
  SkyDocsCodeExample
} from './code-example';

import {
  SkyDocsCodeExamplesEditorService
} from './code-examples-editor.service';

import {
  SkyDocsCodeExampleTheme
} from './code-example-theme';

describe('Code examples editor service', () => {

  it('should set SkyTheme to modern when theme property is set to Modern', () => {
    const service = new SkyDocsCodeExamplesEditorService();
    const stackblitzSpy = spyOn(StackBlitzSDK, 'openProject').and.callFake(() => {});
    const codeExample: SkyDocsCodeExample = {
      heading: 'foo',
      packageDependencies: {},
      sourceCode: [
        {
          fileName: 'foo.component.ts',
          filePath: 'foo',
          rawContents: 'These are my file contents!'
        }
      ],
      theme: SkyDocsCodeExampleTheme.Modern
    };

    service.launchEditor(codeExample);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    expect(spyArgs[0].files['src/app/app.component.ts']).toContain(`SkyTheme.presets['modern']`);
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain('SkyThemeService');
  });

  it('should set SkyTheme to default when theme property is set to Default', () => {
    const service = new SkyDocsCodeExamplesEditorService();
    const stackblitzSpy = spyOn(StackBlitzSDK, 'openProject').and.callFake(() => {});
    const codeExample: SkyDocsCodeExample = {
      heading: 'foo',
      packageDependencies: {},
      sourceCode: [
        {
          fileName: 'foo.component.ts',
          filePath: 'foo',
          rawContents: 'These are my file contents!'
        }
      ],
      theme: SkyDocsCodeExampleTheme.Default
    };

    service.launchEditor(codeExample);

    expect(stackblitzSpy).toHaveBeenCalled();
    const spyArgs = stackblitzSpy.calls.mostRecent().args;
    expect(spyArgs[0].files['src/app/app.component.ts']).toContain(`SkyTheme.presets['default']`);
    expect(spyArgs[0].files['src/app/app.module.ts']).toContain('SkyThemeService');
  });

});
