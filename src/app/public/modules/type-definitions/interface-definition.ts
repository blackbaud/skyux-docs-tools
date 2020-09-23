import {
  SkyDocsEntryDefinition
} from './entry-definition';

import {
  SkyDocsInterfacePropertyDefinition
} from './interface-property-definition';

import {
  SkyDocsTypeParameterDefinition
} from './type-parameter-definition';

/**
 * Used to describe interfaces.
 */
export interface SkyDocsInterfaceDefinition extends SkyDocsEntryDefinition {

  properties: SkyDocsInterfacePropertyDefinition[];

  typeParameters?: SkyDocsTypeParameterDefinition[];

}
