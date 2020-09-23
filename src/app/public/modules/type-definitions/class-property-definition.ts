import {
  SkyDocsEntryChildDefinition
} from './entry-child-definition';

/**
 * Used to describe class properties.
 */
export interface SkyDocsClassPropertyDefinition extends SkyDocsEntryChildDefinition {

  decorator?: {
    name: string;
  };

  defaultValue?: string;

  isOptional: boolean;

}
