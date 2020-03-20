import {
  SkyDocsDirectivePropertyDefinition
} from './directive-property-definition';

export interface SkyDocsDirectiveDefinition {

  anchorId: string;

  name: string;

  selector: string;

  description: string;

  properties: SkyDocsDirectivePropertyDefinition[];

  codeExample?: string;

  codeExampleLanguage?: string;
}
