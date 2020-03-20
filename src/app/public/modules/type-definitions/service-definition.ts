import {
  SkyDocsMethodDefinition
} from './method-definition';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

export interface SkyDocsServiceDefinition {

  name: string;

  methods: SkyDocsMethodDefinition[];

  anchorId?: string;

  description?: string;

  properties?: SkyDocsPropertyDefinition[];

}
