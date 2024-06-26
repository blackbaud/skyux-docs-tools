import { expect } from '@skyux-sdk/testing';

import { SkyDocsEnumerationMemberDefinition } from './enumeration-member-definition';

import { SkyDocsInterfaceDefinition } from './interface-definition';

import { SkyDocsClassMethodDefinition } from './method-definition';

import { SkyDocsParameterDefinition } from './parameter-definition';

import { SkyDocsClassPropertyDefinition } from './property-definition';

import { SkyDocsTypeAliasDefinition } from './type-alias-definition';

import { SkyDocsTypeDefinition } from './type-definition';

import { SkyDocsTypeDefinitionsFormatService } from './type-definitions-format.service';

describe('Type definitions format service', () => {
  let service: SkyDocsTypeDefinitionsFormatService;

  beforeEach(() => {
    service = new SkyDocsTypeDefinitionsFormatService();
  });

  it('should generate method source code', () => {
    const def: SkyDocsClassMethodDefinition = {
      name: 'fooBar',
      isPreview: false,
      type: {
        callSignature: {
          returnType: {
            type: 'intrinsic',
            name: 'void',
          },
        },
      },
    };

    const sourceCode = service.getMethodSourceCode(def);
    expect(sourceCode).toEqual('public fooBar(): void');
  });

  it('should generate method source code for a static method', () => {
    const def: SkyDocsClassMethodDefinition = {
      name: 'fooBar',
      isStatic: true,
      isPreview: false,
      type: {
        callSignature: {
          returnType: {
            type: 'intrinsic',
            name: 'void',
          },
        },
      },
    };

    const sourceCode = service.getMethodSourceCode(def);
    expect(sourceCode).toEqual('public static fooBar(): void');
  });

  it('should generate method source code with parameters', () => {
    const def: SkyDocsClassMethodDefinition = {
      name: 'fooBar',
      isPreview: false,
      type: {
        callSignature: {
          parameters: [
            {
              name: 'foo',
              isOptional: false,
              type: {
                type: 'intrinsic',
                name: 'string',
              },
            },
            {
              name: 'args',
              isOptional: true,
              type: {
                type: 'reference',
                name: 'Options',
              },
            },
          ],
          returnType: {
            type: 'intrinsic',
            name: 'FooUser',
          },
        },
      },
    };

    const sourceCode = service.getMethodSourceCode(def);
    expect(sourceCode).toEqual(
      'public fooBar(foo: string, args?: Options): FooUser',
    );
  });

  it('should generate method source code with type parameters', () => {
    const def: SkyDocsClassMethodDefinition = {
      name: 'getUserById',
      description: 'Gets a user from the database.',
      isPreview: false,
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
    };

    const sourceCode = service.getMethodSourceCode(def);
    expect(sourceCode).toEqual(
      'public getUserById(id: FooUser, user: Foo<T, U>, locale?: string): FooUser',
    );
  });

  it('should generate interface source code', () => {
    const def: SkyDocsInterfaceDefinition = {
      anchorId: 'foo-anchor-id',
      name: 'Foo',
      hasPreviewFeatures: false,
      properties: [
        {
          isOptional: true,
          isPreview: false,
          name: 'foo',
          type: {
            type: 'typeParameter',
            name: 'T',
          },
        },
        {
          isOptional: true,
          isPreview: false,
          name: 'user',
          type: {
            type: 'typeParameter',
            name: 'U',
          },
        },
        {
          isOptional: false,
          isPreview: false,
          name: 'route',
          type: {
            type: 'reflection',
            typeLiteral: {
              properties: [
                {
                  isOptional: true,
                  isPreview: false,
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
        {
          isOptional: true,
          isPreview: false,
          name: '__index',
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
      ],
      typeParameters: [
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
      ],
    };

    const sourceCode = service.getInterfaceSourceCode(def);
    expect(sourceCode).toEqual(`interface Foo<T, U extends FooUser> {
  foo?: T;
  user?: U;
  route: { commands?: any[]; };
  [_: string]: any;
}`);
  });

  it('should generate union type alias source code', () => {
    const def: SkyDocsTypeAliasDefinition = {
      anchorId: 'foo-anchor-id',
      name: 'FooTypeAlias',
      isPreview: false,
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
        ],
      },
    };

    const sourceCode = service.getTypeAliasSourceCode(def);
    expect(sourceCode).toEqual(
      "type FooTypeAlias = string | FooDate | number | false | 1 | 'left' | T | () => void",
    );
  });

  it('should generate index signature type alias source code', () => {
    const def: SkyDocsTypeAliasDefinition = {
      anchorId: 'foo-anchor-id',
      name: 'FooTypeAlias',
      isPreview: false,
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
    };

    const sourceCode = service.getTypeAliasSourceCode(def);
    expect(sourceCode).toEqual(`type FooTypeAlias = {
  [_: string]: FooUser;
}`);
  });

  it('should generate call signature type alias source code', () => {
    const def: SkyDocsTypeAliasDefinition = {
      anchorId: 'foo-anchor-id',
      name: 'FooTypeAlias',
      isPreview: false,
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
              isOptional: true,
              name: 'data',
              type: {
                type: 'array',
                name: 'any',
              },
              defaultValue: '[]',
            },
          ],
        },
      },
    };

    const sourceCode = service.getTypeAliasSourceCode(def);
    expect(sourceCode).toEqual(
      'type FooTypeAlias = (args: FooUser, addl: T, data?: any[]) => void',
    );
  });

  it('should generate HTML formatted property names', () => {
    const def: SkyDocsClassPropertyDefinition = {
      name: 'foo',
      isOptional: true,
      isPreview: false,
      type: {
        type: 'reference',
        name: 'FooUser',
      },
      deprecationWarning: 'This is a deprecation warning.',
    };

    const formattedName = service.getFormattedPropertyName(def);
    expect(formattedName).toEqual('<strike>foo</strike>?: FooUser');
  });

  it('should generate HTML formatted property names without types', () => {
    const def: SkyDocsEnumerationMemberDefinition = {
      name: 'Foo',
      isPreview: false,
    };

    const formattedName = service.getFormattedPropertyName(
      def as SkyDocsClassPropertyDefinition,
    );
    expect(formattedName).toEqual('Foo');
  });

  it('should generate HTML formatted property names w/ call signature', () => {
    const def: SkyDocsClassPropertyDefinition = {
      isOptional: false,
      isPreview: false,
      name: 'functions',
      type: {
        type: 'intrinsic',
        callSignature: {
          returnType: {
            type: 'intrinsic',
            name: 'boolean',
          },
          parameters: [
            {
              name: 'data',
              type: {
                type: 'intrinsic',
                name: 'string',
              },
              isOptional: false,
            },
          ],
        },
      },
    };

    const formattedName = service.getFormattedPropertyName(def);
    expect(formattedName).toEqual('functions: (data: string) => boolean');
  });

  it('should generate HTML formatted property names w/ call signature', () => {
    const def: SkyDocsClassPropertyDefinition = {
      isOptional: false,
      isPreview: false,
      name: 'functions',
      type: {
        type: 'array',
        callSignature: {
          returnType: {
            type: 'intrinsic',
            name: 'boolean',
          },
          parameters: [
            {
              name: 'data',
              type: {
                type: 'intrinsic',
                name: 'string',
              },
              isOptional: false,
            },
          ],
        },
      },
    };

    const formattedName = service.getFormattedPropertyName(def);
    expect(formattedName).toEqual('functions: ((data: string) => boolean)[]');
  });

  it('should generate HTML formatted property names w/ union type parameters', () => {
    const def: SkyDocsClassPropertyDefinition = {
      isOptional: true,
      isPreview: false,
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
    };

    const formattedName = service.getFormattedPropertyName(def);
    expect(formattedName).toEqual(
      'stream: EventEmitter&lt;string[] | Observable&lt;string[]&gt;&gt;',
    );
  });

  it('should generate HTML formatted index signature property names', () => {
    const def: SkyDocsClassPropertyDefinition = {
      isOptional: true,
      isPreview: false,
      name: '__index',
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
            type: 'reference',
            name: 'FooUser',
          },
        },
      },
    };

    const formattedName = service.getFormattedPropertyName(def);
    expect(formattedName).toEqual('[_: string]: FooUser');
  });

  it('should generate HTML formatted input names', () => {
    const def: SkyDocsClassPropertyDefinition = {
      name: 'options',
      isOptional: false,
      isPreview: false,
      type: {
        type: 'reference',
        name: 'Options',
      },
      decorator: {
        name: 'Input',
      },
    };

    const formattedName = service.getFormattedPropertyName(def);
    expect(formattedName).toEqual('options: Options');
  });

  it('should handle input signals', () => {
    const def: SkyDocsClassPropertyDefinition = {
      name: 'size',
      isOptional: false,
      isPreview: false,
      type: {
        type: 'reference',
        typeArguments: [
          {
            type: 'intrinsic',
            name: 'number',
          },
        ],
        name: 'InputSignal',
        package: '@angular/core',
      },
    };

    const formattedName = service.getFormattedPropertyName(def);
    expect(formattedName).toEqual('size: number');
  });

  it('should generate HTML formatted output names', () => {
    const def: SkyDocsClassPropertyDefinition = {
      name: 'click',
      isOptional: true,
      isPreview: false,
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
    };

    const formattedName = service.getFormattedPropertyName(def);
    expect(formattedName).toEqual('click: EventEmitter&lt;FooUser[]&gt;');
  });

  it('should generate HTML formatted method names', () => {
    const def: SkyDocsClassMethodDefinition = {
      name: 'getUserById',
      description: 'Gets a user from the database.',
      isPreview: false,
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
            },
          ],
        },
        name: 'getUserById',
      },
    };

    const formattedName = service.getFormattedMethodName(def);
    expect(formattedName).toEqual('getUserById()');
  });

  it('should generate HTML formatted deprecated method names', () => {
    const def: SkyDocsClassMethodDefinition = {
      name: 'getUserById',
      deprecationWarning: '',
      isPreview: false,
      type: {
        callSignature: {
          returnType: {
            name: 'FooUser',
            type: 'reference',
          },
        },
        name: 'getUserById',
      },
    };

    const formattedName = service.getFormattedMethodName(def);
    expect(formattedName).toEqual('<strike>getUserById</strike>()');
  });

  it('should generate HTML formatted parameter names', () => {
    const def: SkyDocsParameterDefinition = {
      name: 'args',
      isOptional: true,
      type: {
        unionTypes: [
          {
            type: 'literal',
            name: 'left',
          },
          {
            type: 'literal',
            name: 'right',
          },
          {
            type: 'literal',
            name: 0,
          },
        ],
      },
    };

    const formattedName = service.getFormattedParameterName(def);
    expect(formattedName).toEqual("args?: 'left' | 'right' | 0");
  });

  it('should allow unescaped HTML formatted types', () => {
    const def: SkyDocsTypeDefinition = {
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
    };

    const formatted = service.getFormattedType(def, {
      escapeSpecialCharacters: false,
    });

    expect(formatted).toEqual('EventEmitter<string[] | Observable<string[]>>');
  });
});
