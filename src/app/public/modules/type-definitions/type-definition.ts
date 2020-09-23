import {
  SkyDocsCallSignatureDefinition
} from './call-signature-definition';

import {
  SkyDocsTypeArgumentDefinition
} from './type-argument-definition';

/**
 * Used to describe TypeScript types.
 */
export interface SkyDocsTypeDefinition {

  /**
   * Used by method, function, and arrow function types.
   */
  callSignature?: SkyDocsCallSignatureDefinition;

  /**
   * Used for index signatures, e.g. `[_: string]: any`
   */
  indexSignature?: {
    keyName: string;
    type: SkyDocsTypeDefinition;
  };

  name?: string;

  type?: 'array' | 'intrinsic' | 'reference' | 'reflection' | 'stringLiteral' | 'typeParameter' | 'union' | 'unknown';

  /**
   * Describes any type arguments, e.g. `<T, F>`.
   */
  typeArguments?: SkyDocsTypeArgumentDefinition[];

  /**
   * The types that compose a union type.
   */
  unionTypes?: SkyDocsTypeDefinition[];

}
