import {
  SkyDocsEntryDefinition
} from './entry-definition';

import {
  SkyDocsClassMethodDefinition
} from './method-definition';

/**
 * Used to describe pipes.
 */
export interface SkyDocsPipeDefinition extends SkyDocsEntryDefinition {

  transformMethod: SkyDocsClassMethodDefinition;

}
