import {
  SkyDocsClassPropertyDefinition
} from './class-property-definition';

import {
  SkyDocsEntryDefinition
} from './entry-definition';

/**
 * Used to describe components and directives.
 */
export interface SkyDocsDirectiveDefinition extends SkyDocsEntryDefinition {

  eventProperties: SkyDocsClassPropertyDefinition[];

  inputProperties: SkyDocsClassPropertyDefinition[];

  selector: string;

}
