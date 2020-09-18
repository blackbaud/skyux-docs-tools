import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCommentTags
} from './comment-tags';

import {
  SkyDocsJSDocsService
} from './jsdoc.service';

import {
  SkyDocsTypeDefinitionsService
} from './type-definitions.service';

import {
  TypeDocItemMember,
  TypeDocParameter,
  TypeDocType
} from './typedoc-types';

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  constructor(
    private jsDocService: SkyDocsJSDocsService,
    private typeDefinitionService: SkyDocsTypeDefinitionsService
  ) { }

  // public getInterfaceSignature(definition: SkyDocsInterfaceDefinition, config?: {
  //   createAnchorLinks: boolean;
  // }): string {
  //   const typeParameterSignature: string = (definition.typeParameters && definition.typeParameters.length)
  //     ? `<${definition.typeParameters.join(', ')}>`
  //     : '';

  //   let signature: string = `interface ${definition.name}${typeParameterSignature} {`;

  //   definition.properties.forEach((property) => {
  //     const propertyType = (typeof property.type === 'string')
  //       ? property.type
  //       : this.formatCallSignature(property.type.callSignature, {
  //         createAnchorLinks: config.createAnchorLinks
  //       });

  //     const optionalIndicator = (property.isOptional) ? '?' : '';
  //     signature += `\n  ${property.name}${optionalIndicator}: ${propertyType.replace(/\"/g, '\'')};`;
  //   });

  //   signature += '\n}';

  //   return signature;
  // }

  // public getMethodSignatureHTML(method: TypeDocItemMember): string {
  //   // const typeParameterSignature: string = (method.typeParameters && method.typeParameters.length)
  //   //   ? `<${method.typeParameters.join(', ')}>`
  //   //   : '';

  //   let signature = `public ${method.name}${typeParameterSignature}(`;

  //   // if (method.parameters) {
  //   //   signature += method.parameters
  //   //     .map((parameter) => this.getParameterSignature(parameter, {
  //   //       createAnchorLinks: false,
  //   //       escapeSpecialCharacters: false
  //   //     }))
  //   //     .join(', ');
  //   // }

  //   // const returnType = (method.returnType)
  //   //   ? method.returnType
  //   //   : 'void';

  //   // signature += `): ${returnType}`;

  //   return signature;
  // }

  public getParameterSignatureHTML(parameter: TypeDocParameter): string {
    let signature = '';

    const tags = this.jsDocService.parseCommentTags(parameter.comment);

    const isOptional = this.typeDefinitionService.isOptional(parameter, tags);
    const optionalMarker = (isOptional) ? '?' : '';

    const parameterType = this.parseFormattedType(parameter);
    const defaultValue = this.getDefaultValueHTML(parameter, tags);
    const defaultValueFormatted = (defaultValue) ? ` = ${defaultValue}` : '';

    signature = `${parameter.name}${optionalMarker}: ${parameterType}${defaultValueFormatted}`;
    signature = this.escapeSpecialCharacters(signature);

    return signature;
  }

  public getPropertySignatureHTML(item: TypeDocItemMember): string {
    let signature = '';

    if (item.kindString === 'Method') {
      return `${item.name}()`;
    }

    if (item.decorators && item.decorators[0].name) {
      signature += `@${item.decorators[0].name}()<br>`;
    }

    const tags = this.jsDocService.parseCommentTags(item.comment);
    if (tags.deprecationWarning !== undefined) {
      signature += `<strike>${item.name}</strike>`;
    } else {
      signature += item.name;
    }

    const isOptional = this.typeDefinitionService.isOptional(item, tags);
    if (isOptional) {
      signature += '?';
    }

    signature += `: ${this.parseFormattedType(item)}`;

    return signature;
  }

  public getDefaultValueHTML(item: TypeDocItemMember, tags: SkyDocsCommentTags): string {
    const defaultValue: string = tags.defaultValue || item.defaultValue || '';
    return this.escapeSpecialCharacters(defaultValue.replace(/\"/g, '\''));
  }

  public parseFormattedType(item: TypeDocItemMember): string {
    let formatted = 'any';

    const kindString = item.kindString;
    /*tslint:disable-next-line:switch-default*/
    switch (kindString) {
      case 'Method':
        const typeArguments = this.parseTypeArguments(item);
        const returnType = this.parseFormattedType(item.signatures[0]) || 'void';
        const params = item.signatures[0].parameters.map(p => this.getParameterSignatureHTML(p)).join(', ');
        formatted = `public ${item.name}${typeArguments}(${params}): ${returnType}`;
        break;

      case 'Call signature': // <-- move up?
      case 'Parameter':
      case 'Property':
        const typeConfig = item.type;
        // Parse call signature types.
        if (typeConfig.type === 'reflection') {
          formatted = this.getCallSignatureHTML(item);
        }

        // Parse union types.
        if (typeConfig.type === 'union') {
          return this.parseUnionType(typeConfig);
        }

        // Parse primitive types.
        if (typeConfig.name) {
          formatted = typeConfig.name;
        } else {
          const elementType = typeConfig.elementType;
          /*istanbul ignore else*/
          if (elementType?.name) {
            formatted = elementType.name;
          }
        }

        formatted += this.parseTypeArguments(item);

        // Format array types.
        if (typeConfig.type === 'array') {
          formatted += '[]';
        }

        break;

      case 'Accessor':
        /*istanbul ignore else*/
        if (item.setSignature) {
          formatted = this.parseFormattedType(item.setSignature[0].parameters[0]);
        } else if (item.getSignature) {
          formatted = this.parseFormattedType(item.getSignature[0]);
        }
        break;
    }

    return this.escapeSpecialCharacters(formatted);
  }

  // TODO: Add this logic to the parseFormattedType method?
  private getCallSignatureHTML(item: TypeDocItemMember): string {
    const callSignatures = item.type.declaration.signatures;
    const returnType = this.parseFormattedType(callSignatures[0]) || 'void';

    if (!callSignatures[0].parameters) {
      return `() => ${returnType}`;
    }

    const paramSignatures = callSignatures[0].parameters.map(p => {
      return this.getParameterSignatureHTML(p);
    }).join(', ');

    return `(${paramSignatures}) => ${returnType}`;
  }

  private parseUnionType(typeConfig: TypeDocType): string {
    return typeConfig.types.map(t => this.parseFormattedType({ type: t })).join(' | ');
  }

  /**
   * Parse any type arguments e.g. `<T, F>`.
   */
  private parseTypeArguments(item: TypeDocItemMember): string {
    const typeConfig = item.type;
    if (!typeConfig || !typeConfig.typeArguments) {
      return '';
    }
    const typeArguments = typeConfig.typeArguments.map((typeArgument) => {
    if (typeArgument.type === 'array') {
      return `${typeArgument.elementType.name}[]`;
    } else if (typeArgument.type === 'union') {
      return this.parseUnionType(typeArgument);
    }
    return typeArgument.name;
  });

  return `<${typeArguments.join(', ')}>`;
  }

  // public getTypeAliasSignature(
  //   definition: SkyDocsTypeAliasIndexSignatureDefinition |
  //     SkyDocsTypeAliasFunctionDefinition |
  //     SkyDocsTypeAliasUnionDefinition,
  //   config: {
  //     createAnchorLinks: boolean;
  //   } = {
  //     createAnchorLinks: true
  //   }
  // ): string {
  //   let signature = `type ${definition.name} = `;

  //   // Function type
  //   if ('returnType' in definition) {
  //     signature += this.formatCallSignature(definition, {
  //       createAnchorLinks: config.createAnchorLinks
  //     });
  //   }

  //   // Index signature
  //   if ('keyName' in definition) {
  //     signature += `{ [${definition.keyName}: string]: ${definition.valueType} }`;
  //   }

  //   // Union type
  //   if ('types' in definition) {
  //     signature += definition.types.join(' | ');
  //   }

  //   return signature;
  // }

  private escapeSpecialCharacters(value: string): string {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // private formatCallSignature(definition: {
  //   parameters?: SkyDocsParameterDefinition[];
  //   returnType?: SkyDocsTypeDefinition;
  // }, config?: {
  //   createAnchorLinks?: boolean;
  // }): string {
  //   const parameters = (definition.parameters)
  //     ? definition.parameters.map(p => this.getParameterSignature(p, config))
  //     : [];

  //   return `(${parameters.join(', ')}) => ${definition.returnType}`;
  // }

}
