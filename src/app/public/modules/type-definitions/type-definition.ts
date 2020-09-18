import {
  SkyDocsCallSignatureDefinition
} from './call-signature-definition';

export type SkyDocsTypeDefinition = string | {
  callSignature?: SkyDocsCallSignatureDefinition;
};
