import {
  SkyDocsEntryDefinition
} from './entry-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

import {
  SkyDocsTypeParameterDefinition
} from './type-parameter-definition';

/**
 * Used to describe type aliases.
 */
export interface SkyDocsTypeAliasDefinition extends SkyDocsEntryDefinition {

  type: SkyDocsTypeDefinition;

  typeParameters: SkyDocsTypeParameterDefinition[];

}
