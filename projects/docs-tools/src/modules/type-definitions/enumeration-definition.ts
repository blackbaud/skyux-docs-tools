import { SkyDocsEntryDefinition } from './entry-definition';

import { SkyDocsEnumerationMemberDefinition } from './enumeration-member-definition';

/**
 * Describes enumerations.
 */
export interface SkyDocsEnumerationDefinition extends SkyDocsEntryDefinition {
  hasPreviewFeatures: boolean;
  members: SkyDocsEnumerationMemberDefinition[];
}
