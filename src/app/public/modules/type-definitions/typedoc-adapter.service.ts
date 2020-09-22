import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCallSignatureDefinition,
  SkyDocsEnumerationDefinition,
  SkyDocsEnumerationMemberDefinition,
  SkyDocsInterfaceDefinition,
  SkyDocsInterfacePropertyDefinition,
  SkyDocsTypeAliasDefinition
} from './type-definitions';

import {
  TypeDocCallSignature,
  TypeDocComment,
  TypeDocEntry,
  TypeDocEntryChild,
  TypeDocParameter,
  TypeDocType,
  TypeDocTypeParameter
} from './typedoc-types';

import {
  SkyDocsClassPropertyDefinition,
  SkyDocsDirectiveDefinition,
  SkyDocsTypeDefinition,
  SkyDocsParameterDefinition,
  SkyDocsTypeArgumentDefinition,
  SkyDocsClassDefinition,
  SkyDocsClassMethodDefinition,
  SkyDocsTypeParameterDefinition,
  SkyDocsPipeDefinition
} from './type-definitions';

import {
  SkyDocsCommentTags
} from './comment-tags';

import orderBy from 'lodash.orderby';

@Injectable()
export class SkyDocsTypeDocAdapterService {

  public toDirectiveDefinition(entry: TypeDocEntry): SkyDocsDirectiveDefinition {
    const tags = this.getCommentTags(entry.comment);
    const properties = this.getClassProperties(entry);

    const definition: SkyDocsDirectiveDefinition = {
      anchorId: entry.anchorId,
      name: entry.name,
      deprecationWarning: tags.deprecationWarning,
      description: tags.description,
      codeExample: tags.codeExample,
      codeExampleLanguage: tags.codeExampleLanguage,
      selector: this.getSelector(entry),
      inputProperties: properties?.filter(p => p.decorator.name === 'Input'),
      eventProperties: properties?.filter(p => p.decorator.name === 'Output')
    };

    return definition;
  }

