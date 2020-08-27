import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

export type SkyDocsTypeDefinition = string | {
  callSignature?: {
    parameters?: SkyDocsParameterDefinition[];
    returnType?: SkyDocsTypeDefinition;
  };
  objectLiteral?: {
    children?: SkyDocsPropertyDefinition[];
  };
};
