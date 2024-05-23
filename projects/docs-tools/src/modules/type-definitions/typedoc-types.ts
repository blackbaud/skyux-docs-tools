export interface TypeDocComment {
  summary?: { kind: string; text: string }[];

  blockTags?: {
    param?: string;
    content?: { kind: string; text: string }[];
    tag:
      | '@default'
      | '@defaultValue'
      | '@deprecated'
      | '@example'
      | '@param'
      | '@preview'
      | '@required';
  }[];
}

export interface TypeDocSource {
  fileName: string;
}

export interface TypeDocSignature {
  comment?: TypeDocComment;

  kind?:
    | TypeDocKind.CallSignature
    | TypeDocKind.ConstructorSignature
    | TypeDocKind.IndexSignature;

  name: string;

  parameters?: TypeDocParameter[];

  returnType?: TypeDocType;

  type?: TypeDocType;

  typeParameters?: TypeDocTypeParameter[];
}

export interface TypeDocTypeParameter {
  name: string;
  kind: TypeDocKind.TypeParameter;
  type?: TypeDocType;
}

export interface TypeDocType {
  constraint?: {
    name: string;
  };

  callSignature?: TypeDocSignature;

  declaration?: {
    children?: TypeDocEntryChild[];
    indexSignature?: TypeDocSignature;
    signatures?: TypeDocSignature[];
  };

  elementType?: TypeDocType;

  name?: string;

  operator?: 'keyof';

  target?: {
    name: string;
  };

  type?:
    | 'array'
    | 'intrinsic'
    | 'literal'
    | 'reference'
    | 'reflection'
    | 'typeParameter'
    | 'typeOperator'
    | 'union'
    | 'unknown';

  typeArguments?: TypeDocType[];

  types?: TypeDocType[];

  value?: string;

  package?: string;
}

export interface TypeDocParameter {
  comment?: TypeDocComment;

  defaultValue?: string;

  kind: TypeDocKind.Parameter;

  name: string;

  type: TypeDocType;

  flags?: {
    isOptional?: boolean;
  };
}

export interface TypeDocEntryChild {
  comment?: TypeDocComment;

  decorators?: {
    arguments?: {
      bindingPropertyName?: string;
    };
    name: 'Input' | 'Output';
    type: TypeDocType;
  }[];

  defaultValue?: string;

  flags?: {
    isOptional?: boolean;
    isStatic?: boolean;
  };

  kind?:
    | TypeDocKind.Accessor
    | TypeDocKind.CallSignature
    | TypeDocKind.Constructor
    | TypeDocKind.ConstructorSignature
    | TypeDocKind.IndexSignature
    | TypeDocKind.EnumMember
    | TypeDocKind.Parameter
    | TypeDocKind.Property
    | TypeDocKind.Method;

  getSignature?: {
    comment: TypeDocComment;
    name: string;
    type: TypeDocType;
  };

  name?: string;

  setSignature?: {
    comment: TypeDocComment;
    name: string;
    parameters?: TypeDocParameter[];
    type: TypeDocType;
  };

  signatures?: TypeDocSignature[];

  sources?: TypeDocSource[];

  type?: TypeDocType;
}

export interface TypeDocEntry {
  anchorId?: string;

  children?: TypeDocEntryChild[];

  comment?: TypeDocComment;

  decorators?: {
    arguments?: {
      obj?: string;
    };
    name: 'Component' | 'Directive' | 'Injectable' | 'NgModule' | 'Pipe';
    type: TypeDocType;
  }[];

  kind?:
    | TypeDocKind.Class
    | TypeDocKind.Enum
    | TypeDocKind.Interface
    | TypeDocKind.TypeAlias;

  indexSignature?: TypeDocSignature;

  name?: string;

  sources?: TypeDocSource[];

  type?: TypeDocType;

  typeParameters?: TypeDocTypeParameter[];
}

/**
 * This enum comes from:
 * https://github.com/TypeStrong/typedoc/blob/v0.25.13/src/lib/models/reflections/kind.ts
 * The enum is up to date as of version `0.25.13`.
 */
export enum TypeDocKind {
  Project = 0x1,
  Module = 0x2,
  Namespace = 0x4,
  Enum = 0x8,
  EnumMember = 0x10,
  Variable = 0x20,
  Function = 0x40,
  Class = 0x80,
  Interface = 0x100,
  Constructor = 0x200,
  Property = 0x400,
  Method = 0x800,
  CallSignature = 0x1000,
  IndexSignature = 0x2000,
  ConstructorSignature = 0x4000,
  Parameter = 0x8000,
  TypeLiteral = 0x10000,
  TypeParameter = 0x20000,
  Accessor = 0x40000,
  GetSignature = 0x80000,
  SetSignature = 0x100000,
  TypeAlias = 0x200000,
  Reference = 0x400000,
}
