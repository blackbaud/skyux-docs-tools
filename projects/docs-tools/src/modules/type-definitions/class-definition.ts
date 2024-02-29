import { SkyDocsClassPropertyDefinition } from './property-definition';

import { SkyDocsEntryDefinition } from './entry-definition';

import { SkyDocsClassMethodDefinition } from './method-definition';

/**
 * Describes classes and services.
 */
export interface SkyDocsClassDefinition extends SkyDocsEntryDefinition {
  hasPreviewFeatures: boolean;

  methods?: SkyDocsClassMethodDefinition[];

  properties?: SkyDocsClassPropertyDefinition[];
}
