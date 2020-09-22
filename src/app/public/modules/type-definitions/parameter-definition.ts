import {
  SkyDocsTypeArgumentDefinition
} from './type-argument-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

export interface SkyDocsParameterDefinition {

  defaultValue: string;

  description: string;

  isOptional: boolean;

  name: string;

  type: SkyDocsTypeDefinition;

  typeArguments: SkyDocsTypeArgumentDefinition[];

}
