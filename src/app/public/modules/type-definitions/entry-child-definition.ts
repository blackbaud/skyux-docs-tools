import {
  SkyDocsTypeDefinition
} from './type-definition';

/**
 * Used to describe all entry-level children types, such as methods, properties, and accessors.
 * @internal
 */
export interface SkyDocsEntryChildDefinition {

  codeExample?: string;

  codeExampleLanguage?: string;

  deprecationWarning?: string;

  description?: string;

  name: string;

  type: SkyDocsTypeDefinition;

}
