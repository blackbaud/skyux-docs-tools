import { SkyDocsEntryChildDefinition } from './entry-child-definition';

import { SkyDocsPropertyDecoratorDefinition } from './property-decorator';

/**
 * Describes class properties.
 */
export interface SkyDocsClassPropertyDefinition
  extends SkyDocsEntryChildDefinition {
  decorator?: SkyDocsPropertyDecoratorDefinition;

  defaultValue?: string;

  isPreview: boolean;

  isOptional: boolean;
}
