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
    const interfaces = [
      {
        anchorId: 'interface-foo-basic',
        comment: {
          shortText: ''
        },
        kindString: 'Interface',
        name: 'FooBasic',
        sources: [{
          fileName: '/modules/foobar/foo-basic.ts'
        }]
      },
      {
        anchorId: 'interface-foo',
        children: [
          {
            comment: {
              shortText: 'This is the description for bar.'
            },
            kindString: 'Property',
            name: 'bar',
            type: {
              name: 'T',
              type: 'typeParameter'
            }
          },
          {
            comment: {
              shortText: 'This is the description for baz.'
            },
            flags: {
              isOptional: true
            },
            kindString: 'Property',
            name: 'baz',
            type: {
              constraint: {
                type: 'reference',
                name: 'FooUser'
              },
              name: 'U',
              type: 'typeParameter'
            }
          },
          {
            name: 'user',
            kindString: 'Property',
            type: {
              type: 'reference',
              name: 'FooUser'
            }
          }
        ],
        comment: {
          shortText: 'Description for Foo.'
        },
        indexSignature: [
          {
            comment: {
              shortText: 'The key/value pair.'
            },
            parameters: [
              {
                name: 'key',
                type: {
                  name: 'string'
                }
              }
            ],
            type: {
              name: 'any'
            }
          }
        ],
        kindString: 'Interface',
        name: 'Foo',
        sources: [{
          fileName: '/modules/foobar/foo.ts'
        }],
        typeParameter: [
          {
            kindString: 'Type parameter',
            name: 'T'
          },
          {
            kindString: 'Type parameter',
            name: 'U',
            type: {
              name: 'FooUser',
              type: 'reference'
            }
          }
        ]
      }
    ];

    definitionsProvider = {
      anchorIds: {},
      typeDefinitions: [
        ...interfaces
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
          anchorId: 'interface-foo-basic',
          description: '',
          name: 'FooBasic',
          properties: [],
          typeParameters: []
        },
        {
          anchorId: 'interface-foo',
          description: 'Description for Foo.',
          name: 'Foo',
          properties: [
            {
              description: 'This is the description for bar.',
              isOptional: true,
              name: 'bar',
              type: 'T'
            },
            {
              description: 'This is the description for baz.',
              isOptional: true,
              name: 'baz',
              type: 'U'
            },
            {
              description: '',
              isOptional: true,
              name: 'user',
              type: 'FooUser'
            },
            {
              description: 'The key/value pair.',
              isOptional: false,
              name: '[key: string]',
              type: 'any'
            }
          ],
          typeParameters: ['T', 'U extends FooUser']
        }
      ],
      pipes: [],
      services: [],
      typeAliases: []
    });
  });

  it('should return empty type arrays if the path does not include types', () => {
    (definitionsProvider as any).typeDefinitions = undefined;

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
