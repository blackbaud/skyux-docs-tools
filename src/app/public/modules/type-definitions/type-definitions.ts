import {
  TypeDocEntry
} from './typedoc-types';

/**
 * @internal
 */
export interface SkyDocsTypeDefinitions {

  classes: TypeDocEntry[];

  components: TypeDocEntry[];

  directives: TypeDocEntry[];

  enumerations: TypeDocEntry[];

  interfaces: TypeDocEntry[];

  pipes: TypeDocEntry[];

  services: TypeDocEntry[];

  typeAliases: TypeDocEntry[];

}
