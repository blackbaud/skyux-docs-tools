import {
  SkyDocsDirectiveDefinition
} from './directive-definition';

import {
  SkyDocsEnumerationDefinition
} from './enumeration-definition';

import {
  SkyDocsInterfaceDefinition
} from './interface-definition';

import {
  SkyDocsPipeDefinition
} from './pipe-definition';

import {
  SkyDocsServiceDefinition
} from './service-definition';

import {
  SkyDocsTypeAliasDefinition
} from './type-alias-definition';

/**
 * @internal
 */
export interface SkyDocsTypeDefinitions {

  components: SkyDocsDirectiveDefinition[];

  directives: SkyDocsDirectiveDefinition[];

  enumerations: SkyDocsEnumerationDefinition[];

  interfaces: SkyDocsInterfaceDefinition[];

  pipes: SkyDocsPipeDefinition[];

  services: SkyDocsServiceDefinition[];

  typeAliases: SkyDocsTypeAliasDefinition[];

}
