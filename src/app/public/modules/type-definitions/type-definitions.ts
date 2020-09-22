/**
 * Used to describe all entry-level types such as classes, directives, enumerations, etc.
 */
interface SkyDocsEntryDefinition {
  anchorId: string;
  name: string;
  description: string;
  codeExample: string;
  codeExampleLanguage: string;
  deprecationWarning: string;
}

/**
 * Used to describe all entry-level children types, such as methods, properties, and accessors.
 */
interface SkyDocsEntryChildDefinition {
  name: string;
  description: string;
  deprecationWarning: string;
  type: SkyDocsTypeDefinition;
  codeExample: string;
  codeExampleLanguage: string;
}

export interface SkyDocsCallSignatureDefinition {
  parameters: SkyDocsParameterDefinition[];
  returnType: SkyDocsTypeDefinition;
}

/**
 * Used to describe TypeScript types.
 */
export interface SkyDocsTypeDefinition {

  type?: 'array' | 'intrinsic' | 'reference' | 'reflection' | 'stringLiteral' | 'typeParameter' | 'union' | 'unknown';

  name: string;

  /**
   * Used by method, function, and arrow function types.
   */
  callSignature?: SkyDocsCallSignatureDefinition;

  /**
   * Used for index signatures, e.g. key-value pairings.
   */
  indexSignature?: {
    keyName: string;
    type: SkyDocsTypeDefinition;
  };

  /**
   * The types that compose a union type.
   */
  unionTypes?: SkyDocsTypeDefinition[];

  /**
   * Describes any type arguments, e.g. `<T, F>`.
   */
  typeArguments?: SkyDocsTypeArgumentDefinition[];

}

export interface SkyDocsParameterDefinition {
  name: string;
  description: string;
  type: SkyDocsTypeDefinition;
  typeArguments: SkyDocsTypeArgumentDefinition[];
  defaultValue: string;
  isOptional: boolean;
}

export interface SkyDocsTypeArgumentDefinition {
  name: string;
  type: SkyDocsTypeDefinition;
}

export interface SkyDocsTypeParameterDefinition {
  name: string;
  type: SkyDocsTypeDefinition;
}

/**
 * Used to describe class properties.
 */
export interface SkyDocsClassPropertyDefinition extends SkyDocsEntryChildDefinition {
  decorator: {
    name: string;
  };
  isOptional: boolean;
  defaultValue: string;
}

/**
 * Used to describe class methods.
 */
export interface SkyDocsClassMethodDefinition extends SkyDocsEntryChildDefinition {
  typeParameters: SkyDocsTypeParameterDefinition[];
}

/**
 * Used to describe interface properties.
 */
export interface SkyDocsInterfacePropertyDefinition extends SkyDocsEntryChildDefinition {
  isOptional: boolean;
}

export interface SkyDocsEnumerationMemberDefinition {
  name: string;
  description: string;
  deprecationWarning: string;
  codeExample: string;
  codeExampleLanguage: string;
}

/**
 * Used to describe classes and services.
 */
export interface SkyDocsClassDefinition extends SkyDocsEntryDefinition {
  name: string;
  description: string;
  properties: SkyDocsClassPropertyDefinition[];
  methods: SkyDocsClassMethodDefinition[];
}

/**
 * Used to describe components and directives.
 */
export interface SkyDocsDirectiveDefinition extends SkyDocsEntryDefinition {
  selector: string;
  inputProperties: SkyDocsClassPropertyDefinition[];
  eventProperties: SkyDocsClassPropertyDefinition[];
}

/**
 * Used to describe interfaces.
 */
export interface SkyDocsInterfaceDefinition extends SkyDocsEntryDefinition {
  properties: SkyDocsInterfacePropertyDefinition[];
}

/**
 * Used to describe pipes.
 */
export interface SkyDocsPipeDefinition extends SkyDocsEntryDefinition {
  transformMethod: SkyDocsClassMethodDefinition;
}

/**
 * Used to describe enumerations.
 */
export interface SkyDocsEnumerationDefinition extends SkyDocsEntryDefinition {
  members: SkyDocsEnumerationMemberDefinition[];
}

/**
 * Used to describe type aliases.
 */
export interface SkyDocsTypeAliasDefinition extends SkyDocsEntryDefinition {
  typeParameters: SkyDocsTypeParameterDefinition[];
  type: SkyDocsTypeDefinition;
}

/**
 * @internal
 */
export interface SkyDocsTypeDefinitions {

  classes: SkyDocsClassDefinition[];

  components: SkyDocsDirectiveDefinition[];

  directives: SkyDocsDirectiveDefinition[];

  enumerations: SkyDocsEnumerationDefinition[];

  interfaces: SkyDocsInterfaceDefinition[];

  pipes: SkyDocsPipeDefinition[];

  services: SkyDocsClassDefinition[];

  typeAliases: SkyDocsTypeAliasDefinition[];

}
