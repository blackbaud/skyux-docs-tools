import {
  SkyDocsClassPropertyDefinition
} from './class-property-definition';

import {
  SkyDocsEntryDefinition
} from './entry-definition';

import {
  SkyDocsClassMethodDefinition
} from './method-definition';

/**
 * Used to describe classes and services.
 */
export interface SkyDocsClassDefinition extends SkyDocsEntryDefinition {

  methods?: SkyDocsClassMethodDefinition[];

  properties?: SkyDocsClassPropertyDefinition[];

}
