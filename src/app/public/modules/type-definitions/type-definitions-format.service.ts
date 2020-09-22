import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCallSignatureDefinition,
  SkyDocsClassMethodDefinition,
  SkyDocsClassPropertyDefinition,
  SkyDocsInterfaceDefinition,
  SkyDocsParameterDefinition,
  SkyDocsTypeAliasDefinition,
  SkyDocsTypeDefinition,
  SkyDocsTypeParameterDefinition
} from './type-definitions';

interface ParseFormattedTypeConfig {
  escapeSpecialCharacters: boolean;
}

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  /**
   * Returns an HTML-formatted representation of the provided type alias config.
   */
  public getTypeAliasSourceCode(definition: SkyDocsTypeAliasDefinition): string {
    const typeParameters = this.getFormattedTypeParameters(definition.typeParameters);
    let signature: string = `type ${definition.name}${typeParameters} = `;
    if (definition.type.callSignature) {
      signature += this.getFormattedCallSignature(definition.type.callSignature, {
        escapeSpecialCharacters: false
      });
    } else if (definition.type.indexSignature) {
      const indexSignature = definition.type.indexSignature;
      const type = this.getFormattedType(indexSignature.type, {
        escapeSpecialCharacters: false
      });
      signature += `{\n  [${indexSignature.keyName}: string]: ${type};\n}`;
    } else if (definition.type.type === 'union') {
      signature += this.getFormattedUnion(definition.type);
    }
    return signature;
  }

  /**
   * Returns an HTML-formatted representation of the provided interface config.
   */
  public getInterfaceSourceCode(definition: SkyDocsInterfaceDefinition): string {
    const typeParameters = this.getFormattedTypeArguments(definition);

    let signature: string = `interface ${definition.name}${typeParameters} {`;

    definition.properties.forEach(property => {
      const optionalIndicator = (property.isOptional) ? '?' : '';
      const propertyType = this.getFormattedType(property.type, {
        escapeSpecialCharacters: false
      });

      signature += `\n  ${property.name}${optionalIndicator}: ${propertyType};`;
    });

    signature += '\n}';

    return signature;
  }

  public getMethodSourceCode(definition: SkyDocsClassMethodDefinition): string {
    const config = {
      escapeSpecialCharacters: false
    };

    const typeArguments = this.getFormattedTypeArguments(definition.type);
    const callSignature = definition.type.callSignature;
    const returnType = this.getFormattedType(callSignature.returnType, config) || 'void';

    let params: string = '';
    if (callSignature.parameters) {
      params += '\n  ';
      params += callSignature.parameters
        .map(p => this.getFormattedParameterName(p, config))
        .join(',\n  ');
      params += '\n';
    }

    return `public ${definition.name}${typeArguments}(${params}): ${returnType}`;
  }

  /**
   * Returns a formatted string representing a parameter's name and value. For example: `'foo: string'`.
   */
  public getFormattedParameterName(
    parameter: SkyDocsParameterDefinition,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    const optionalMarker = (parameter.isOptional) ? '?' : '';
    const parameterType = this.getFormattedType(parameter.type, config);

    let signature = `${parameter.name}${optionalMarker}: ${parameterType}`;
    if (config.escapeSpecialCharacters) {
      signature = this.escapeSpecialCharacters(signature);
    }

    return signature;
  }

  /**
   * Returns a formatted string representing a property (or method's) name and value. For example: `'public foo: string'`.
   */
  public getFormattedPropertyName(property: SkyDocsClassPropertyDefinition): string {
    let signature = '';

    if (property.decorator?.name) {
      signature += `@${property.decorator.name}()<br>`;
    }

    if (property.deprecationWarning !== undefined) {
      signature += `<strike>${property.name}</strike>`;
    } else {
      signature += property.name;
    }

    if (property.isOptional) {
      signature += '?';
    }

    if (property.type) {
      signature += `: ${this.getFormattedType(property.type)}`;
    }

    return signature;
  }

  public getFormattedMethodName(definition: SkyDocsClassMethodDefinition): string {
    let formatted = '';

    if (definition.deprecationWarning !== undefined) {
      formatted += `<strike>${definition.name}</strike>`;
    } else {
      formatted += definition.name;
    }

    return `${formatted}()`;
  }

  /**
   * Returns a formatted string representing the provided type.
   */
  public getFormattedType(
    type: SkyDocsTypeDefinition,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    let formatted = 'any';

    if (type.callSignature) {
      return this.getFormattedCallSignature(type.callSignature, config);
    }

    if (type.name) {
      formatted = type.name;
    }

    if (type.typeArguments) {
      formatted += this.getFormattedTypeArguments(type);
    }

    if (type.type === 'array') {
      formatted += '[]';
    }

    // const kindString = item.kindString;
    // switch (kindString) {
    //   case 'Method':
    //     const typeArguments = this.parseTypeArguments(item.type);
    //     const returnType = this.getFormattedType(item.signatures[0], config) || 'void';
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
    //       formatted = this.getFormattedType(item.setSignature[0].parameters[0], config);
    //     } else if (item.getSignature) {
    //       formatted = this.getFormattedType(item.getSignature[0], config);
    //     }
    //     break;
    // }

    if (config.escapeSpecialCharacters) {
      return this.escapeSpecialCharacters(formatted);
    }

    return formatted;
  }

  public escapeSpecialCharacters(value: string = ''): string {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private getFormattedCallSignature(
    callSignature: SkyDocsCallSignatureDefinition,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    const returnType = this.getFormattedType(callSignature.returnType, config) || 'void';

    if (!callSignature.parameters) {
      return `() => ${returnType}`;
    }

    const formattedParams = callSignature.parameters
      .map(p => this.getFormattedParameterName(p, config))
      .join(', ');

    return `(${formattedParams}) => ${returnType}`;
  }

  private getFormattedUnion(typeConfig: SkyDocsTypeDefinition): string {
    return typeConfig.unionTypes.map(t => {
      return this.getFormattedType(t);
    }).join(' | ');
  }

  /**
   * Parse any type arguments e.g. `<T, F>`.
   */
  private getFormattedTypeArguments(typeConfig: SkyDocsTypeDefinition): string {
    if (!typeConfig.typeArguments) {
      return '';
    }

    const typeArguments = typeConfig.typeArguments.map(typeArgument => {
      if (typeArgument.type.type === 'array') {
        return `${typeArgument.type.name}[]`;
      }

      if (typeArgument.type.unionTypes) {
        return this.getFormattedUnion(typeArgument.type);
      }

      return typeArgument.name;
    });

    return `<${typeArguments.join(', ')}>`;
  }

  private getFormattedTypeParameters(typeParameters: SkyDocsTypeParameterDefinition[]): string {
    if (!typeParameters) {
      return '';
    }

    const formatted = typeParameters.map(typeParameter => {
      let result = typeParameter.name;
      if (typeParameter.type && typeParameter.type.type === 'reference') {
        result += ` extends ${typeParameter.type.name}`;
      }

      return result;
    });

    return `<${formatted.join(', ')}>`;
  }

}
