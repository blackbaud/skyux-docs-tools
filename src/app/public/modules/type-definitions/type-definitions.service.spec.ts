import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

import {
  SkyDocsTypeDefinitionsService
} from './type-definitions.service';

describe('Type definitions service', function () {

  let definitionsProvider: SkyDocsTypeDefinitionsProvider;

  beforeEach(() => {
    definitionsProvider = {
      anchorIds: {},
      typeDefinitions: [
        {
          anchorId: 'foo-user',
          kindString: 'Interface',
          name: 'FooUser',
          sources: [{
            fileName: '/modules/foobar/foo-user.ts'
          }],
          comment: {
            shortText: 'Description for FooUser.'
          }
        }
      ]
    };
  });

  it('should return type definitions from a specific source code path', () => {
    const service = new SkyDocsTypeDefinitionsService(definitionsProvider);
    const result = service.getTypeDefinitions('/src/app/public/modules/foobar/');
    expect(result).toEqual({
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [
        {
          anchorId: 'foo-user',
          description: 'Description for FooUser.',
          name: 'FooUser',
          properties: [],
          typeParameters: []
        }
      ],
      pipes: [],
      services: [],
      typeAliases: []
    });
  });

  it('should return empty type arrays if the path does not include types', () => {
    const service = new SkyDocsTypeDefinitionsService(definitionsProvider);
    const result = service.getTypeDefinitions('/src/app/public/modules/empty/');
    expect(result).toEqual({
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: []
    });
  });

  it('should throw an error if the source code path does not end in a slash', () => {
    const service = new SkyDocsTypeDefinitionsService(definitionsProvider);
    expect(function () {
      service.getTypeDefinitions('/src/app/public/modules/foobar');
    }).toThrow(
      new Error('The source code path must end with a forward slash (`/`).')
    );
  });

});
