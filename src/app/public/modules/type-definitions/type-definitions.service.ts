import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCallSignatureDefinition,
  SkyDocsTypeDefinitions
} from './type-definitions';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

import {
  TypeDocCallSignature,
  TypeDocEntry, TypeDocEntryChild, TypeDocType
} from './typedoc-types';

import {
  SkyDocsClassPropertyDefinition,
  SkyDocsDirectiveDefinition,
  SkyDocsTypeDefinition,
  SkyDocsParameterDefinition,
  SkyDocsTypeArgumentDefinition,
  SkyDocsClassDefinition,
  SkyDocsClassMethodDefinition,
  SkyDocsTypeParameterDefinition
} from './type-definitions';

import { SkyDocsJSDocsService } from './jsdoc.service';
import { SkyDocsCommentTags } from './comment-tags';

@Injectable()
export class SkyDocsTypeDefinitionsService {

  constructor(
    private jsDocsService: SkyDocsJSDocsService,
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
    const typeDefinitions: TypeDocEntry[] = allDefinitions.filter((i) => i.sources[0].fileName.match(requestedDir));
    if (typeDefinitions.length === 0) {
      console.warn(`Type definitions were not found for location: ${requestedDir}`);
    }

    typeDefinitions.forEach((item) => {
      const decorator = item.decorators && item.decorators[0].name;
      // const kindString = item.kindString;

      /*tslint:disable-next-line*/
      switch (decorator) {
        case 'Component':
          types.components.push(this.parseDirectiveDefinition(item));
          break;
        case 'Directive':
          types.directives.push(this.parseDirectiveDefinition(item));
          break;
        case 'Injectable':
          types.services.push(this.parseClassDefinition(item));
          break;
        // case 'NgModule':
        //   // Don't document modules.
        //   break;
        // case 'Pipe':
        //   types.pipes.push(item);
        //   break;
        // default:
        //   switch (kindString) {
        //     case 'Class':
        //       types.classes.push(item);
        //       break;
        //     case 'Interface':
        //       types.interfaces.push(item);
        //       break;
        //     case 'Enumeration':
        //       types.enumerations.push(item);
        //       break;
        //     case 'Type alias':
        //       types.typeAliases.push(item);
        //       break;
        //     default:
        //       break;
        //   }
      }
    });

    return types;
  }

  private parseDirectiveDefinition(entry: TypeDocEntry): SkyDocsDirectiveDefinition {
    const tags = this.jsDocsService.parseCommentTags(entry.comment);
    const properties = this.parseClassProperties(entry);
    console.log('Properties:', properties);

    const directive: SkyDocsDirectiveDefinition = {
      name: entry.name,
      deprecationWarning: tags.deprecationWarning,
      description: tags.description,
      codeExample: tags.codeExample,
      codeExampleLanguage: tags.codeExampleLanguage,
      selector: this.parseSelector(entry),
      inputProperties: properties?.filter(p => p.decorator.name === 'Input'),
      eventProperties: properties?.filter(p => p.decorator.name === 'Output')
    };

    return directive;
  }

  private parseClassDefinition(entry: TypeDocEntry): SkyDocsClassDefinition {
    const tags = this.jsDocsService.parseCommentTags(entry.comment);
    const properties = this.parseClassProperties(entry);
    const methods = this.parseClassMethods(entry);

    const definition: SkyDocsClassDefinition = {
      name: entry.name,
      deprecationWarning: tags.deprecationWarning,
      description: tags.description,
      codeExample: tags.codeExample,
      codeExampleLanguage: tags.codeExampleLanguage,
      methods,
      properties
    };

    return definition;
  }

  private parseSelector(entry: TypeDocEntry): string {
    if (!entry) {
      return '';
    }

    const decoratorSource = entry.decorators[0].arguments.obj;
    return (decoratorSource.indexOf('selector: `') > -1)
      ? decoratorSource.split('selector: `')[1].split('`')[0].replace(/\s\s+/g, ' ')
      : decoratorSource.split('selector: \'')[1].split('\'')[0];
  }

  private parseClassProperties(entry: TypeDocEntry): SkyDocsClassPropertyDefinition[] {
    if (!entry.children) {
      return [];
    }

    const properties = entry.children
      .filter(child => child.kindString === 'Property' || child.kindString === 'Accessor')
      .map(child => {
        const tags = this.jsDocsService.parseCommentTags(child.comment);

        const property: SkyDocsClassPropertyDefinition = {
          codeExample: tags.codeExample,
          codeExampleLanguage: tags.codeExampleLanguage,
          decorator: {
            name: this.parseDecorator(child)
          },
          defaultValue: this.parseDefaultValue(child, tags),
          deprecationWarning: tags.deprecationWarning,
          description: tags.description,
          name: this.parsePropertyName(child),
          isOptional: this.isTypeOptional(child, tags),
          type: this.parseTypeDefinition(child)
        };

        return property;
      });

    return properties;
  }

