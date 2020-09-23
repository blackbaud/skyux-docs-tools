import {
  SkyDocsTypeDocAdapterService
} from './typedoc-adapter.service';

import {
  TypeDocEntry
} from './typedoc-types';

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
        name: 'FooClass'
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toClassDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooClass'
      });
    });

    it('should convert public properties and order them alphabetically', () => {
      entry.children = [
        {
          name: 'fooB',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'number'
          }
        },
        {
          name: 'fooA',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          }
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.properties).toEqual([
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic'
          }
        },
        {
          name: 'fooB',
          isOptional: true,
          type: {
            name: 'number',
            type: 'intrinsic'
          }
        }
      ]);
    });

    it('should handle union-type properties', () => {
      entry.children = [
        {
          name: 'fooUnion',
          kindString: 'Property',
          type: {
            type: 'union',
            types: [
              {
                type: 'reference',
                name: 'FooUser'
              },
              {
                type: 'intrinsic',
                name: 'string'
              }
            ]
          }
        }
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
                name: 'FooUser'
              },
              {
                name: 'string',
                type: 'intrinsic'
              }
            ]
          }
        }
      ]);
    });

    it('should convert public methods and order them alphabetically', () => {
      entry.children = [
        {
          name: 'getB',
          kindString: 'Method',
          signatures: [{
            kindString: 'Call signature',
            name: 'getB',
            type: {
              type: 'intrinsic',
              name: 'string'
            }
          }]
        },
        {
          name: 'getA',
          kindString: 'Method',
          signatures: [{
            kindString: 'Call signature',
            name: 'getA',
            type: {
              type: 'intrinsic',
              name: 'void'
            }
          }]
        }
      ];

      const def = adapter.toClassDefinition(entry);

      expect(def.methods).toEqual([
        {
          name: 'getA',
          type: {
            callSignature: {
              returnType: {
                name: 'void',
                type: 'intrinsic'
              }
            },
            name: 'getA'
          }
        },
        {
          name: 'getB',
          type: {
            callSignature: {
              returnType: {
                name: 'string',
                type: 'intrinsic'
              }
            },
            name: 'getB'
          }
        }
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
              name: 'Directive'
            },
            arguments: {
              obj: '{\n  selector: \'[foo]\'\n}'
            }
          }
        ]
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toDirectiveDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooDirective',
        selector: '[foo]'
      });
    });

    it('should get selector if wrapped in backticks', () => {
      entry.decorators[0].arguments.obj = '{\n  selector: `input[fooComplex],\n  textarea[fooComplex],\n  [required][fooComplex]`\n}';

      const def = adapter.toDirectiveDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooDirective',
        selector: 'input[fooComplex], textarea[fooComplex], [required][fooComplex]'
      });
    });

    it('should convert @Input and @Output properties but ignore all other properties', () => {
      entry.children = [
        {
          name: 'fooB',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'number'
          }
        },
        {
          name: 'fooC',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input'
              }
            }
          ]
        },
        {
          name: 'fooA',
          kindString: 'Property',
          type: {
            type: 'intrinsic',
            name: 'string'
          },
          decorators: [
            {
              name: 'Input',
              type: {
                type: 'reference',
                name: 'Input'
              }
            }
          ]
        },
        {
          name: 'fooD',
          kindString: 'Property',
          type: {
            type: 'reference',
            typeArguments: [
              {
                type: 'reference',
                name: 'FooUser'
              }
            ],
            name: 'EventEmitter'
          },
          defaultValue: 'new EventEmitter<FooUser>()',
          decorators: [
            {
              name: 'Output',
              type: {
                type: 'reference',
                name: 'Output'
              }
            }
          ]
        }
      ];

      const def = adapter.toDirectiveDefinition(entry);

      expect(def.inputProperties).toEqual([
        {
          name: 'fooA',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic'
          },
          decorator: {
            name: 'Input'
          }
        },
        {
          name: 'fooC',
          isOptional: true,
          type: {
            name: 'string',
            type: 'intrinsic'
          },
          decorator: {
            name: 'Input'
          }
        }
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
                name: 'FooUser',
                type: {
                  type: 'reference',
                  name: 'FooUser'
                }
              }
            ]
          },
          decorator: {
            name: 'Output'
          },
          defaultValue: 'new EventEmitter<FooUser>()'
        }
      ]);
    });
  });

  describe('Enumeration definitions', () => {

    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooEnum'
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toEnumerationDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooEnum',
        members: []
      });
    });

    it('should convert enumeration members', () => {
      entry.children = [
        {
          name: 'A'
        },
        {
          name: 'B'
        },
        {
          name: 'C'
        }
      ];

      const def = adapter.toEnumerationDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooEnum',
        members: [
          {
            name: 'A'
          },
          {
            name: 'B'
          },
          {
            name: 'C'
          }
        ]
      });
    });

  });

  describe('Interface definitions', () => {

    let entry: TypeDocEntry;

    beforeEach(() => {
      entry = {
        anchorId: 'foo-anchor-id',
        name: 'FooInterface'
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toInterfaceDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooInterface',
        properties: []
      });
    });

    it('should convert properties', () => {
      entry.children = [
        {
          name: 'user',
          kindString: 'Property',
          type: {
            type: 'reference',
            name: 'FooUser'
          }
        }
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'user',
          type: {
            type: 'reference',
            name: 'FooUser'
          }
        }
      ]);
    });

    it('should support type parameters', () => {
      entry.typeParameter = [
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
      ];

      entry.children = [
        {
          name: 'foo',
          kindString: 'Property',
          type: {
            type: 'typeParameter',
            name: 'T'
          }
        },
        {
          name: 'user',
          kindString: 'Property',
          type: {
            type: 'typeParameter',
            name: 'U',
            constraint: {
              name: 'FooUser'
            }
          }
        }
      ];

      const def = adapter.toInterfaceDefinition(entry);

      expect(def.typeParameters).toEqual([
        {
          name: 'T'
        },
        {
          name: 'U',
          type: {
            type: 'reference',
            name: 'FooUser'
          }
        }
      ]);

      expect(def.properties).toEqual([
        {
          isOptional: true,
          name: 'foo',
          type: {
            type: 'typeParameter',
            name: 'T'
          }
        },
        {
          isOptional: true,
          name: 'user',
          type: {
            type: 'typeParameter',
            name: 'U'
          }
        }
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
              name: 'Pipe'
            },
            arguments: {
              obj: '{\n  name: \'foo\'\n}'
            }
          }
        ],
        children: [
          {
            name: 'transform',
            kindString: 'Method',
            signatures: [
              {
                name: 'transform',
                kindString: 'Call signature',
                parameters: [
                  {
                    name: 'value',
                    kindString: 'Parameter',
                    type: {
                      type: 'reference',
                      name: 'Date'
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
        ]
      };
    });

    it('should convert with defaults', () => {
      const def = adapter.toPipeDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooPipe',
        transformMethod: {
          name: 'transform',
          type: {
            name: 'transform',
            callSignature: {
              parameters: [
                {
                  isOptional: false,
                  name: 'value',
                  type: {
                    type: 'reference',
                    name: 'Date'
                  }
                }
              ],
              returnType: {
                type: 'intrinsic',
                name: 'string'
              }
            }
          }
        }
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
              name: 'string'
            },
            {
              type: 'reference',
              name: 'FooDate'
            },
            {
              type: 'intrinsic',
              name: 'number'
            },
            {
              type: 'intrinsic',
              name: 'false'
            },
            {
              type: 'unknown',
              name: '1'
            },
            {
              type: 'stringLiteral',
              name: '\'left\''
            },
            {
              type: 'typeParameter',
              name: 'T',
              constraint: {
                name: 'FooUser'
              }
            },
            {
              type: 'reflection',
              declaration: {
                signatures: [
                  {
                    name: '__call',
                    kindString: 'Call signature',
                    type: {
                      type: 'intrinsic',
                      name: 'void'
                    }
                  }
                ]
              }
            }
          ]
        }
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
              name: 'string'
            },
            {
              type: 'reference',
              name: 'FooDate'
            },
            {
              type: 'intrinsic',
              name: 'number'
            },
            {
              type: 'intrinsic',
              name: 'false'
            },
            {
              type: 'unknown',
              name: '1'
            },
            {
              type: 'stringLiteral',
              name: '\'left\''
            },
            {
              type: 'typeParameter',
              name: 'T'
            },
            {
              type: 'reflection',
              callSignature: {
                returnType: {
                  type: 'intrinsic',
                  name: 'void'
                }
              }
            }
          ]
        }
      });
    });

    it('should convert index signature types', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          declaration: {
            indexSignature: [
              {
                name: '__index',
                kindString: 'Index signature',
                parameters: [
                  {
                    name: '_',
                    kindString: 'Parameter',
                    type: {
                      type: 'intrinsic',
                      name: 'string'
                    }
                  }
                ],
                type: {
                  type: 'reference',
                  name: 'FooUser'
                }
              }
            ]
          }
        }
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          indexSignature: {
            keyName: '_',
            type: {
              type: 'reference',
              name: 'FooUser'
            }
          }
        }
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
                kindString: 'Call signature',
                parameters: [
                  {
                    name: 'args',
                    kindString: 'Parameter',
                    type: {
                      type: 'reference',
                      name: 'FooUser'
                    }
                  },
                  {
                    name: 'addl',
                    kindString: 'Parameter',
                    type: {
                      type: 'typeParameter',
                      name: 'T'
                    }
                  },
                  {
                    name: 'data',
                    kindString: 'Parameter',
                    type: {
                      type: 'array',
                      elementType: {
                        type: 'intrinsic',
                        name: 'any'
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
          }
        }
      };

      const def = adapter.toTypeAliasDefinition(entry);

      expect(def).toEqual({
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        type: {
          type: 'reflection',
          callSignature: {
            returnType: {
              type: 'intrinsic',
              name: 'void'
            },
            parameters: [
              Object({ isOptional: false, name: 'args', type: Object({ type: 'reference', name: 'FooUser' }) }),
              Object({ isOptional: false, name: 'addl', type: Object({ type: 'typeParameter', name: 'T' }) }),
              Object({ isOptional: false, name: 'data', type: Object({ type: 'array', name: 'any' }) })
            ]
          }
        }
      });
    });

    it('should support type parameters', () => {
      const entry: TypeDocEntry = {
        anchorId: 'foo-anchor-id',
        name: 'FooTypeAlias',
        typeParameter: [
          {
            name: 'T',
            kindString: 'Type parameter'
          }
        ],
        type: {
          type: 'union',
          types: [
            {
              type: 'typeParameter',
              name: 'T',
              constraint: {
                name: 'FooUser'
              }
            }
          ]
        }
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
              name: 'T'
            }
          ]
        },
        typeParameters: [
          { name: 'T' }
        ]
      });
    });

  });

});
