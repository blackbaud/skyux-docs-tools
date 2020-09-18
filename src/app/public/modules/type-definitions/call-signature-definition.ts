import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

export interface SkyDocsCallSignatureDefinition {

  parameters?: SkyDocsParameterDefinition[];

  returnType?: SkyDocsTypeDefinition;

}
