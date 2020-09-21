export interface TypeDocComment {

  shortText?: string;

  tags?: {
    param?: string;
    tag: 'default' | 'defaultvalue' | 'defaultValue' | 'deprecated' | 'example' | 'param';
    text: string;
  }[];

  text?: string;

}

export interface TypeDocSource {

  fileName: string;

}

export interface TypeDocCallSignature {

  comment?: TypeDocComment;

  kindString: 'Call signature';

  name: string;

  parameters?: TypeDocParameter[];

  type: TypeDocType;

  typeParameter?: [{
    name: string;
    kindString: 'Type parameter';
    type: TypeDocType;
  }];

}

export interface TypeDocType {

  constraint?: {
    name: string;
  };

  declaration?: {
    signatures?: TypeDocCallSignature[];
    indexSignature?: TypeDocCallSignature[];
  };

  elementType?: TypeDocType;

  name?: string;

  type?: 'array' | 'intrinsic' | 'reference' | 'reflection' | 'stringLiteral' | 'typeParameter' | 'union' | 'unknown';

  typeArguments?: TypeDocType[];

  types?: TypeDocType[];

  value?: string;

}

export interface TypeDocParameter {

  comment?: TypeDocComment;

  defaultValue?: string;

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
      bindingPropertyName: string;
    };
    name: 'Input' | 'Output';
    type: TypeDocType;
  }[];

  defaultValue?: string;

  flags?: {
    isOptional?: boolean;
  };

  kindString?: 'Accessor' | 'Call signature' | 'Enumeration member' | 'Parameter' | 'Property' | 'Method';

  getSignature?: {
    comment: TypeDocComment;
    name: string;
    type: TypeDocType;
  }[];

  name?: string;

  setSignature?: {
    comment: TypeDocComment;
    parameters?: TypeDocParameter[];
    type: TypeDocType;
  }[];

  signatures?: TypeDocCallSignature[];

  sources?: TypeDocSource[];

  type?: TypeDocType;
}

export interface TypeDocEntry {

  anchorId?: string;

  children?: TypeDocEntryChild[];

  comment?: TypeDocComment;

  decorators?: {
    arguments?: {
      obj: string;
    };
    name: 'Component' | 'Directive' | 'Injectable' | 'NgModule' | 'Pipe';
    type: TypeDocType;
  }[];

  kindString?: 'Class' | 'Enumeration' | 'Interface' | 'Type alias';

  indexSignature?: TypeDocCallSignature[];

  name?: string;

  sources?: TypeDocSource[];

  type?: TypeDocType;

  typeParameter?: {
    name: string;
    type: TypeDocType;
  }[];

}
