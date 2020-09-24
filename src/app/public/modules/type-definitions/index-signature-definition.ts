import {
  SkyDocsTypeDefinition
} from './type-definition';

export interface SkyDocsIndexSignatureDefinition {

  key: {
    name: string;
    type: SkyDocsTypeDefinition;
  };

  type: SkyDocsTypeDefinition;

}
