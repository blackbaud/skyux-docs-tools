import { expect } from '@skyux-sdk/testing';

import { MockTypeDocAdapterService } from './fixtures/mock-type-definitions.service';

import { SkyDocsTypeDefinitions } from './type-definitions';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

import { SkyDocsTypeDefinitionsService } from './type-definitions.service';

import { SkyDocsTypeDocAdapterService } from './typedoc-adapter.service';
import { TypeDocKind } from './typedoc-types';

describe('Type definitions service', function () {
  //#region helpers

  function getServiceAndAdapter(
    provider: SkyDocsTypeDefinitionsProvider = {
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          decorators: [{ name: 'Component', type: {} }],
          name: 'FooComponent',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.component.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'Directive', type: {} }],
          name: 'FooDirective',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.directive.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'Injectable', type: {} }],
          name: 'FooService',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.service.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'NgModule', type: {} }],
          name: 'FooModule',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.module.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'Pipe', type: {} }],
          name: 'FooPipe',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.pipe.ts',
            },
          ],
        },
        {
          anchorId: '',
          name: 'FooClass',
          kind: TypeDocKind.Class,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo-class.ts',
            },
          ],
        },
        {
          anchorId: '',
          name: 'Foo',
          kind: TypeDocKind.Interface,
          sources: [
            { fileName: 'src/app/public/modules/_documentation-test/foo.ts' },
          ],
        },
        {
          anchorId: '',
          name: 'FooEnum',
          kind: TypeDocKind.Enum,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo-enum.ts',
            },
          ],
        },
        {
          anchorId: '',
          name: 'TypeAlias',
          kind: TypeDocKind.TypeAlias,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo-alias.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'Component', type: {} }],
          name: 'BarComponent',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test-2/bar.component.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'Directive', type: {} }],
          name: 'BarDirective',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test-2/bar.directive.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'Injectable', type: {} }],
          name: 'BarService',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test-2/bar.service.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'NgModule', type: {} }],
          name: 'BarModule',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test-2/bar.module.ts',
            },
          ],
        },
        {
          anchorId: '',
          decorators: [{ name: 'Pipe', type: {} }],
          name: 'BarPipe',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test-2/bar.pipe.ts',
            },
          ],
        },
        {
          anchorId: '',
          name: 'BarClass',
          kind: TypeDocKind.Class,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test-2/bar-class.ts',
            },
          ],
        },
        {
          anchorId: '',
          name: 'Bar',
          kind: TypeDocKind.Interface,
          sources: [
            { fileName: 'src/app/public/modules/_documentation-test-2/bar.ts' },
          ],
        },
        {
          anchorId: '',
          name: 'BarEnum',
          kind: TypeDocKind.Enum,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test-2/bar-enum.ts',
            },
          ],
        },
        {
          anchorId: '',
          name: 'BarTypeAlias',
          kind: TypeDocKind.TypeAlias,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test-2/bar-alias.ts',
            },
          ],
        },
      ],
    },
  ): {
    service: SkyDocsTypeDefinitionsService;
    adapter: SkyDocsTypeDocAdapterService;
  } {
    const adapter = new MockTypeDocAdapterService();
    return {
      service: new SkyDocsTypeDefinitionsService(
        provider,
        adapter as SkyDocsTypeDocAdapterService,
      ),
      adapter: adapter,
    };
  }

  //#endregion

  it('should return type definitions from a specific source code path', () => {
    const service = getServiceAndAdapter().service;
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    for (const key in result) {
      if (result.hasOwnProperty(key) && key !== 'hasPreviewFeatures') {
        const lookup = key as keyof Omit<
          SkyDocsTypeDefinitions,
          'hasPreviewFeatures'
        >;
        expect(result[lookup].length)
          .withContext(
            'The result is expected to have one item in each category.',
          )
          .toEqual(1);
      }
    }
  });

  it('should return type definitions from a specific source code file', () => {
    const service = getServiceAndAdapter().service;
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/foo-class.ts',
    );

    for (const key in result) {
      if (result.hasOwnProperty(key) && key !== 'hasPreviewFeatures') {
        const lookup = key as keyof Omit<
          SkyDocsTypeDefinitions,
          'hasPreviewFeatures'
        >;

        if (lookup === 'classes') {
          expect(result[lookup].length)
            .withContext('The result is expected to have one class.')
            .toEqual(1);
        } else {
          expect(result[lookup].length)
            .withContext(
              'The result should not have any objects other than one class',
            )
            .toEqual(0);
        }
      }
    }
  });

  it('should return type definitions from multiple source code paths', () => {
    const service = getServiceAndAdapter().service;
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
      ['/src/app/public/modules/_documentation-test-2/'],
    );

    for (const key in result) {
      if (result.hasOwnProperty(key) && key !== 'hasPreviewFeatures') {
        const lookup = key as keyof Omit<
          SkyDocsTypeDefinitions,
          'hasPreviewFeatures'
        >;
        expect(result[lookup].length)
          .withContext(
            'The result is expected to have one item in each category.',
          )
          .toEqual(2);
      }
    }
  });

  /* Purely a sanity check for null refs */
  it('should throw an error if the `sourceCodePath` parameter is undefined.', () => {
    const service = getServiceAndAdapter().service;
    expect(function () {
      service.getTypeDefinitions(undefined, [
        '/src/app/public/modules/_documentation-test-2/',
      ]);
    }).toThrow(new Error('The `sourceCodePath` parameter is required'));
  });

  it('should return empty type arrays if the path does not include types', () => {
    const service = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: undefined,
    }).service;
    const result = service.getTypeDefinitions('/src/app/public/modules/empty/');
    expect(result).toEqual({
      classes: [],
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: [],
      hasPreviewFeatures: false,
    });
  });

  it('should return empty type arrays if the path to a file does not return a type', () => {
    const service = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: undefined,
    }).service;
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/empty-file.ts',
    );
    expect(result).toEqual({
      classes: [],
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: [],
      hasPreviewFeatures: false,
    });
  });

  it('should warn if the provider does not include types', () => {
    const spy = spyOn(console, 'warn');
    const service = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [],
    }).service;
    service.getTypeDefinitions('/src/app/public/modules/empty/');
    expect(spy).toHaveBeenCalledWith(
      'Type definitions were not found for location: modules/empty/',
    );
  });

  it('should throw an error if the source code path does not end in a slash or `.ts`', () => {
    const service = getServiceAndAdapter().service;
    expect(function () {
      service.getTypeDefinitions('/src/app/public/modules/foobar');
    }).toThrow(
      new Error(
        'Source code paths must end with a forward slash (`/`) or `.ts`.',
      ),
    );
    expect(function () {
      service.getTypeDefinitions('/src/app/public/modules/foobar/thing.scss');
    }).toThrow(
      new Error(
        'Source code paths must end with a forward slash (`/`) or `.ts`.',
      ),
    );
  });

  it('should return type definitions which do not denote preview features when there are none', () => {
    const service = getServiceAndAdapter().service;
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeFalse();
  });

  it('should return type definitions which denote preview features when there is a class with a preview feature', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          name: 'FooClass',
          kind: TypeDocKind.Class,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo-class.ts',
            },
          ],
        },
      ],
    });
    const service = serviceAndAdapter.service;
    spyOn(serviceAndAdapter.adapter, 'toClassDefinition').and.callFake(
      (entry) => {
        return {
          hasPreviewFeatures: true,
          anchorId: entry.anchorId,
          name: entry.name,
        };
      },
    );
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeTrue();
  });

  it('should return type definitions which denote preview features when there is a service with a preview feature', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          decorators: [{ name: 'Injectable', type: {} }],
          name: 'FooService',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.service.ts',
            },
          ],
        },
      ],
    });
    const service = serviceAndAdapter.service;
    spyOn(serviceAndAdapter.adapter, 'toClassDefinition').and.callFake(
      (entry) => {
        return {
          hasPreviewFeatures: true,
          anchorId: entry.anchorId,
          name: entry.name,
        };
      },
    );
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeTrue();
  });

  it('should return type definitions which denote preview features when there is a directive with a preview feature', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          decorators: [{ name: 'Directive', type: {} }],
          name: 'FooDirective',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.directive.ts',
            },
          ],
        },
      ],
    });
    const service = serviceAndAdapter.service;
    spyOn(serviceAndAdapter.adapter, 'toDirectiveDefinition').and.callFake(
      (entry) => {
        return {
          hasPreviewFeatures: true,
          anchorId: entry.anchorId,
          name: entry.name,
          selector: 'foo',
        };
      },
    );
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeTrue();
  });

  it('should return type definitions which denote preview features when there is a component with a preview feature', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          decorators: [{ name: 'Component', type: {} }],
          name: 'FooComponent',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.component.ts',
            },
          ],
        },
      ],
    });
    const service = serviceAndAdapter.service;
    spyOn(serviceAndAdapter.adapter, 'toDirectiveDefinition').and.callFake(
      (entry) => {
        return {
          hasPreviewFeatures: true,
          anchorId: entry.anchorId,
          name: entry.name,
          selector: 'foo',
        };
      },
    );
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeTrue();
  });

  it('should return type definitions which denote preview features when there is a enum with a preview feature', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          name: 'FooEnum',
          kind: TypeDocKind.Enum,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo-enum.ts',
            },
          ],
        },
      ],
    });
    const service = serviceAndAdapter.service;
    spyOn(serviceAndAdapter.adapter, 'toEnumerationDefinition').and.callFake(
      (entry) => {
        return {
          hasPreviewFeatures: true,
          anchorId: entry.anchorId,
          members: undefined,
          name: entry.name,
        };
      },
    );
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeTrue();
  });

  it('should return type definitions which denote preview features when there is a interface with a preview feature', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          name: 'Foo',
          kind: TypeDocKind.Interface,
          sources: [
            { fileName: 'src/app/public/modules/_documentation-test/foo.ts' },
          ],
        },
      ],
    });
    const service = serviceAndAdapter.service;
    spyOn(serviceAndAdapter.adapter, 'toInterfaceDefinition').and.callFake(
      (entry) => {
        return {
          hasPreviewFeatures: true,
          anchorId: entry.anchorId,
          name: entry.name,
          properties: [],
        };
      },
    );
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeTrue();
  });

  it('should return type definitions which denote preview features when there is a pipe with a preview feature', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          decorators: [{ name: 'Pipe', type: {} }],
          name: 'FooPipe',
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo.pipe.ts',
            },
          ],
        },
      ],
    });
    const service = serviceAndAdapter.service;
    spyOn(serviceAndAdapter.adapter, 'toPipeDefinition').and.callFake(
      (entry) => {
        return {
          anchorId: entry.anchorId,
          name: entry.name,
          transformMethod: {
            name: 'transform',
            isPreview: true,
            type: {
              callSignature: {
                returnType: {
                  name: 'stringj',
                },
              },
            },
          },
        };
      },
    );
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeTrue();
  });

  it('should return type definitions which denote preview features when there is a type alias with a preview feature', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          name: 'TypeAlias',
          kind: TypeDocKind.TypeAlias,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo-alias.ts',
            },
          ],
        },
      ],
    });
    const service = serviceAndAdapter.service;
    spyOn(serviceAndAdapter.adapter, 'toTypeAliasDefinition').and.callFake(
      (entry) => {
        return {
          anchorId: entry.anchorId,
          name: entry.name,
          isPreview: true,
          type: {},
        };
      },
    );
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.hasPreviewFeatures).toBeTrue();
  });

  it('should consider a "reference" type as a type alias', () => {
    const serviceAndAdapter = getServiceAndAdapter({
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: '',
          name: 'MyReferenceType',
          kind: TypeDocKind.Reference,
          sources: [
            {
              fileName:
                'src/app/public/modules/_documentation-test/foo-reference.ts',
            },
          ],
        },
      ],
    });

    const service = serviceAndAdapter.service;
    const result = service.getTypeDefinitions(
      '/src/app/public/modules/_documentation-test/',
    );

    expect(result.typeAliases[0].name).toEqual('MyReferenceType');
  });
});
