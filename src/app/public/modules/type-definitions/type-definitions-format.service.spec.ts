import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsInterfaceDefinition
} from './interface-definition';

import {
  SkyDocsMethodDefinition
} from './method-definition';

import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Type definitions format service', () => {

  let definitionsProvider: SkyDocsTypeDefinitionsProvider;
  let anchorLinkService: SkyDocsAnchorLinkService;

  beforeEach(() => {
    definitionsProvider = {
      anchorIds: {
        'FooUser': 'foo-user'
      },
      typeDefinitions: [
        {
          name: 'FooUser'
        }
      ]
    };

    anchorLinkService = new SkyDocsAnchorLinkService(definitionsProvider);
  });

  it('should generate a method signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const methodDef: SkyDocsMethodDefinition = {
      name: 'fooBar'
    };

    const signature = service.getMethodSignature(methodDef);
    expect(signature).toEqual(
      'public fooBar(): void'
    );
  });

  it('should generate a method signature with optional params', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const methodDef: SkyDocsMethodDefinition = {
      name: 'fooBar',
      parameters: [
        {
          name: 'component',
          type: 'string',
          isOptional: true,
          defaultValue: '\'foobar\''
        },
        {
          name: 'user',
          type: 'User',
          isOptional: true
        }
      ]
    };

    const signature = service.getMethodSignature(methodDef);
    expect(signature).toEqual(
      'public fooBar(component: string = \'foobar\', user?: User): void'
    );
  });

  it('should generate a method signature with type params', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const methodDef: SkyDocsMethodDefinition = {
      name: 'fooBar',
      parameters: [
        {
          name: 'component',
          type: 'Type<T>',
          isOptional: false
        },
        {
          name: 'user',
          type: 'U',
          isOptional: false
        }
      ],
      returnType: 'string',
      typeParameters: ['T', 'U extends FooUser']
    };

    const signature = service.getMethodSignature(methodDef);
    expect(signature).toEqual(
      'public fooBar<T, U extends FooUser>(component: Type<T>, user: U): string'
    );
  });

  it('should NOT wrap anchor tags around a method\'s known types', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const methodDef: SkyDocsMethodDefinition = {
      name: 'fooBar',
      returnType: 'FooUser',
      parameters: [{
        name: 'user',
        type: 'FooUser',
        isOptional: false
      }]
    };

    const signature = service.getMethodSignature(methodDef);
    expect(signature).toEqual(
      'public fooBar(user: FooUser): FooUser'
    );
  });

  it('should generate a parameter signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const paramDef: SkyDocsParameterDefinition = {
      name: 'foobar',
      isOptional: false,
      type: 'string'
    };

    const definition = service.getParameterSignature(paramDef);
    expect(definition).toEqual('foobar: string');
  });

  it('should generate an interface signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const interfaceDef: SkyDocsInterfaceDefinition = {
      name: 'Foobar',
      properties: [
        {
          isOptional: false,
          name: 'foo',
          type: 'Type<T>'
        },
        {
          isOptional: true,
          name: 'bar',
          type: 'string'
        }
      ]
    };

    const definition = service.getInterfaceSignature(interfaceDef);
    expect(definition).toEqual('interface Foobar {\n  foo: Type<T>;\n  bar?: string;\n}');
  });

  it('should generate an interface signature with type params', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const interfaceDef: SkyDocsInterfaceDefinition = {
      name: 'Foobar',
      properties: [
        {
          isOptional: false,
          name: 'foo',
          type: 'Type<T>'
        }
      ],
      typeParameters: [
        'T',
        'U extends User'
      ]
    };

    const definition = service.getInterfaceSignature(interfaceDef);
    expect(definition).toEqual('interface Foobar<T, U extends User> {\n  foo: Type<T>;\n}');
  });

  it('should generate a property signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: false,
      type: 'string'
    };

    const definition = service.getPropertySignature(propertyDef);
    expect(definition).toEqual('foobar: string');
  });

  it('should generate an optional property signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: true,
      type: 'string'
    };

    const definition = service.getPropertySignature(propertyDef);
    expect(definition).toEqual('foobar?: string');
  });

  it('should generate a property signature with a decorator', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: false,
      decorator: 'Input',
      type: 'string'
    };

    const definition = service.getPropertySignature(propertyDef);
    expect(definition).toEqual('@Input()<br />foobar: string');
  });

  it('should generate a deprecated property signature', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'click',
      isOptional: true,
      decorator: 'Output',
      type: 'EventEmitter<FooUser>',
      deprecationWarning: 'Do not use this feature.'
    };

    const definition = service.getPropertySignature(propertyDef);
    expect(definition).toEqual(
      '@Output()<br /><strike>click</strike>: EventEmitter&lt;<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>&gt;'
    );
  });

  it('should wrap anchor tags around a property\'s known types', () => {
    const service = new SkyDocsTypeDefinitionsFormatService(anchorLinkService);
    const propertyDef: SkyDocsPropertyDefinition = {
      name: 'foobar',
      isOptional: false,
      type: 'FooUser'
    };

    const definition = service.getPropertySignature(propertyDef);
    expect(definition).toEqual(
      'foobar: <a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  });

});
