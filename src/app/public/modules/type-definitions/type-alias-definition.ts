import {
  SkyDocsPropertyDefinition
} from './property-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

export interface SkyDocsTypeAliasDefinition {

  name: string;

  anchorId?: string;

  description?: string;

  properties?: SkyDocsPropertyDefinition[];

  type?: SkyDocsTypeDefinition;

}
