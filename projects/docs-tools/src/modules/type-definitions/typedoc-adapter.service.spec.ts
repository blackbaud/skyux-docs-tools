import { SkyDocsTypeDocAdapterService } from './typedoc-adapter.service';
import { TypeDocEntry, TypeDocKind } from './typedoc-types';

describe('TypeDoc adapter', () => {
  let adapter: SkyDocsTypeDocAdapterService;

  beforeEach(() => {
    adapter = new SkyDocsTypeDocAdapterService();
  });

  describe('Class definitions', () => {
    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooClass',
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toClassDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooClass',
      });
    });

    it('should convert public properties and order them alphabetically', () => {
      entry.children = [
        {
          name: 'fooB',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'number',
          },
        },
        {
          name: 'fooA',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic',
          },
        },
        {
          name: 'fooB',
          isOptional: true,
          type: {
            name: 'number',
            type: 'intrinsic',
          },
        },
      ]);
    });

    it('should list required properties first', () => {
      entry.children = [
        {
          name: 'fooA',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'number',
          },
        },
        {
          name: 'fooZ',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
          comment: {
            blockTags: [
              {
                tag: '@required',
                content: [],
              },
            ],
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooZ',
          isOptional: false,
          type: {
            name: 'string',
            type: 'intrinsic',
          },
        },
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'number',
            type: 'intrinsic',
          },
        },
      ]);
    });

    it('should handle property accessors', () => {
      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Accessor,
          comment: {
            summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
            blockTags: [
              {
                tag: '@default',
                content: [{ kind: 'code', text: '```ts\n10\n```' }],
              },
            ],
          },
          getSignature: {
            name: '__get',
            comment: {
              summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
              blockTags: [
                {
                  tag: '@default',
                  content: [{ kind: 'code', text: '```ts\n10\n```' }],
                },
              ],
            },
            type: {
              type: 'intrinsic',
              name: 'number',
            },
          },
          setSignature: {
            name: '__set',
            comment: {
              summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
              blockTags: [
                {
                  tag: '@default',
                  content: [{ kind: 'code', text: '```ts\n10\n```' }],
                },
              ],
            },
            parameters: [
              {
                name: 'value',
                kind: TypeDocKind.Parameter,
                type: {
                  type: 'intrinsic',
                  name: 'number',
                },
              },
            ],
            type: {
              type: 'intrinsic',
              name: 'void',
            },
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number',
          },
          description: 'The foo of the FooClass.',
          defaultValue: '10',
        },
      ]);
    });

    it('should handle property accessors which only have comment info in their `getSignature` and `setSignature`', () => {
      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Accessor,
          getSignature: {
            name: '__get',
            comment: {
              summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
            },
            type: {
              type: 'intrinsic',
              name: 'number',
            },
          },
          setSignature: {
            name: '__set',
            comment: {
              summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
              blockTags: [
                {
                  tag: '@default',
                  content: [{ kind: 'code', text: '```ts\n10\n```' }],
                },
                {
                  tag: '@required',
                  content: [],
                },
                {
                  tag: '@deprecated',
                  content: [
                    { kind: 'text', text: 'This property is deprecated.\n' },
                  ],
                },
              ],
            },
            parameters: [
              {
                name: 'value',
                kind: TypeDocKind.Parameter,
                type: {
                  type: 'intrinsic',
                  name: 'number',
                },
              },
            ],
            type: {
              type: 'intrinsic',
              name: 'void',
            },
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number',
          },
          description: 'The foo of the FooClass.',
          defaultValue: '10',
          deprecationWarning: 'This property is deprecated.',
        },
      ]);
    });

    it('should handle `get` accessors which have no comment data - sanity check', () => {
      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Accessor,
          comment: {},
          getSignature: {
            name: '__get',
            comment: {},
            type: {
              type: 'intrinsic',
              name: 'number',
            },
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number',
          },
        },
      ]);
    });

    it('should handle `set` accessors which have no comment data - sanity check', () => {
      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Accessor,
          comment: {},
          setSignature: {
            name: '__set',
            comment: {},
            parameters: [
              {
                name: 'value',
                kind: TypeDocKind.Parameter,
                type: {
                  type: 'intrinsic',
                  name: 'number',
                },
              },
            ],
            type: {
              type: 'intrinsic',
              name: 'void',
            },
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number',
          },
        },
      ]);
    });

    it('should handle properties with only `get` accessors', () => {
      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Accessor,
          comment: {
            summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
            blockTags: [
              {
                tag: '@default',
                content: [{ kind: 'code', text: '```ts\n10\n```' }],
              },
            ],
          },
          getSignature: {
            name: '__get',
            comment: {
              summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
              blockTags: [
                {
                  tag: '@default',
                  content: [{ kind: 'code', text: '```ts\n10\n```' }],
                },
              ],
            },
            type: {
              type: 'intrinsic',
              name: 'number',
            },
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number',
          },
          description: 'The foo of the FooClass.',
          defaultValue: '10',
        },
      ]);
    });

    it('should handle properties with no comment short text and only a `get` accessor', () => {
      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Accessor,
          comment: {
            blockTags: [
              {
                tag: '@default',
                content: [{ kind: 'code', text: '```ts\n10\n```' }],
              },
            ],
          },
          getSignature: {
            name: '__get',
            comment: {
              summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
              blockTags: [
                {
                  tag: '@default',
                  content: [{ kind: 'code', text: '```ts\n10\n```' }],
                },
              ],
            },
            type: {
              type: 'intrinsic',
              name: 'number',
            },
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number',
          },
          description: 'The foo of the FooClass.',
          defaultValue: '10',
        },
      ]);
    });

    it('should handle properties with only `get` accessors', () => {
      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Accessor,
          comment: {
            summary: [{ kind: 'text', text: 'The foo of the FooClass.' }],
            blockTags: [
              {
                tag: '@default',
                content: [{ kind: 'code', text: '```ts\n10\n```' }],
              },
            ],
          },
          setSignature: {
            name: '__set',
            comment: {
              summary: [
                {
                  kind: 'text',
                  text: 'The foo of the FooClass.',
                },
              ],
              blockTags: [
                {
                  tag: '@default',
                  content: [{ kind: 'code', text: '```ts\n10\n```' }],
                },
              ],
            },
            type: {
              type: 'intrinsic',
              name: 'number',
            },
            parameters: [
              {
                name: 'value',
                kind: TypeDocKind.Parameter,
                type: {
                  type: 'intrinsic',
                  name: 'number',
                },
              },
            ],
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number',
          },
          description: 'The foo of the FooClass.',
          defaultValue: '10',
        },
      ]);
    });

    it('should handle properties with no comment short text and only a `set` accessor', () => {
      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Accessor,
          comment: {
            blockTags: [
              {
                tag: '@default',
                content: [
                  {
                    kind: 'text',
                    text: '10\n',
                  },
                ],
              },
            ],
          },
          setSignature: {
            name: '__set',
            comment: {
              summary: [
                {
                  kind: 'text',
                  text: 'The foo of the FooClass.',
                },
              ],
              blockTags: [
                {
                  tag: '@default',
                  content: [
                    {
                      kind: 'code',
                      text: '```ts\n10\n```',
                    },
                  ],
                },
              ],
            },
            type: {
              type: 'intrinsic',
              name: 'number',
            },
            parameters: [
              {
                name: 'value',
                kind: TypeDocKind.Parameter,
                type: {
                  type: 'intrinsic',
                  name: 'number',
                },
              },
            ],
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'intrinsic',
            name: 'number',
          },
          description: 'The foo of the FooClass.',
          defaultValue: '10',
        },
      ]);
    });

    it('should handle properties which are also constructor properties with comments listed there', () => {
      entry.children = [
        {
          name: 'constructor',
          kind: TypeDocKind.Constructor,
          signatures: [
            {
              name: 'new Class',
              kind: TypeDocKind.ConstructorSignature,
              parameters: [
                {
                  name: 'fooA',
                  kind: TypeDocKind.Parameter,
                  type: {
                    type: 'intrinsic',
                    name: 'string',
                  },
                  comment: {
                    summary: [
                      {
                        kind: 'text',
                        text: 'fooA description',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'fooB',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'number',
          },
        },
        {
          name: 'fooA',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooA',
          description: 'fooA description',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic',
          },
        },
        {
          name: 'fooB',
          isOptional: true,
          type: {
            name: 'number',
            type: 'intrinsic',
          },
        },
      ]);
    });

    it('should handle when properties are missing descriptions but the constructor has no parameters', () => {
      entry.children = [
        {
          name: 'constructor',
          kind: TypeDocKind.Constructor,
          signatures: [
            {
              name: 'new Class',
              kind: TypeDocKind.ConstructorSignature,
            },
          ],
        },
        {
          name: 'fooB',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'number',
          },
        },
        {
          name: 'fooA',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic',
          },
        },
        {
          name: 'fooB',
          isOptional: true,
          type: {
            name: 'number',
            type: 'intrinsic',
          },
        },
      ]);
    });

    it('should handle union-type properties', () => {
      entry.children = [
        {
          name: 'fooUnion',
          kind: TypeDocKind.Property,
          type: {
            type: 'union',
            types: [
              {
                type: 'reference',
                name: 'FooUser',
              },
              {
                type: 'intrinsic',
                name: 'string',
              },
              {
                type: 'literal',
                value: 'above',
              },
            ],
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooUnion',
          isOptional: true,
          type: {
            type: 'union',
            unionTypes: [
              {
                type: 'reference',
                name: 'FooUser',
              },
              {
                name: 'string',
                type: 'intrinsic',
              },
              {
                type: 'literal',
                name: 'above',
              },
            ],
          },
        },
      ]);
    });

    it('should convert call signature properties and their metadata', () => {
      entry.children = [
        {
          name: 'searchFunction',
          kind: TypeDocKind.Property,
          comment: {
            blockTags: [
              {
                tag: '@param',
                content: [
                  { kind: 'text', text: 'The keywords used to search.' },
                ],
                param: 'searchTerm',
              },
              {
                tag: '@param',
                content: [
                  {
                    kind: 'text',
                    text: 'The number of milliseconds to wait between each keypress.',
                  },
                ],
                param: 'debounceTime',
              },
              {
                tag: '@required',
                content: [],
              },
              {
                tag: '@deprecated',
                content: [
                  {
                    kind: 'text',
                    text: 'Search functions should not be used.\n',
                  },
                ],
              },
              {
                tag: '@example',
                content: [
                  {
                    kind: 'code',
                    text: '\n```markup\n[searchFunction]="mySearchFunction"\n```\n',
                  },
                ],
              },
            ],
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input',
              },
              arguments: {},
            },
          ],
          type: {
            type: 'reflection',
            declaration: {
              signatures: [
                {
                  name: '__call',
                  kind: TypeDocKind.CallSignature,
                  comment: {
                    summary: [
                      {
                        kind: 'text',
                        text: 'description of method',
                      },
                    ],
                  },
                  parameters: [
                    {
                      name: 'searchTerm',
                      kind: TypeDocKind.Parameter,
                      type: {
                        type: 'intrinsic',
                        name: 'string',
                      },
                    },
                    {
                      name: 'debounceTime',
                      kind: TypeDocKind.Parameter,
                      flags: {
                        isOptional: true,
                      },
                      type: {
                        type: 'intrinsic',
                        name: 'number',
                      },
                    },
                  ],
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'intrinsic',
                      name: 'any',
                    },
                  },
                },
              ],
            },
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          codeExample: '[searchFunction]="mySearchFunction"',
          codeExampleLanguage: 'markup',
          decorator: {
            name: 'Input',
          },
          description: 'description of method',
          deprecationWarning: 'Search functions should not be used.',
          name: 'searchFunction',
          type: {
            type: 'reflection',
            callSignature: {
              returnType: {
                type: 'array',
                name: 'any',
              },
              parameters: [
                {
                  isOptional: false,
                  name: 'searchTerm',
                  type: {
                    type: 'intrinsic',
                    name: 'string',
                  },
                  description: 'The keywords used to search.',
                },
                {
                  isOptional: true,
                  name: 'debounceTime',
                  type: {
                    type: 'intrinsic',
                    name: 'number',
                  },
                  description:
                    'The number of milliseconds to wait between each keypress.',
                },
              ],
            },
          },
        },
      ]);
    });

    it('should handle default values generated by TypeDoc 0.20.x', () => {
      entry.children = [
        {
          name: 'messageStream',
          kind: TypeDocKind.Property,
          flags: {},
          comment: {
            summary: [
              {
                kind: 'text',
                text: 'Comment here.',
              },
            ],
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input',
              },
              arguments: {},
            },
          ],
          sources: [
            {
              fileName: 'some.component.ts',
            },
          ],
          type: {
            type: 'reference',
            typeArguments: [
              {
                type: 'reference',
                name: 'MyClassReference',
              },
            ],
            name: 'Subject',
          },
          defaultValue: '...', // <-- TypeDoc sets this if the property requires an initializer.
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties as any).toEqual([
        {
          isOptional: true,
          name: 'messageStream',
          type: {
            type: 'reference',
            name: 'Subject',
            typeArguments: [
              {
                type: 'reference',
                name: 'MyClassReference',
              },
            ],
          },
          description: 'Comment here.',
          decorator: {
            name: 'Input',
          },
        },
      ]);
    });

    it('should convert index signature properties', () => {
      entry.children = [
        {
          name: 'anchorIds',
          kind: TypeDocKind.Property,
          type: {
            type: 'reflection',
            declaration: {
              indexSignature: {
                name: '__index',
                kind: TypeDocKind.IndexSignature,
                parameters: [
                  {
                    name: '_',
                    kind: TypeDocKind.Parameter,
                    type: {
                      type: 'intrinsic',
                      name: 'string',
                    },
                  },
                ],
                type: {
                  type: 'intrinsic',
                  name: 'string',
                },
              },
            },
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'anchorIds',
          type: {
            type: 'reflection',
            indexSignature: {
              key: {
                name: '_',
                type: {
                  type: 'intrinsic',
                  name: 'string',
                },
              },
              type: {
                type: 'intrinsic',
                name: 'string',
              },
            },
          },
        },
      ]);
    });

    it('should convert public methods and order them alphabetically', () => {
      entry.children = [
        {
          name: 'getB',
          kind: TypeDocKind.Method,
          signatures: [
            {
              kind: TypeDocKind.CallSignature,
              name: 'getB',
              type: {
                type: 'intrinsic',
                name: 'string',
              },
            },
          ],
        },
        {
          name: 'getA',
          kind: TypeDocKind.Method,
          flags: {
            isStatic: true,
          },
          signatures: [
            {
              kind: TypeDocKind.CallSignature,
              name: 'getA',
              type: {
                type: 'intrinsic',
                name: 'void',
              },
            },
          ],
        },
        {
          name: 'getC',
          kind: TypeDocKind.Method,
          flags: {
            isStatic: false,
          },
          signatures: [
            {
              kind: TypeDocKind.CallSignature,
              name: 'getC',
              type: {
                type: 'intrinsic',
                name: 'void',
              },
            },
          ],
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.methods).toEqual([
        {
          name: 'getA',
          isStatic: true,
          type: {
            callSignature: {
              returnType: {
                name: 'void',
                type: 'intrinsic',
              },
            },
            name: 'getA',
          },
          parentName: 'FooClass',
        },
        {
          name: 'getB',
          isStatic: false,
          type: {
            callSignature: {
              returnType: {
                name: 'string',
                type: 'intrinsic',
              },
            },
            name: 'getB',
          },
          parentName: 'FooClass',
        },
        {
          name: 'getC',
          isStatic: false,
          type: {
            callSignature: {
              returnType: {
                name: 'void',
                type: 'intrinsic',
              },
            },
            name: 'getC',
          },
          parentName: 'FooClass',
        },
      ]);
    });

    it('should handle type parameters on methods', () => {
      entry.children = [
        {
          name: 'getUser',
          kind: TypeDocKind.Method,
          signatures: [
            {
              name: 'getUser',
              kind: TypeDocKind.CallSignature,
              typeParameters: [
                {
                  name: 'T',
                  kind: TypeDocKind.TypeParameter,
                },
              ],
              type: {
                type: 'typeParameter',
                name: 'T',
              },
            },
          ],
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.methods).toEqual([
        {
          name: 'getUser',
          isStatic: false,
          type: {
            callSignature: {
              returnType: {
                name: 'T',
                type: 'typeParameter',
              },
            },
            name: 'getUser',
          },
          typeParameters: [
            {
              name: 'T',
            },
          ],
          parentName: 'FooClass',
        },
      ]);
    });

    it('should convert parameters on methods', () => {
      entry.children = [
        {
          name: 'getUserById',
          kind: TypeDocKind.Method,
          signatures: [
            {
              name: 'getUserById',
              kind: TypeDocKind.CallSignature,
              comment: {
                summary: [
                  {
                    kind: 'text',
                    text: 'Gets a user from the database.',
                  },
                ],
              },
              parameters: [
                {
                  name: 'id',
                  kind: TypeDocKind.Parameter,
                  comment: {
                    summary: [
                      {
                        kind: 'text',
                        text: 'The unique identifier.',
                      },
                    ],
                  },
                  type: {
                    type: 'reference',
                    name: 'FooUser',
                  },
                },
                {
                  name: 'user',
                  kind: TypeDocKind.Parameter,
                  type: {
                    type: 'reference',
                    typeArguments: [
                      {
                        type: 'typeParameter',
                        name: 'T',
                      },
                      {
                        type: 'typeParameter',
                        name: 'U',
                        constraint: {
                          name: 'FooUser',
                        },
                      },
                    ],
                    name: 'Foo',
                  },
                },
                {
                  name: 'locale',
                  kind: TypeDocKind.Parameter,
                  comment: {
                    summary: [
                      { kind: 'text', text: 'The locale of the user.\n' },
                    ],
                  },
                  type: {
                    type: 'intrinsic',
                    name: 'string',
                  },
                  defaultValue: '"en-US"',
                },
              ],
              type: {
                type: 'reference',
                name: 'FooUser',
              },
            },
          ],
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.methods).toEqual([
        {
          name: 'getUserById',
          description: 'Gets a user from the database.',
          isStatic: false,
          type: {
            callSignature: {
              returnType: {
                name: 'FooUser',
                type: 'reference',
              },
              parameters: [
                {
                  isOptional: false,
                  name: 'id',
                  type: {
                    type: 'reference',
                    name: 'FooUser',
                  },
                  description: 'The unique identifier.',
                },
                {
                  isOptional: false,
                  name: 'user',
                  type: {
                    type: 'reference',
                    name: 'Foo',
                    typeArguments: [
                      {
                        type: 'typeParameter',
                        name: 'T',
                      },
                      {
                        type: 'typeParameter',
                        name: 'U',
                      },
                    ],
                  },
                  typeArguments: [
                    {
                      type: 'typeParameter',
                      name: 'T',
                    },
                    {
                      type: 'typeParameter',
                      name: 'U',
                    },
                  ],
                },
                {
                  isOptional: true,
                  name: 'locale',
                  type: {
                    type: 'intrinsic',
                    name: 'string',
                  },
                  defaultValue: '"en-US"',
                  description: 'The locale of the user.',
                },
              ],
            },
            name: 'getUserById',
          },
          parentName: 'FooClass',
        },
      ]);
    });

    it('should convert code examples for properties', () => {
      entry.children = [
        {
          name: 'markupProperty',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'void',
          },
          comment: {
            blockTags: [
              {
                tag: '@example',
                content: [
                  {
                    kind: 'code',
                    text: '\n```markup\n[searchFunction]="mySearchFunction"\n```\n',
                  },
                ],
              },
            ],
          },
        },
        {
          name: 'typescriptProperty',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'void',
          },
          comment: {
            blockTags: [
              {
                tag: '@example',
                content: [
                  {
                    kind: 'code',
                    text: '\n```typescript\n[searchFunction]="mySearchFunction"\n```\n',
                  },
                ],
              },
            ],
          },
        },
        {
          name: 'defaultProperty',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'void',
          },
          comment: {
            blockTags: [
              {
                tag: '@example',
                content: [
                  {
                    kind: 'code',
                    text: '\n```\n[searchFunction]="mySearchFunction"\n```\n',
                  },
                ],
              },
            ],
          },
        },
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          codeExample: '[searchFunction]="mySearchFunction"',
          codeExampleLanguage: 'markup',
          name: 'defaultProperty',
          isOptional: true,
          type: {
            name: 'void',
            type: 'intrinsic',
          },
        },
        {
          codeExample: '[searchFunction]="mySearchFunction"',
          codeExampleLanguage: 'markup',
          name: 'markupProperty',
          isOptional: true,
          type: {
            name: 'void',
            type: 'intrinsic',
          },
        },
        {
          codeExample: '[searchFunction]="mySearchFunction"',
          codeExampleLanguage: 'typescript',
          name: 'typescriptProperty',
          isOptional: true,
          type: {
            name: 'void',
            type: 'intrinsic',
          },
        },
      ]);
    });
  });

  describe('Directive definitions', () => {
    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooDirective',
        decorators: [
          {
            name: 'Directive',
            type: {
              type: 'reference',
              name: 'Directive',
            },
            arguments: {
              obj: "{\n  selector: '[foo]'\n}",
            },
          },
        ],
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toDirectiveDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooDirective',
        selector: '[foo]',
      });
    });

    it('should get selector if wrapped in backticks', () => {
      entry.decorators[0].arguments.obj =
        '{\n  selector: `input[fooComplex],\n  textarea[fooComplex],\n  [required][fooComplex]`\n}';

      const def = adapter.toDirectiveDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooDirective',
        selector:
          'input[fooComplex], textarea[fooComplex], [required][fooComplex]',
      });
    });

    it('should convert @Input and @Output properties but ignore all other properties', () => {
      entry.children = [
        {
          name: 'fooB',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'number',
          },
        },
        {
          name: 'fooC',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input',
              },
            },
          ],
        },
        {
          name: 'fooA',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input',
              },
            },
          ],
        },
        {
          name: 'fooD',
          kind: TypeDocKind.Property,
          type: {
            type: 'reference',
            typeArguments: [
              {
                type: 'array',
                elementType: {
                  type: 'reference',
                  name: 'FooUser',
                },
              },
            ],
            name: 'EventEmitter',
          },
          defaultValue: 'new EventEmitter<FooUser[]>()',
          decorators: [
            {
              name: 'Output',
              type: {
                type: 'reference',
                name: 'Output',
              },
            },
          ],
        },
        {
          name: 'stream',
          kind: TypeDocKind.Property,
          decorators: [
            {
              name: 'Output',
              type: {
                type: 'reference',
                name: 'Output',
              },
              arguments: {},
            },
          ],
          type: {
            type: 'reference',
            typeArguments: [
              {
                type: 'union',
                types: [
                  {
                    type: 'array',
                    elementType: {
                      type: 'intrinsic',
                      name: 'string',
                    },
                  },
                  {
                    type: 'reference',
                    typeArguments: [
                      {
                        type: 'array',
                        elementType: {
                          type: 'intrinsic',
                          name: 'string',
                        },
                      },
                    ],
                    name: 'Observable',
                  },
                ],
              },
            ],
            name: 'EventEmitter',
          },
          defaultValue:
            'new EventEmitter<Array<string> | Observable<Array<string>>>()',
        },
      ];

      const def = adapter.toDirectiveDefinition(entry);

      expect(def.inputProperties).toEqual([
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic',
          },
          decorator: {
            name: 'Input',
          },
        },
        {
          name: 'fooC',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic',
          },
          decorator: {
            name: 'Input',
          },
        },
      ]);

      expect(def.eventProperties).toEqual([
        {
          name: 'fooD',
          isOptional: true,
          type: {
            type: 'reference',
            name: 'EventEmitter',
            typeArguments: [
              {
                type: 'array',
                name: 'FooUser',
              },
            ],
          },
          decorator: {
            name: 'Output',
          },
          defaultValue: 'new EventEmitter<FooUser[]>()',
        },
        {
          isOptional: true,
          name: 'stream',
          type: {
            type: 'reference',
            name: 'EventEmitter',
            typeArguments: [
              {
                type: 'union',
                unionTypes: [
                  {
                    type: 'array',
                    name: 'string',
                  },
                  {
                    type: 'reference',
                    name: 'Observable',
                    typeArguments: [
                      {
                        type: 'array',
                        name: 'string',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          decorator: {
            name: 'Output',
          },
          defaultValue:
            'new EventEmitter<Array<string> | Observable<Array<string>>>()',
        },
      ]);
    });

    it("should use an Input's binding property name", () => {
      entry.children = [
        {
          name: 'originalPropertyName',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input',
              },
              arguments: {
                bindingPropertyName: 'boundName',
              },
            },
          ],
        },
      ];

      const def = adapter.toDirectiveDefinition(entry);

      expect(def.inputProperties).toEqual([
        {
          name: 'boundName',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic',
          },
          decorator: {
            name: 'Input',
          },
        },
      ]);
    });
  });

  describe('Enumeration definitions', () => {
    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooEnum',
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toEnumerationDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooEnum',
        members: [],
      });
    });

    it('should convert enumeration members', () => {
      entry.children = [
        {
          name: 'A',
        },
        {
          name: 'B',
        },
        {
          name: 'C',
        },
      ];

      const def = adapter.toEnumerationDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooEnum',
        members: [
          {
            name: 'A',
          },
          {
            name: 'B',
          },
          {
            name: 'C',
          },
        ],
      });
    });
  });

  describe('Interface definitions', () => {
    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooInterface',
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toInterfaceDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooInterface',
        properties: [],
      });
    });

    it('should convert properties', () => {
      entry.children = [
        {
          name: 'fooB',
          kind: TypeDocKind.Property,
          flags: {
            isOptional: true,
          },
          type: {
            type: 'reference',
            name: 'FooUser',
          },
        },
        {
          name: 'fooA',
          kind: TypeDocKind.Property,
          flags: {
            isOptional: true,
          },
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
        {
          name: 'fooZ',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
        {
          name: 'fooC',
          kind: TypeDocKind.Property,
          type: {
            type: 'intrinsic',
            name: 'string',
          },
          comment: {
            blockTags: [
              {
                tag: '@required',
                content: [],
              },
            ],
          },
        },
        {
          name: 'bar',
          kind: TypeDocKind.Method,
          signatures: [
            {
              name: 'bar',
              comment: {
                summary: [
                  {
                    kind: 'text',
                    text: 'method ',
                  },
                  {
                    kind: 'text',
                    text: 'description',
                  },
                ],
              },
              type: {
                type: 'intrinsic',
                name: 'void',
              },
            },
          ],
        },
        {
          name: 'moo',
          kind: TypeDocKind.Property,
          type: {
            type: 'reflection',
            declaration: {
              signatures: [
                {
                  name: 'moo',
                  comment: {
                    summary: [
                      {
                        kind: 'text',
                        text: 'method ',
                      },
                      {
                        kind: 'text',
                        text: 'description',
                      },
                    ],
                  },
                  type: {
                    type: 'intrinsic',
                    name: 'void',
                  },
                },
              ],
            },
          },
        },
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          name: 'bar',
          description: 'method description',
          type: {
            callSignature: {
              returnType: {
                type: 'intrinsic',
                name: 'void',
              },
            },
            name: 'bar',
          },
        },
        {
          isOptional: false,
          name: 'fooC',
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
        {
          isOptional: false,
          name: 'fooZ',
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
        {
          isOptional: false,
          name: 'moo',
          description: 'method description',
          type: {
            type: 'reflection',
            callSignature: {
              returnType: {
                type: 'intrinsic',
                name: 'void',
              },
            },
          },
        },
        {
          isOptional: true,
          name: 'fooA',
          type: {
            type: 'intrinsic',
            name: 'string',
          },
        },
        {
          isOptional: true,
          name: 'fooB',
          type: {
            type: 'reference',
            name: 'FooUser',
          },
        },
      ]);
    });

    it('should support type parameters', () => {
      entry.typeParameters = [
        {
          name: 'T',
          kind: TypeDocKind.TypeParameter,
        },
        {
          name: 'U',
          kind: TypeDocKind.TypeParameter,
          type: {
            type: 'reference',
            name: 'FooUser',
          },
        },
      ];

      entry.children = [
        {
          name: 'foo',
          kind: TypeDocKind.Property,
          type: {
            type: 'typeParameter',
            name: 'T',
          },
        },
        {
          name: 'user',
          kind: TypeDocKind.Property,
          type: {
            type: 'typeParameter',
            name: 'U',
            constraint: {
              name: 'FooUser',
            },
          },
        },
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.typeParameters).toEqual([
        {
          name: 'T',
        },
        {
          name: 'U',
          type: {
            type: 'reference',
            name: 'FooUser',
          },
        },
      ]);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          name: 'foo',
          type: {
            type: 'typeParameter',
            name: 'T',
          },
        },
        {
          isOptional: false,
          name: 'user',
          type: {
            type: 'typeParameter',
            name: 'U',
          },
        },
      ]);
    });

    it('should support index signature properties', () => {
      entry.indexSignature = {
        name: '__index',
        kind: TypeDocKind.IndexSignature,
        parameters: [
          {
            name: '_',
            kind: TypeDocKind.Parameter,
            type: {
              type: 'intrinsic',
              name: 'string',
            },
          },
        ],
        type: {
          type: 'intrinsic',
          name: 'any',
        },
      };

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: '__index',
          description: 'All other properties for an item.',
          type: {
            indexSignature: {
              key: {
                name: '_',
                type: {
                  type: 'intrinsic',
                  name: 'string',
                },
              },
              type: {
                type: 'intrinsic',
                name: 'any',
              },
            },
          },
        },
      ]);
    });

    it('should support index signature properties', () => {
      entry.indexSignature = {
        name: '__index',
        kind: TypeDocKind.IndexSignature,
        comment: {
          summary: [
            {
              kind: 'text',
              text: 'Test description.',
            },
          ],
        },
        parameters: [
          {
            name: '_',
            kind: TypeDocKind.Parameter,
            type: {
              type: 'intrinsic',
              name: 'string',
            },
          },
        ],
        type: {
          type: 'intrinsic',
          name: 'any',
        },
      };

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: '__index',
          description: 'Test description.',
          type: {
            indexSignature: {
              key: {
                name: '_',
                type: {
                  type: 'intrinsic',
                  name: 'string',
                },
              },
              type: {
                type: 'intrinsic',
                name: 'any',
              },
            },
          },
        },
      ]);
    });

    it('should support type literal properties', () => {
      entry.children = [
        {
          name: 'route',
          kind: TypeDocKind.Property,
          type: {
            type: 'reflection',
            declaration: {
              children: [
                {
                  name: 'commands',
                  flags: {
                    isOptional: true,
                  },
                  type: {
                    type: 'array',
                    elementType: {
                      type: 'intrinsic',
                      name: 'any',
                    },
                  },
                },
              ],
            },
          },
        },
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: false,
          name: 'route',
          type: {
            type: 'reflection',
            typeLiteral: {
              properties: [
                {
                  isOptional: true,
                  name: 'commands',
                  type: {
                    type: 'array',
                    name: 'any',
                  },
                },
              ],
            },
          },
        },
      ]);
    });
  });

  describe('Pipe definitions', () => {
    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooPipe',
        decorators: [
          {
            name: 'Pipe',
            type: {
              type: 'reference',
              name: 'Pipe',
            },
            arguments: {
              obj: "{\n  name: 'foo'\n}",
            },
          },
        ],
        children: [
          {
            name: 'transform',
            kind: TypeDocKind.Method,
            signatures: [
              {
                name: 'transform',
                kind: TypeDocKind.CallSignature,
                parameters: [
                  {
                    name: 'value',
                    kind: TypeDocKind.Parameter,
                    type: {
                      type: 'reference',
                      name: 'Date',
                    },
                  },
                ],
                type: {
                  type: 'intrinsic',
                  name: 'string',
                },
              },
            ],
          },
        ],
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toPipeDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooPipe',
        transformMethod: {
          name: 'transform',
          isStatic: false,
          type: {
            name: 'transform',
            callSignature: {
              parameters: [
                {
                  isOptional: false,
                  name: 'value',
                  type: {
                    type: 'reference',
                    name: 'Date',
                  },
                },
              ],
              returnType: {
                type: 'intrinsic',
                name: 'string',
              },
            },
          },
          parentName: 'FooPipe',
        },
      });
    });
  });

  describe('Type alias definitions', () => {
    it('should convert union types', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'union',
          types: [
            {
              type: 'intrinsic',
              name: 'string',
            },
            {
              type: 'reference',
              name: 'FooDate',
            },
            {
              type: 'intrinsic',
              name: 'number',
            },
            {
              type: 'intrinsic',
              name: 'false',
            },
            {
              type: 'unknown',
              name: '1',
            },
            {
              type: 'literal',
              name: 'left',
            },
            {
              type: 'typeParameter',
              name: 'T',
              constraint: {
                name: 'FooUser',
              },
            },
            {
              type: 'reflection',
              declaration: {
                signatures: [
                  {
                    name: '__call',
                    kind: TypeDocKind.CallSignature,
                    type: {
                      type: 'intrinsic',
                      name: 'void',
                    },
                  },
                ],
              },
            },
            {
              type: 'typeOperator',
              operator: 'keyof',
              target: {
                name: 'FooUser',
              },
            },
          ],
        },
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'union',
          unionTypes: [
            {
              type: 'intrinsic',
              name: 'string',
            },
            {
              type: 'reference',
              name: 'FooDate',
            },
            {
              type: 'intrinsic',
              name: 'number',
            },
            {
              type: 'intrinsic',
              name: 'false',
            },
            {
              type: 'unknown',
              name: '1',
            },
            {
              type: 'literal',
              name: 'left',
            },
            {
              type: 'typeParameter',
              name: 'T',
            },
            {
              type: 'reflection',
              callSignature: {
                returnType: {
                  type: 'intrinsic',
                  name: 'void',
                },
              },
            },
            {
              type: 'typeOperator',
              name: 'keyof FooUser',
            },
          ],
        },
      });
    });

    it('should convert index signature types', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          declaration: {
            indexSignature: {
              name: '__index',
              kind: TypeDocKind.IndexSignature,
              parameters: [
                {
                  name: '_',
                  kind: TypeDocKind.Parameter,
                  type: {
                    type: 'intrinsic',
                    name: 'string',
                  },
                },
              ],
              type: {
                type: 'reference',
                name: 'FooUser',
              },
            },
          },
        },
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          indexSignature: {
            key: {
              name: '_',
              type: {
                type: 'intrinsic',
                name: 'string',
              },
            },
            type: {
              type: 'reference',
              name: 'FooUser',
            },
          },
        },
      });
    });

    it('should convert call signature types', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          declaration: {
            signatures: [
              {
                name: '__call',
                kind: TypeDocKind.CallSignature,
                comment: {
                  summary: [
                    {
                      kind: 'text',
                      text: 'test ',
                    },
                    {
                      kind: 'text',
                      text: 'description',
                    },
                  ],
                },
                parameters: [
                  {
                    name: 'args',
                    kind: TypeDocKind.Parameter,
                    type: {
                      type: 'reference',
                      name: 'FooUser',
                    },
                  },
                  {
                    name: 'addl',
                    kind: TypeDocKind.Parameter,
                    type: {
                      type: 'typeParameter',
                      name: 'T',
                    },
                  },
                  {
                    name: 'data',
                    kind: TypeDocKind.Parameter,
                    type: {
                      type: 'array',
                      elementType: {
                        type: 'intrinsic',
                        name: 'any',
                      },
                    },
                  },
                ],
                type: {
                  type: 'intrinsic',
                  name: 'void',
                },
              },
            ],
          },
        },
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        description: 'test description',
        type: {
          type: 'reflection',
          callSignature: {
            returnType: {
              type: 'intrinsic',
              name: 'void',
            },
            parameters: [
              {
                isOptional: false,
                name: 'args',
                type: {
                  type: 'reference',
                  name: 'FooUser',
                },
              },
              {
                isOptional: false,
                name: 'addl',
                type: {
                  type: 'typeParameter',
                  name: 'T',
                },
              },
              {
                isOptional: false,
                name: 'data',
                type: {
                  type: 'array',
                  name: 'any',
                },
              },
            ],
          },
        },
      });
    });

    it('should convert call signature types', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        comment: {
          summary: [
            {
              kind: 'text',
              text: 'test ',
            },
            {
              kind: 'text',
              text: 'description',
            },
          ],
        },
        type: {
          type: 'array',
          elementType: {
            type: 'reflection',
            declaration: {
              signatures: [
                {
                  name: '__call',
                  kind: TypeDocKind.CallSignature,
                  parameters: [
                    {
                      name: 'args',
                      kind: TypeDocKind.Parameter,
                      type: {
                        type: 'reference',
                        name: 'FooUser',
                      },
                    },
                    {
                      name: 'addl',
                      kind: TypeDocKind.Parameter,
                      type: {
                        type: 'typeParameter',
                        name: 'T',
                      },
                    },
                    {
                      name: 'data',
                      kind: TypeDocKind.Parameter,
                      type: {
                        type: 'array',
                        elementType: {
                          type: 'intrinsic',
                          name: 'any',
                        },
                      },
                    },
                  ],
                  type: {
                    type: 'intrinsic',
                    name: 'void',
                  },
                },
              ],
            },
          },
        },
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        description: 'test description',
        type: {
          type: 'array',
          callSignature: {
            returnType: {
              type: 'intrinsic',
              name: 'void',
            },
            parameters: [
              {
                isOptional: false,
                name: 'args',
                type: {
                  type: 'reference',
                  name: 'FooUser',
                },
              },
              {
                isOptional: false,
                name: 'addl',
                type: {
                  type: 'typeParameter',
                  name: 'T',
                },
              },
              {
                isOptional: false,
                name: 'data',
                type: {
                  type: 'array',
                  name: 'any',
                },
              },
            ],
          },
        },
      });
    });

    it('should support type parameters', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        typeParameters: [
          {
            name: 'T',
            kind: TypeDocKind.TypeParameter,
          },
        ],
        type: {
          type: 'union',
          types: [
            {
              type: 'typeParameter',
              name: 'T',
              constraint: {
                name: 'FooUser',
              },
            },
          ],
        },
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'union',
          unionTypes: [
            {
              type: 'typeParameter',
              name: 'T',
            },
          ],
        },
        typeParameters: [
          {
            name: 'T',
          },
        ],
      });
    });
  });

  it('should use SkyDocsTypeDefinitionsProvider.anchorIds if anchorId not set on entry', () => {
    adapter = new SkyDocsTypeDocAdapterService({
      anchorIds: {
        SkyFoobar: 'class-skyfoobar',
      },
      typeDefinitions: [],
    });

    const def = adapter.toClassDefinition({
      name: 'SkyFoobar',
    });

    expect(def).toEqual({
      anchorId: 'class-skyfoobar',
      name: 'SkyFoobar',
    });
  });

  it('should fall back to an empty anchorId if not set on entry or provider - sanity check', () => {
    adapter = new SkyDocsTypeDocAdapterService({
      anchorIds: {},
      typeDefinitions: [],
    });

    const def = adapter.toClassDefinition({
      name: 'SkyFoobar',
    });

    expect(def).toEqual({
      anchorId: '',
      name: 'SkyFoobar',
    });
  });

  it('should fall back to an empty anchorId if not set on entry or an no provider is present - sanity check', () => {
    adapter = new SkyDocsTypeDocAdapterService();

    const def = adapter.toClassDefinition({
      name: 'SkyFoobar',
    });

    expect(def).toEqual({
      anchorId: '',
      name: 'SkyFoobar',
    });
  });
});
