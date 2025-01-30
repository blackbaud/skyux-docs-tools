import { Injectable } from '@angular/core';

import { SkyDocsTypeDefinitions } from './type-definitions';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

import { SkyDocsTypeDocAdapterService } from './typedoc-adapter.service';
import { TypeDocKind } from './typedoc-types';

/**
 * Handles all type definitions that have been converted from the third-party documentation generator.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyDocsTypeDefinitionsService {
  constructor(
    private typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider,
    private adapter: SkyDocsTypeDocAdapterService,
  ) {}

  /**
   * Returns type definitions from a specific source code location.
   * @param sourceCodePath The directory of the source code you wish to pull type definitions from,
   * relative to the application's root directory.
   */
  public getTypeDefinitions(
    sourceCodePath: string,
    additionalSourceCodePaths?: string[],
  ): SkyDocsTypeDefinitions {
    if (!sourceCodePath) {
      throw new Error('The `sourceCodePath` parameter is required');
    }

    const sourceCodePaths: string[] =
      additionalSourceCodePaths && additionalSourceCodePaths.length > 0
        ? [sourceCodePath].concat(additionalSourceCodePaths)
        : [sourceCodePath];

    sourceCodePaths.forEach((path) => {
      if (!path.endsWith('/') && !path.endsWith('.ts')) {
        throw new Error(
          'Source code paths must end with a forward slash (`/`) or `.ts`.',
        );
      }
    });

    const allDefinitions = this.typeDefinitionsProvider.typeDefinitions;
    const types: SkyDocsTypeDefinitions = {
      classes: [],
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: [],
      hasPreviewFeatures: false,
    };

    if (!allDefinitions) {
      console.warn(`No types were found for this project!`);
      return types;
    }

    sourceCodePaths.forEach((path) => {
      const requestedDir = path
        .replace(/src\/app\/public\//, '')
        .replace(/^\//, ''); // remove first slash.

      // Only process types that match the requested source code location.
      const typeDefinitions = allDefinitions.filter(
        (i) => i.sources && i.sources[0].fileName.match(requestedDir),
      );
      if (typeDefinitions.length === 0) {
        console.warn(
          `Type definitions were not found for location: ${requestedDir}`,
        );
      }

      typeDefinitions.forEach((item) => {
        const decorator = item.decorators && item.decorators[0]?.name;
        const kind = item.kind;

        switch (decorator) {
          case 'Component':
            const componentType = this.adapter.toDirectiveDefinition(item);
            types.components.push(componentType);
            types.hasPreviewFeatures ||= componentType.hasPreviewFeatures;
            break;
          case 'Directive':
            const directiveType = this.adapter.toDirectiveDefinition(item);
            types.directives.push(directiveType);
            types.hasPreviewFeatures ||= directiveType.hasPreviewFeatures;
            break;
          case 'Injectable':
            const serviceType = this.adapter.toClassDefinition(item);
            types.services.push(serviceType);
            types.hasPreviewFeatures ||= serviceType.hasPreviewFeatures;
            break;
          case 'NgModule':
            // Don't document modules.
            break;
          case 'Pipe':
            const pipeType = this.adapter.toPipeDefinition(item);
            types.pipes.push(pipeType);
            types.hasPreviewFeatures ||= pipeType.transformMethod.isPreview;
            break;
          default:
            /*tslint:disable-next-line:switch-default*/
            switch (kind) {
              case TypeDocKind.Class:
                const classType = this.adapter.toClassDefinition(item);
                types.classes.push(classType);
                types.hasPreviewFeatures ||= classType.hasPreviewFeatures;
                break;
              case TypeDocKind.Interface:
                const interfaceType = this.adapter.toInterfaceDefinition(item);
                types.interfaces.push(interfaceType);
                types.hasPreviewFeatures ||= interfaceType.hasPreviewFeatures;
                break;
              case TypeDocKind.Enum:
                const enumType = this.adapter.toEnumerationDefinition(item);
                types.enumerations.push(enumType);
                types.hasPreviewFeatures ||= enumType.hasPreviewFeatures;
                break;
              case TypeDocKind.TypeAlias:
              case TypeDocKind.Reference:
                const typeAliasType = this.adapter.toTypeAliasDefinition(item);
                types.typeAliases.push(typeAliasType);
                types.hasPreviewFeatures ||= !!typeAliasType.isPreview;
                break;
            }
        }
      });
    });

    return types;
  }
}
