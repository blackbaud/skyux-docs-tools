import {
  SkyDocsEntryChildDefinition
} from './entry-child-definition';

/**
 * Describes class properties.
 */
export interface SkyDocsClassPropertyDefinition extends SkyDocsEntryChildDefinition {

  decorator?: {
    name: string;
  };

  defaultValue?: string;

  isOptional: boolean;

}
