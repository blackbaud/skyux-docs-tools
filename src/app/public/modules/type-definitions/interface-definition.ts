import {
  SkyDocsEntryDefinition
} from './entry-definition';

import {
  SkyDocsInterfacePropertyDefinition
} from './interface-property-definition';

/**
 * Used to describe interfaces.
 */
export interface SkyDocsInterfaceDefinition extends SkyDocsEntryDefinition {

  properties: SkyDocsInterfacePropertyDefinition[];

}
