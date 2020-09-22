import {
  SkyDocsEntryChildDefinition
} from './entry-child-definition';

import {
  SkyDocsTypeParameterDefinition
} from './type-parameter-definition';

/**
 * Used to describe class methods.
 */
export interface SkyDocsClassMethodDefinition extends SkyDocsEntryChildDefinition {

  typeParameters: SkyDocsTypeParameterDefinition[];

}
