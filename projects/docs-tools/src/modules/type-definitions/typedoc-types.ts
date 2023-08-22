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

  typeParameter?: TypeDocTypeParameter[];
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

  typeParameter?: TypeDocTypeParameter[];
}

export enum TypeDocKind {
  Project = 1,
  Module = 2,
  Namespace = 4,
  Enum = 8,
  EnumMember = 16,
  Variable = 32,
  Function = 64,
  Class = 128,
  Interface = 256,
  Constructor = 512,
  Property = 1024,
  Method = 2048,
  CallSignature = 4096,
  IndexSignature = 8192,
  ConstructorSignature = 16384,
  Parameter = 32768,
  TypeLiteral = 65536,
  TypeParameter = 131072,
  Accessor = 262144,
  GetSignature = 524288,
  SetSignature = 1048576,
  /** @deprecated will be removed in v0.25, not used */
  ObjectLiteral = 2097152,
  TypeAlias = 4194304,
  Reference = 8388608,
}
