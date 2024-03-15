import { SkyDocsClassDefinition } from '../class-definition';

import { SkyDocsDirectiveDefinition } from '../directive-definition';

import { SkyDocsEnumerationDefinition } from '../enumeration-definition';

import { SkyDocsInterfaceDefinition } from '../interface-definition';

import { SkyDocsPipeDefinition } from '../pipe-definition';

import { SkyDocsTypeAliasDefinition } from '../type-alias-definition';
import { SkyDocsTypeDocAdapterService } from '../typedoc-adapter.service';

import { TypeDocEntry } from '../typedoc-types';

export class MockTypeDocAdapterService extends SkyDocsTypeDocAdapterService {
  public toClassDefinition(entry: TypeDocEntry): SkyDocsClassDefinition {
    return {
      hasPreviewFeatures: false,
      anchorId: entry.anchorId,
      name: entry.name,
    };
  }

  public toDirectiveDefinition(
    entry: TypeDocEntry,
  ): SkyDocsDirectiveDefinition {
    return {
      hasPreviewFeatures: false,
      anchorId: entry.anchorId,
      name: entry.name,
      selector: 'foo',
    };
  }

  public toEnumerationDefinition(
    entry: TypeDocEntry,
  ): SkyDocsEnumerationDefinition {
    return {
      hasPreviewFeatures: false,
      anchorId: entry.anchorId,
      members: undefined,
      name: entry.name,
    };
  }

  public toInterfaceDefinition(
    entry: TypeDocEntry,
  ): SkyDocsInterfaceDefinition {
    return {
      hasPreviewFeatures: false,
      anchorId: entry.anchorId,
      name: entry.name,
      properties: [],
    };
  }

  public toPipeDefinition(entry: TypeDocEntry): SkyDocsPipeDefinition {
    return {
      anchorId: entry.anchorId,
      name: entry.name,
      transformMethod: {
        name: 'transform',
        isPreview: false,
        type: {
          callSignature: {
            returnType: {
              name: 'stringj',
            },
          },
        },
      },
    };
  }

  public toTypeAliasDefinition(
    entry: TypeDocEntry,
  ): SkyDocsTypeAliasDefinition {
    return {
      anchorId: entry.anchorId,
      name: entry.name,
      isPreview: false,
      type: {},
    };
  }
}
