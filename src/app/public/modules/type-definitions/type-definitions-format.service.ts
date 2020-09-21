import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCommentTags
} from './comment-tags';

// import {
//   SkyDocsJSDocsService
// } from './jsdoc.service';

import {
  SkyDocsCallSignatureDefinition,
  SkyDocsClassPropertyDefinition,
  SkyDocsParameterDefinition,
  SkyDocsTypeDefinition
} from './type-definitions';

import {
  TypeDocEntry,
  TypeDocEntryChild
  // TypeDocType
} from './typedoc-types';

interface ParseFormattedTypeConfig {
  escapeSpecialCharacters: boolean;
}

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  // constructor(
  //   private jsDocService: SkyDocsJSDocsService
  // ) { }

  /**
   * Returns an HTML-formatted representation of the provided type alias config.
   */
  public parseTypeAliasSourceCodeSignature(entry: TypeDocEntry): string {
    // const entryType = entry.type;

    let signature: string = `type ${entry.name} = `;
    // if (entryType.declaration?.signatures) {
    //   signature += this.parseFormattedCallSignature(entryType, { escapeSpecialCharacters: false });
    // } else if (entryType.declaration?.indexSignature) {
    //   const indexSignature = entryType.declaration.indexSignature[0];
    //   const param = indexSignature.parameters[0];
    //   signature += `{\n  [${param.name}: ${this.parseFormattedType(param)}]: ${this.parseFormattedType(indexSignature)};\n}`;
    // } else if (entryType.type === 'union') {
    //   signature += this.parseUnionType(entryType);
    // }

    return signature;
  }

  /**
   * Returns an HTML-formatted representation of the provided interface config.
   */
  public parseInterfaceSourceCodeSignature(entry: any): string {
    const typeParameterSignature = this.parseTypeArguments(entry);

    let signature: string = `interface ${entry.name}${typeParameterSignature} {`;

    // entry.children.forEach(property => {
    //   const tags = this.jsDocService.parseCommentTags(property.comment);
    //   const optionalIndicator = (isTypeOptional(property, tags)) ? '?' : '';
    //   const propertyType = this.parseFormattedType(property, {
    //     escapeSpecialCharacters: false
    //   });

    //   signature += `\n  ${property.name}${optionalIndicator}: ${propertyType};`;
    // });

    signature += '\n}';

    return signature;
  }

  /**
   * Returns a formatted string representing a parameter's name and value. For example: `'foo: string'`.
   */
  public parseFormattedParameterName(
    parameter: SkyDocsParameterDefinition,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    const optionalMarker = (parameter.isOptional) ? '?' : '';
    const parameterType = this.parseFormattedType(parameter.type, config);

    let signature = `${parameter.name}${optionalMarker}: ${parameterType}`;
    if (config.escapeSpecialCharacters) {
      signature = this.escapeSpecialCharacters(signature);
    }

    return signature;
  }

  /**
   * Returns a formatted string representing a property (or method's) name and value. For example: `'public foo: string'`.
   */
  public parseFormattedPropertyName(property: SkyDocsClassPropertyDefinition): string {
    let signature = '';

    // if (item.kindString === 'Enumeration member') {
    //   return item.name;
    // }

    // if (item.kindString === 'Method') {
    //   return `${item.name}()`;
    // }

    // const decorators = item.decorators && item.decorators[0];

    if (property.decorator) {
      signature += `@${property.decorator.name}()<br>`;
    }

    // const tags = this.jsDocService.parseCommentTags(item.comment);
    if (property.deprecationWarning !== undefined) {
      signature += `<strike>${property.name}</strike>`;
    } else {
      signature += property.name;
    }

    if (property.isOptional) {
      signature += '?';
    }

    signature += `: ${this.parseFormattedType(property.type)}`;

    return signature;
  }

  /**
   * Returns a formatted string representing a call signature's returned value.
   */
  public parseFormattedDefaultValue(item: TypeDocEntryChild, tags: SkyDocsCommentTags): string {
    const defaultValue: string = tags.defaultValue || item.defaultValue || '';
    return this.escapeSpecialCharacters(defaultValue.replace(/\"/g, '\''));
  }

  /**
   * Returns a formatted string representing the provided type.
   */
  public parseFormattedType(
    type: SkyDocsTypeDefinition,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    let formatted = 'any';

    if (type.callSignature) {
      return this.parseFormattedCallSignature(type.callSignature);
    }

    if (type.name) {
      formatted = type.name;
    }

    if (type.typeArguments) {
      formatted += this.parseTypeArguments(type);
    }

    if (type.type === 'array') {
      formatted += '[]';
    }

    // const kindString = item.kindString;
    // switch (kindString) {
    //   case 'Method':
    //     const typeArguments = this.parseTypeArguments(item.type);
    //     const returnType = this.parseFormattedType(item.signatures[0], config) || 'void';
    //     let params: string = '';
    //     if (item.signatures[0].parameters) {
    //       params += '\n  ';
    //       params += item.signatures[0].parameters
    //         .map(p => this.parseFormattedParameterName(p, config))
    //         .join(',\n  ');
    //       params += '\n';
    //     }
    //     formatted = `public ${item.name}${typeArguments}(${params}): ${returnType}`;
    //     break;

    //   case 'Call signature':
    //   case 'Parameter':
    //   case 'Property':
    //   default:
    //     const typeConfig = item.type;
    //     // Parse call signature types.
    //     if (typeConfig.type === 'reflection') {
    //       return this.parseFormattedCallSignature(typeConfig, config);
    //     }

    //     // Parse union types.
    //     if (typeConfig.type === 'union') {
    //       return this.parseUnionType(typeConfig);
    //     }

    //     // Parse primitive types.
    //     if (typeConfig.name) {
    //       formatted = typeConfig.name;
    //     } else if (typeConfig.elementType) {
    //       formatted = typeConfig.elementType.name;
    //     } else if (typeConfig.type === 'stringLiteral') {
    //       formatted = `'${typeConfig.value}'`;
    //     }

    //     formatted += this.parseTypeArguments(item.type);

    //     // Format array types.
    //     if (typeConfig.type === 'array') {
    //       formatted += '[]';
    //     }

    //     break;

    //   case 'Accessor':
    //     if (item.setSignature) {
    //       formatted = this.parseFormattedType(item.setSignature[0].parameters[0], config);
    //     } else if (item.getSignature) {
    //       formatted = this.parseFormattedType(item.getSignature[0], config);
    //     }
    //     break;
    // }

    if (config.escapeSpecialCharacters) {
      return this.escapeSpecialCharacters(formatted);
    }

    return formatted;
  }

  public escapeSpecialCharacters(value: string): string {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private parseFormattedCallSignature(
    callSignature: SkyDocsCallSignatureDefinition,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    const returnType = this.parseFormattedType(callSignature.returnType, config) || 'void';

    if (!callSignature.parameters) {
      return `() => ${returnType}`;
    }

    const formattedParams = callSignature.parameters
      .map(p => this.parseFormattedParameterName(p, config))
      .join(', ');

    return `(${formattedParams}) => ${returnType}`;
  }

  private parseUnionType(typeConfig: SkyDocsTypeDefinition): string {
    return typeConfig.unionTypes.map(t => {
      return this.parseFormattedType(t);
    }).join(' | ');
  }

  /**
   * Parse any type arguments e.g. `<T, F>`.
   */
  private parseTypeArguments(typeConfig: SkyDocsTypeDefinition): string {
    if (!typeConfig.typeArguments) {
      return '';
    }

    const typeArguments = typeConfig.typeArguments.map(typeArgument => {
      if (typeArgument.type.type === 'array') {
        return `${typeArgument.type.name}[]`;
      }

      if (typeArgument.type.unionTypes) {
        return this.parseUnionType(typeArgument.type);
      }

      return typeArgument.name;
    });

    return `<${typeArguments.join(', ')}>`;
  }

}