  public toClassDefinition(entry: TypeDocEntry): SkyDocsClassDefinition {
    const tags = this.getCommentTags(entry.comment);
    const properties = this.getClassProperties(entry);
    const methods = this.getClassMethods(entry);

    const definition: SkyDocsClassDefinition = {
      anchorId: entry.anchorId,
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

  public toPipeDefinition(entry: TypeDocEntry): SkyDocsPipeDefinition {
    const methods = this.getClassMethods(entry);
    const transformMethod = methods.find(m => m.name === 'transform');
    const tags = this.getCommentTags(entry.comment);

    const definition: SkyDocsPipeDefinition = {
      anchorId: entry.anchorId,
      name: entry.name,
      deprecationWarning: tags.deprecationWarning,
      description: tags.description,
      codeExample: tags.codeExample,
      codeExampleLanguage: tags.codeExampleLanguage,
      transformMethod
    };

    return definition;
  }

  public toInterfaceDefinition(entry: TypeDocEntry): SkyDocsInterfaceDefinition {
    const tags = this.getCommentTags(entry.comment);
    const properties = this.getInterfaceProperties(entry);

    const definition: SkyDocsInterfaceDefinition = {
      anchorId: entry.anchorId,
      name: entry.name,
      deprecationWarning: tags.deprecationWarning,
      description: tags.description,
      codeExample: tags.codeExample,
      codeExampleLanguage: tags.codeExampleLanguage,
      properties
    };

    return definition;
  }

  public toEnumerationDefinition(entry: TypeDocEntry): SkyDocsEnumerationDefinition {
    const tags = this.getCommentTags(entry.comment);
    const members = this.getEnumerationMembers(entry);

    const definition: SkyDocsEnumerationDefinition = {
      anchorId: entry.anchorId,
      name: entry.name,
      deprecationWarning: tags.deprecationWarning,
      description: tags.description,
      codeExample: tags.codeExample,
      codeExampleLanguage: tags.codeExampleLanguage,
      members
    };

    return definition;
  }

  public toTypeAliasDefinition(entry: TypeDocEntry): SkyDocsTypeAliasDefinition {
    const tags = this.getCommentTags(entry.comment);
    const definition: SkyDocsTypeAliasDefinition = {
      anchorId: entry.anchorId,
      name: entry.name,
      deprecationWarning: tags.deprecationWarning,
      description: tags.description,
      codeExample: tags.codeExample,
      codeExampleLanguage: tags.codeExampleLanguage,
      type: this.getTypeDefinition({
        comment: entry.comment,
        type: entry.type
      }),
      typeParameters: this.getTypeParameterDefinitions(entry.typeParameter)
    };

    return definition;
  }

  private getSelector(entry: TypeDocEntry): string {
    if (!entry) {
      return '';
    }

    const decoratorSource = entry.decorators[0].arguments.obj;
    return (decoratorSource.indexOf('selector: `') > -1)
      ? decoratorSource.split('selector: `')[1].split('`')[0].replace(/\s\s+/g, ' ')
      : decoratorSource.split('selector: \'')[1].split('\'')[0];
  }

  private getClassProperties(entry: TypeDocEntry): SkyDocsClassPropertyDefinition[] {
    if (!entry.children) {
      return [];
    }

    const definitions = entry.children
      .filter(child => child.kindString === 'Property' || child.kindString === 'Accessor')
      .map(child => {
        const tags = this.getCommentTags(child.comment);

        const definition: SkyDocsClassPropertyDefinition = {
          codeExample: tags.codeExample,
          codeExampleLanguage: tags.codeExampleLanguage,
          decorator: {
            name: this.getDecoratorName(child)
          },
          defaultValue: this.getDefaultValue(child, tags),
          deprecationWarning: tags.deprecationWarning,
          description: tags.description,
          name: this.getPropertyName(child),
          isOptional: this.isTypeOptional(child, tags),
          type: this.getTypeDefinition(child)
        };

        return definition;
      });

    return orderBy(
      definitions,
      ['isOptional', 'name'],
      ['asc', 'asc']
    );
  }

  private getClassMethods(entry: TypeDocEntry): SkyDocsClassMethodDefinition[] {
    if (!entry.children) {
      return [];
    }

    const methods = entry.children
      .filter(child => child.kindString === 'Method' && /^ng/.test(child.name) === false)
      .map(child => {
        // Comments for methods are stored in a different location.
        const comment = child.signatures[0].comment;
        const tags = this.getCommentTags(comment);

        const method: SkyDocsClassMethodDefinition = {
          codeExample: tags.codeExample,
          codeExampleLanguage: tags.codeExampleLanguage,
          deprecationWarning: tags.deprecationWarning,
          description: tags.description,
          name: this.getPropertyName(child),
          type: this.getTypeDefinition(child),
          typeParameters: this.getTypeParameterDefinitions(child.signatures[0].typeParameter)
        };

        return method;
      });

    return orderBy(
      methods,
      ['name'],
      ['asc']
    );
  }

  private getInterfaceProperties(entry: TypeDocEntry): SkyDocsInterfacePropertyDefinition[] {
    if (!entry.children) {
      return [];
    }

    const definitions = entry.children.map(child => {
      const tags = this.getCommentTags(child.comment);
      const definition: SkyDocsInterfacePropertyDefinition = {
        codeExample: tags.codeExample,
        codeExampleLanguage: tags.codeExampleLanguage,
        deprecationWarning: tags.deprecationWarning,
        description: tags.description,
        name: this.getPropertyName(child),
        isOptional: this.isTypeOptional(child, tags),
        type: this.getTypeDefinition(child)
      };

      return definition;
    });

    return orderBy(
      definitions,
      ['isOptional', 'name'],
      ['asc', 'asc']
    );
  }

  private getEnumerationMembers(entry: TypeDocEntry): SkyDocsEnumerationMemberDefinition[] {
    const definitions: SkyDocsEnumerationMemberDefinition[] = entry.children?.map(child => {
      const tags = this.getCommentTags(child.comment);
      const definition: SkyDocsEnumerationMemberDefinition = {
        name: child.name,
        codeExample: tags.codeExample,
        codeExampleLanguage: tags.codeExampleLanguage,
        deprecationWarning: tags.deprecationWarning,
        description: tags.description
      };
      return definition;
    });
    return definitions;
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

  private getDecoratorName(child: TypeDocEntryChild): string {
    return child.decorators && child.decorators[0] && child.decorators[0].name;
  }

  private getPropertyName(property: TypeDocEntryChild): string {
    const decorators = property.decorators && property.decorators[0];
    // Use the Input's bound property name, if found.
    // e.g. @Input('foobar')
    return (decorators?.arguments?.bindingPropertyName)
      ? decorators?.arguments?.bindingPropertyName.replace(/(\'|\")/g, '')
      : property.name;
  }

  private getDefaultValue(child: TypeDocEntryChild, tags: SkyDocsCommentTags): string {
    return tags.defaultValue || child.defaultValue || '';
  }

  private getTypeDefinition(child: TypeDocEntryChild): SkyDocsTypeDefinition {
    let callSignature: any;

    const kindString = child.kindString;
    switch (kindString) {
      case 'Accessor':
        if (child.setSignature) {
          return this.getTypeDefinition(child.setSignature[0].parameters[0]);
        } else {
          return this.getTypeDefinition(child.getSignature[0]);
        }

      case 'Method':
        callSignature = {
          parameters: this.getParameterDefinitions(child.signatures[0], this.getCommentTags(child.comment)),
          returnType: this.getTypeDefinition(child.signatures[0])
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
          definition.unionTypes = child.type.types.map(t => this.getTypeDefinition({ type: t }));
        }

        // Parse call signature types.
        if (child.type.type === 'reflection') {
          if (child.type.declaration?.signatures) {
            definition.callSignature = this.getCallSignatureDefinition(child);
          } else {
            const indexSignature = child.type.declaration.indexSignature[0];
            definition.indexSignature = {
              keyName: indexSignature.parameters[0].name,
              type: this.getTypeDefinition(indexSignature)
            };
          }
        }

        if (child.type.typeArguments) {
          definition.typeArguments = this.getTypeArgumentDefinitions(child.type);
        }

        return definition;
    }
  }

  private getParameterDefinitions(
    callSignature: TypeDocCallSignature,
    parentTags: SkyDocsCommentTags
  ): SkyDocsParameterDefinition[] {
    const parameters: SkyDocsParameterDefinition[] = callSignature.parameters?.map(p => {
      const tags = this.getParameterCommentTags(p, parentTags);
      const defaultValue = this.getDefaultValue(p, tags);
      const parameter: SkyDocsParameterDefinition = {
        name: p.name,
        defaultValue,
        description: tags.description,
        isOptional: !!(defaultValue || this.isTypeOptional(p, tags)),
        type: this.getTypeDefinition(p),
        typeArguments: this.getTypeArgumentDefinitions(p.type)
      };
      return parameter;
    });

    return parameters;
  }

  private getTypeArgumentDefinitions(typeConfig: TypeDocType): SkyDocsTypeArgumentDefinition[] {
    if (!typeConfig || !typeConfig.typeArguments) {
      return;
    }

    return typeConfig.typeArguments.map((typeArgument) => {
      const definition: SkyDocsTypeArgumentDefinition = {
        name: typeArgument.elementType?.name || typeArgument.name,
        type: this.getTypeDefinition({ type: typeArgument })
      };
      return definition;
    });
  }

  private getCallSignatureDefinition(child: TypeDocEntryChild): SkyDocsCallSignatureDefinition {
    const definition: SkyDocsCallSignatureDefinition = {
      parameters: this.getParameterDefinitions(child.type.declaration.signatures[0], this.getCommentTags(child.comment)),
      returnType: this.getTypeDefinition(child.type.declaration.signatures[0])
    };
    return definition;
  }

  private getTypeParameterDefinitions(typeParameters: TypeDocTypeParameter[]): SkyDocsTypeParameterDefinition[] {
    if (!typeParameters) {
      return;
    }

    return typeParameters.map(typeParam => {
      const definition: SkyDocsTypeParameterDefinition = {
        name: typeParam.name,
        type: (typeParam.type)
          ? this.getTypeDefinition({
            type: typeParam.type
          })
          : undefined
      };
      return definition;
    });
  }

  private getCommentTags(comment: TypeDocComment): SkyDocsCommentTags {
    let codeExample: string;
    let codeExampleLanguage: string = 'markup';
    let deprecationWarning: string;
    let defaultValue: string;
    let description: string = '';

    let parameters: {
      name: string;
      description: string
    }[];

    const extras: {
      [key: string]: any
    } = {};

    if (comment) {
      if (comment.tags) {
        comment.tags.forEach(tag => {
          switch (tag.tag) {
            case 'deprecated':
              deprecationWarning = tag.text.trim();
              break;

            case 'default':
            case 'defaultvalue':
            case 'defaultValue':
              defaultValue = tag.text.trim();
              break;

            case 'example':
              codeExample = tag.text.trim().split('```')[1].trim();
              const language = codeExample.split('\n')[0];
              if (language === 'markup' || language === 'typescript') {
                codeExample = codeExample.slice(language.length).trim();
                codeExampleLanguage = language;
              }
              break;

            case 'param':
              parameters = parameters || [];
              parameters.push({
                name: tag.param,
                description: tag.text.trim()
              });
              break;

            default:
              extras[tag.tag] = tag.text;
              break;
          }
        });
      }

      if (comment.shortText) {
        description = comment.shortText;
      } else if (comment.text) {
        description = comment.text;
      }
    }

    return {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationWarning,
      description,
      extras,
      parameters
    };
  }

  /**
   * Parameter descriptions are derived from the parent's (function/method) comment.
   */
  private getParameterCommentTags(parameter: TypeDocParameter, parentTags: SkyDocsCommentTags): SkyDocsCommentTags {
    const tags = this.getCommentTags(parameter.comment);
    const paramTags = parentTags.parameters;
    const tagParam = (paramTags) ? paramTags.find((param) => param.name === parameter.name) : undefined;

    if (!tagParam || !tagParam.description) {
      return tags;
    }

    return {
      ...tags,
      ...{
        description: tagParam.description
      }
    };
  }

}
