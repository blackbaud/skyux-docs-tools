import {
  SkyDocsEntryDefinition
} from './entry-definition';

import {
  SkyDocsEnumerationMemberDefinition
} from './enumeration-member-definition';

/**
 * Used to describe enumerations.
 */
export interface SkyDocsEnumerationDefinition extends SkyDocsEntryDefinition {

  members: SkyDocsEnumerationMemberDefinition[];

}