  private parseClassMethods(entry: TypeDocEntry): SkyDocsClassMethodDefinition[] {
    if (!entry.children) {
      return [];
    }

    const methods = entry.children
      .filter(child => child.kindString === 'Method')
      .map(child => {
        // Comments for methods are stored in a different location.
        const comment = child.signatures[0].comment;
        const tags = this.jsDocsService.parseCommentTags(comment);

        const method: SkyDocsClassMethodDefinition = {
          codeExample: tags.codeExample,
          codeExampleLanguage: tags.codeExampleLanguage,
          deprecationWarning: tags.deprecationWarning,
          description: tags.description,
          name: this.parsePropertyName(child),
          isOptional: this.isTypeOptional(child, tags),
          type: this.parseTypeDefinition(child),
          parameters: [],
          typeParameters: this.parseTypeParameterDefinitions(child.signatures[0])
        };

        return method;
      });

    return methods;
  }

  private isTypeOptional(child: TypeDocEntryChild, tags: SkyDocsCommentTags): boolean {

    // If `@required` is in the comment, mark it as required.
    if (tags.extras.required) {
      return false;
    }

    // Class methods can't be optional.
    if (child.kindString === 'Method') {
      return false;
    }

    // Enumeration members can't be optional.
    if (child.kindString === 'Enumeration member') {
      return false;
    }

    if (child.kindString === 'Parameter') {
      return !!(child.flags && child.flags.isOptional);
    }

    return true;
  }

  private parseDecorator(child: TypeDocEntryChild): string {
    return child.decorators && child.decorators[0] && child.decorators[0].name;
  }

  private parsePropertyName(property: TypeDocEntryChild): string {
    const decorators = property.decorators && property.decorators[0];
    // Use the Input's bound property name, if found.
    // e.g. @Input('foobar')
    return (decorators?.arguments?.bindingPropertyName)
      ? decorators?.arguments?.bindingPropertyName.replace(/(\'|\")/g, '')
      : property.name;
  }

  private parseDefaultValue(child: TypeDocEntryChild, tags: SkyDocsCommentTags): string {
    return tags.defaultValue || child.defaultValue || '';
  }

  private parseTypeDefinition(child: TypeDocEntryChild): SkyDocsTypeDefinition {
    let callSignature: any;

    console.log('Parse:', child);

    const kindString = child.kindString;
    switch (kindString) {
      case 'Accessor':
        if (child.setSignature) {
          return this.parseTypeDefinition(child.setSignature[0].parameters[0]);
        } else {
          return this.parseTypeDefinition(child.getSignature[0]);
        }

      case 'Method':
        callSignature = {
          parameters: this.parseParameterDefinitions(child.signatures[0]),
          returnType: this.parseTypeDefinition(child.signatures[0])
        };

        return {
          callSignature,
          name: child.signatures[0].name
        } as SkyDocsTypeDefinition;

      default:
        let name: string;
        if (child.type.name) {
          name = child.type.name;
        } else if (child.type.elementType) {
          name = child.type.elementType.name;
        } else if (child.type.type === 'stringLiteral') {
          name = `'${child.type.value}'`;
        }

        const definition: SkyDocsTypeDefinition = {
          name,
          type: child.type.type
        };

        // Union?
        if (child.type.types) {
          definition.unionTypes = child.type.types.map(t => this.parseTypeDefinition({ type: t }));
        }

        // Parse call signature types.
        if (child.type.type === 'reflection') {
          definition.callSignature = this.parseCallSignatureDefinition(child);
        }

        if (child.type.typeArguments) {
          definition.typeArguments = this.parseTypeArgumentDefinitions(child.type);
        }

        return definition;
    }
  }

  private parseParameterDefinitions(callSignature: TypeDocCallSignature): SkyDocsParameterDefinition[] {
    const parameters: SkyDocsParameterDefinition[] = callSignature.parameters?.map(p => {
      const tags = this.jsDocsService.parseCommentTags(p.comment);
      const defaultValue = this.parseDefaultValue(p, tags);
      const parameter: SkyDocsParameterDefinition = {
        name: p.name,
        defaultValue,
        description: tags.description,
        isOptional: !!(defaultValue || this.isTypeOptional(p, tags)),
        type: this.parseTypeDefinition(p),
        typeArguments: this.parseTypeArgumentDefinitions(p.type)
      };
      return parameter;
    });

    return parameters;
  }

  private parseTypeArgumentDefinitions(typeConfig: TypeDocType): SkyDocsTypeArgumentDefinition[] {
    if (!typeConfig || !typeConfig.typeArguments) {
      return;
    }

    return typeConfig.typeArguments.map((typeArgument) => {
      const definition: SkyDocsTypeArgumentDefinition = {
        name: typeArgument.elementType?.name || typeArgument.name,
        type: this.parseTypeDefinition({ type: typeArgument })
      };
      return definition;
    });
  }

  private parseCallSignatureDefinition(child: TypeDocEntryChild): SkyDocsCallSignatureDefinition {
    const definition: SkyDocsCallSignatureDefinition = {
      parameters: this.parseParameterDefinitions(child.type.declaration.signatures[0]),
      returnType: this.parseTypeDefinition(child.type.declaration.signatures[0])
    };
    return definition;
  }

  private parseTypeParameterDefinitions(signature: TypeDocCallSignature): SkyDocsTypeParameterDefinition[] {
    if (!signature.typeParameter) {
      return;
    }

    return signature.typeParameter.map(typeParam => {
      const definition: SkyDocsTypeParameterDefinition = {
        name: typeParam.name,
        type: (typeParam.type) ? this.parseTypeDefinition({ type: typeParam.type }) : undefined
      };
      return definition;
    });
  }

}
