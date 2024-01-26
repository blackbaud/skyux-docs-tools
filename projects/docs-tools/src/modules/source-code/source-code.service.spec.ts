import { SkyDocsSourceCodeProvider } from './source-code-provider';

import { SkyDocsSourceCodeService } from './source-code.service';

describe('Source code service', () => {
  let service: SkyDocsSourceCodeService;
  const path = 'foo/bar';

  it('getSourceCode should handle decoded rawContents', () => {
    const mockSourceCodeProvider: SkyDocsSourceCodeProvider = {
      sourceCode: [
        {
          fileName: 'foo',
          filePath: 'foo/bar',
          rawContents: '<baz></baz>',
        },
      ],
      dependencies: {},
    };
    service = new SkyDocsSourceCodeService(mockSourceCodeProvider);
    expect(service.getSourceCode(path)[0].rawContents).toEqual('<baz></baz>');
  });

  it('getSourceCode should handle encoded rawContents', () => {
    const mockSourceCodeProvider: SkyDocsSourceCodeProvider = {
      sourceCode: [
        {
          fileName: 'foo',
          filePath: 'foo/bar',
          rawContents: '%3Cbaz%3E%3C/baz%3E',
        },
      ],
      dependencies: {},
    };
    service = new SkyDocsSourceCodeService(mockSourceCodeProvider);
    expect(service.getSourceCode(path)[0].rawContents).toEqual('<baz></baz>');
  });

  it('getSourceCode should handle decoded rawContents with URI reserved characters', () => {
    const mockSourceCodeProvider: SkyDocsSourceCodeProvider = {
      sourceCode: [
        {
          fileName: 'foo',
          filePath: 'foo/bar',
          rawContents: '<baz style="width: 50%;"></baz>',
        },
      ],
      dependencies: {},
    };
    service = new SkyDocsSourceCodeService(mockSourceCodeProvider);
    expect(service.getSourceCode(path)[0].rawContents).toEqual(
      '<baz style="width: 50%;"></baz>'
    );
  });

  it('getSourceCode should handle no match', () => {
    const mockSourceCodeProvider: SkyDocsSourceCodeProvider = {
      sourceCode: [],
      dependencies: {},
    };
    service = new SkyDocsSourceCodeService(mockSourceCodeProvider);
    expect(service.getSourceCode(path)).toEqual([]);
  });

  it('getSourceCodeDependencies should get dependencies', () => {
    const mockSourceCodeProvider: SkyDocsSourceCodeProvider = {
      sourceCode: [],
      dependencies: {
        'foo/bar': { pkg1: '1.0.0', pkg2: '2.0.0' },
      },
    };
    service = new SkyDocsSourceCodeService(mockSourceCodeProvider);
    expect(service.getSourceCodeDependencies(path)).toEqual({
      pkg1: '1.0.0',
      pkg2: '2.0.0',
    });
    expect(service.getSourceCodeDependencies('other')).toEqual({});
  });
});
