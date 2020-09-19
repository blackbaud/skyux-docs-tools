import {
  Injectable
} from '@angular/core';

import {
  SkyDocsTypeDefinitions
} from './type-definitions';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

import {
  TypeDocItem
} from './typedoc-types';

@Injectable()
export class SkyDocsTypeDefinitionsService {

  constructor(
    private typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) { }

  /**
   * Returns type definitions from a specific source code location.
   * @param sourceCodePath The directory of the source code you wish to pull type definitions from,
   * relative to the application's root directory.
   */
  public getTypeDefinitions(sourceCodePath: string): SkyDocsTypeDefinitions {

    if (sourceCodePath.charAt(sourceCodePath.length - 1) !== '/') {
      throw new Error('The source code path must end with a forward slash (`/`).');
    }

    const allDefinitions = this.typeDefinitionsProvider.typeDefinitions;
    const requestedDir = sourceCodePath
      .replace(/src\/app\/public\//, '')
      .replace(/^\//, ''); // remove first slash.

    const types: SkyDocsTypeDefinitions = {
      classes: [],
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: []
    };

    if (!allDefinitions) {
      console.warn(`No types were found for this project!`);
      return types;
    }

    // Only process types that match the requested source code location.
    const typeDefinitions: TypeDocItem[] = allDefinitions.filter((i) => i.sources[0].fileName.match(requestedDir));
    if (typeDefinitions.length === 0) {
      console.warn(`Type definitions were not found for location: ${requestedDir}`);
    }

    typeDefinitions.forEach((item) => {
      const decorator = item.decorators && item.decorators[0].name;
      const kindString = item.kindString;

      switch (decorator) {
        case 'Component':
          types.components.push(item);
          break;
        case 'Directive':
          types.directives.push(item);
          break;
        case 'Injectable':
          types.services.push(item);
          break;
        case 'NgModule':
          // Don't document modules.
          break;
        case 'Pipe':
          types.pipes.push(item);
          break;
        default:
          switch (kindString) {
            case 'Class':
              types.classes.push(item);
              break;
            case 'Interface':
              types.interfaces.push(item);
              break;
            case 'Enumeration':
              types.enumerations.push(item);
              break;
            case 'Type alias':
              types.typeAliases.push(item);
              break;
            default:
              break;
          }
      }
    });

    return types;
  }

}
