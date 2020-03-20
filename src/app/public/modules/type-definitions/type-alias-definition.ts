import {
  SkyDocsParameterDefinition
} from './parameter-definition';

export interface SkyDocsTypeAliasDefinition {

  name: string;

  sourceCode: string;

  anchorId?: string;

  description?: string;

  parameters?: SkyDocsParameterDefinition[];

  returnType?: string;

}
