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
    const components = [
      {
        anchorId: 'component-foo',
        children: [
          {
            kindString: 'Property',
            name: 'ignoreMe'
          },
          {
            decorators: [{
              name: 'Input'
            }],
            kindString: 'Property',
            name: 'zed',
            type: {
              name: 'string'
            }
          },
          {
            comment: {
              shortText: 'Description for userIds.',
              tags: [
                {
                  tag: 'required',
                  text: '\n'
                },
                {
                  tag: 'deprecated',
                  text: 'This is no longer needed.'
                },
                {
                  tag: 'example',
                  text: '\n```typescript\nconst a: string;\n```\n'
                }
              ]
            },
            decorators: [{
              name: 'Input'
            }],
            kindString: 'Property',
            name: 'userIds',
            type: {
              type: 'array',
              elementType: {
                type: 'reference',
                name: 'number'
              }
            }
          },
          {
            decorators: [{
              name: 'Output'
            }],
            defaultValue: 'new EventEmitter<FooUser>()',
            kindString: 'Property',
            name: 'click',
            type: {
              name: 'EventEmitter',
              typeArguments: [{
                type: 'reference',
                name: 'FooUser'
              }]
            }
          },
          {
            comment: {
              tags: [
                {
                  tag: 'default',
                  text: 'new FooUser()'
                }
              ]
            },
            decorators: [{
              name: 'Input'
            }],
            kindString: 'Accessor',
            name: 'bar',
            setSignature: [{
              comment: {
                shortText: 'Description for bar.'
              },
              parameters: [{
                type: {
                  type: 'reference',
                  name: 'FooUser'
                }
              }]
            }]
          },
          {
            decorators: [{
              name: 'Input'
            }],
            kindString: 'Accessor',
            name: 'basicAccessor',
            setSignature: [{
              parameters: [{
                type: {
                  type: 'reference',
                  name: 'string'
                }
              }]
            }]
          }
        ],
        comment: {
          shortText: 'This is the description for FooComponent.',
          tags: [
            {
              tag: 'deprecated',
              text: 'This is no longer needed.'
            },
            {
              tag: 'example',
              text: '\n```markup\n<app-foo [baz]=\"true\"></app-foo>\n```\n'
            }
          ]
        },
        decorators: [
          {
            arguments: {
              obj: "{\n  selector: 'app-foo',\n  template: ''\n}"
            }
          }
        ],
        kindString: 'Class',
        name: 'FooComponent',
        sources: [{
          fileName: '/modules/foobar/foo.component.ts'
        }]
      }
    ];

    const directives = [
      {
        anchorId: 'directive-foo',
        children: [
          {
            decorators: [{
              name: 'Input'
            }],
            kindString: 'Property',
            name: 'basic',
            type: {
              name: 'string'
            }
          }
        ],
        comment: {
          shortText: 'This is the description for FooDirective.'
        },
        decorators: [
          {
            arguments: {
              obj: "{\n  selector: 'appFoo'\n \n}"
            }
          }
        ],
        kindString: 'Class',
        name: 'FooDirective',
        sources: [{
          fileName: '/modules/foobar/foo.directive.ts'
        }]
      }
    ];

    const pipes = [
      {
        name: 'FooPipe',
        kindString: 'Class',
        sources: [{
          fileName: '/modules/foobar/foo.pipe.ts'
        }],
        children: [
          {
            kindString: 'Method',
            name: 'transform',
            signatures: [
              {
                name: 'transform',
                kindString: 'Call signature',
                comment: {
                  shortText: 'Transforms the content.'
                },
                parameters: [
                  {
                    name: 'value',
                    kindString: 'Parameter',
                    comment: {
                      text: 'The date to transform.'
                    },
                    type: {
                      type: 'reference',
                      name: 'Date'
                    }
                  },
                  {
                    name: 'format',
                    kindString: 'Parameter',
                    flags: {
                      isOptional: true
                    },
                    comment: {
                      text: 'The date format to use.'
                    },
                    type: {
                      type: 'intrinsic',
                      name: 'string'
                    }
                  },
                  {
                    name: 'locale',
                    kindString: 'Parameter',
                    flags: {
                      isOptional: true
                    },
                    comment: {
                      text: 'The desired locale.'
                    },
                    type: {
                      type: 'intrinsic',
                      name: 'string'
                    }
                  }
                ],
                type: {
                  type: 'intrinsic',
                  name: 'string'
                }
              }
            ]
          }
        ],
        comment: {}
      }
    ];

    const services = [
      {
        name: 'FooService',
        sources: [{
          fileName: '/modules/foobar/foo.service.ts'
        }],
        comment: {
          shortText: 'This is the description for FooService.'
        },
        children: [
          {
            name: 'FOOS',
            kindString: 'Property',
            comment: {
              shortText: 'This is the description for FOOS.'
            },
            type: {
              type: 'array',
              elementType: {
                type: 'intrinsic',
                name: 'string'
              }
            },
            defaultValue: '[]'
          },
          {
            name: 'anotherFoo',
            kindString: 'Method',
            signatures: [
              {
                name: 'anotherFoo',
                kindString: 'Call signature',
                comment: {
                  shortText: 'This is the description for anotherFoo().',
                  tags: [
                    {
                      tag: 'deprecated',
                      text: 'Please use `createFoo` input on the [[FooComponent]] instead.'
                    }
                  ]
                },
                typeParameter: [
                  {
                    name: 'T',
                    kindString: 'Type parameter'
                  },
                  {
                    name: 'U',
                    kindString: 'Type parameter',
                    type: {
                      type: 'reference',
                      name: 'FooUser'
                    }
                  }
                ],
                parameters: [
                  {
                    name: 'component',
                    kindString: 'Parameter',
                    type: {
                      type: 'reference',
                      typeArguments: [
                        {
                          type: 'typeParameter',
                          name: 'T'
                        }
                      ],
                      name: 'Type'
                    }
                  },
                  {
                    name: 'user',
                    kindString: 'Parameter',
                    type: {
                      type: 'typeParameter',
                      name: 'U',
                      constraint: {
                        type: 'reference',
                        name: 'FooUser'
                      }
                    }
                  }
                ],
                type: {
                  type: 'intrinsic',
                  name: 'void'
                }
              }
            ]
          },
          {
            name: 'basic',
            kindString: 'Method',
            signatures: [
              {
                name: 'basic',
                kindString: 'Call signature',
                type: {
                  type: 'intrinsic',
                  name: 'void'
                }
              }
            ]
          }
        ]
      }
    ];

    const enumerations = [
      {
        anchorId: 'enumeration-foo',
        name: 'FooEnum',
        kindString: 'Enumeration',
        sources: [{
          fileName: '/modules/foobar/foo-enum.ts'
        }],
        children: [{
          name: 'Bar',
          kindString: 'Enumeration member',
          comment: {
            shortText: 'The bar of the foo.'
          },
          defaultValue: '0'
        }],
        comment: {
          shortText: 'This is the description for FooEnum.'
        }
      }
    ];

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
        ...components,
        ...directives,
        ...pipes,
        ...services,
        ...enumerations,
        ...interfaces
      ]
    };
  });

  it('should return type definitions from a specific source code path', () => {
    const service = new SkyDocsTypeDefinitionsService(definitionsProvider);
    const result = service.getTypeDefinitions('/src/app/public/modules/foobar/');

    expect(result).toEqual({
      components: [
        {
          anchorId: 'component-foo',
          codeExample: '<app-foo [baz]="true"></app-foo>',
          codeExampleLanguage: 'markup',
          description: 'This is the description for FooComponent.',
          name: 'FooComponent',
          properties: [
            {
              decorator: 'Input',
              defaultValue: undefined,
              deprecationWarning: 'This is no longer needed.',
              description: 'Description for userIds.',
              isOptional: false,
              name: 'userIds',
              type: 'number[]'
            },
            {
              decorator: 'Input',
              defaultValue: 'new FooUser()',
              deprecationWarning: undefined,
              description: 'Description for bar.',
              isOptional: true,
              name: 'bar',
              type: 'FooUser'
            },
            {
              decorator: 'Input',
              defaultValue: undefined,
              deprecationWarning: undefined,
              description: '',
              isOptional: true,
              name: 'basicAccessor',
              type: 'string'
            },
            {
              decorator: 'Input',
              defaultValue: undefined,
              deprecationWarning: undefined,
              description: '',
              isOptional: true,
              name: 'zed',
              type: 'string'
            },
            {
              decorator: 'Output',
              defaultValue: 'new EventEmitter<FooUser>()',
              deprecationWarning: undefined,
              description: '',
              isOptional: false,
              name: 'click',
              type: 'EventEmitter<FooUser>'
            }
          ],
          selector: 'app-foo'
        }
      ],
      directives: [
        {
          anchorId: 'directive-foo',
          codeExample: undefined,
          codeExampleLanguage: 'markup',
          description: 'This is the description for FooDirective.',
          name: 'FooDirective',
          properties: [
            {
              decorator: 'Input',
              defaultValue: undefined,
              deprecationWarning: undefined,
              description: '',
              isOptional: true,
              name: 'basic',
              type: 'string'
            }
          ],
          selector: 'appFoo'
        }
      ],
      enumerations: [
        {
          anchorId: 'enumeration-foo',
          description: 'This is the description for FooEnum.',
          members: [
            {
              description: 'The bar of the foo.',
              name: 'FooEnum.Bar'
            }
          ],
          name: 'FooEnum'
        }
      ],
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
      pipes: [
        {
          anchorId: undefined,
          codeExample: undefined,
          codeExampleLanguage: 'markup',
          description: '',
          inputValue: {
            description: 'The date to transform.',
            name: 'value',
            type: 'Date'
          },
          name: 'FooPipe',
          parameters: [
            {
              defaultValue: undefined,
              description: 'The date format to use.',
              isOptional: true,
              name: 'format',
              type: 'string'
            },
            {
              defaultValue: undefined,
              description: 'The desired locale.',
              isOptional: true,
              name: 'locale',
              type: 'string'
            }
          ]
        }
      ],
      services: [
        {
          anchorId: undefined,
          description: 'This is the description for FooService.',
          methods: [
            {
              codeExample: undefined,
              codeExampleLanguage: 'markup',
              deprecationWarning: 'Please use `createFoo` input on the [[FooComponent]] instead.',
              description: 'This is the description for anotherFoo().',
              name: 'anotherFoo',
              parameters: [
                {
                  defaultValue: undefined,
                  description: '',
                  isOptional: true,
                  name: 'component',
                  type: 'Type<T>'
                },
                {
                  defaultValue: undefined,
                  description: '',
                  isOptional: true,
                  name: 'user',
                  type: 'U'
                }
              ],
              returnType: 'void',
              typeParameters: [
                'T',
                'U extends FooUser'
              ]
            },
            {
              codeExample: undefined,
              codeExampleLanguage: 'markup',
              deprecationWarning: undefined,
              description: '',
              name: 'basic',
              parameters: [],
              returnType: 'void',
              typeParameters: []
            }
          ],
          name: 'FooService',
          properties: [
            {
              defaultValue: '[]',
              description: 'This is the description for FOOS.',
              name: 'FOOS',
              type: 'any[]'
            }
          ]
        }
      ],
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
