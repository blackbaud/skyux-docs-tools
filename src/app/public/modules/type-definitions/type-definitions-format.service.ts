import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCallSignatureDefinition
} from './call-signature-definition';

import {
  SkyDocsClassPropertyDefinition
} from './class-property-definition';

import {
  SkyDocsInterfaceDefinition
} from './interface-definition';

import {
  SkyDocsClassMethodDefinition
} from './method-definition';

import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsTypeAliasDefinition
} from './type-alias-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

import {
  SkyDocsTypeParameterDefinition
} from './type-parameter-definition';

interface GetFormattedTypeConfig {
  escapeSpecialCharacters: boolean;
}

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  /**
   * Returns an HTML-formatted representation of the provided interface config.
   */
  public getInterfaceSourceCode(definition: SkyDocsInterfaceDefinition): string {
    const typeParameters = this.getFormattedTypeParameters(definition.typeParameters);
    const config = {
      escapeSpecialCharacters: false
    };

    let signature: string = `interface ${definition.name}${typeParameters} {`;

    definition.properties.forEach(property => {
      const indexSignature = property.type.indexSignature;
      const optionalIndicator = (property.isOptional && !indexSignature) ? '?' : '';
      const propertyType = this.getFormattedType(property.type, config);

      let name: string;
      if (indexSignature) {
        name = `[${indexSignature.keyName}: string]`;
      } else {
        name = property.name;
      }

      signature += `\n  ${name}${optionalIndicator}: ${propertyType};`;
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
   * Returns an HTML-formatted representation of the provided type alias config.
   */
  public getTypeAliasSourceCode(definition: SkyDocsTypeAliasDefinition): string {
    const typeParameters = this.getFormattedTypeParameters(definition.typeParameters);

    let signature = `type ${definition.name}${typeParameters} = `;
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
   * Returns a formatted string representing a parameter's name and value. For example: `'foo: string'`.
   */
  public getFormattedParameterName(
    parameter: SkyDocsParameterDefinition,
    config: GetFormattedTypeConfig = {
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

    const indexSignature = property.type?.indexSignature;
    let name: string;
    if (indexSignature) {
      name = `[${indexSignature.keyName}: string]`;
    } else {
      name = property.name;
    }

    if (property.deprecationWarning !== undefined) {
      signature += `<strike>${name}</strike>`;
    } else {
      signature += name;
    }

    if (property.isOptional && !indexSignature) {
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
    config: GetFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    let formatted = 'any';

    if (type.callSignature) {
      return this.getFormattedCallSignature(type.callSignature, config);
    }

    if (type.unionTypes) {
      return this.getFormattedUnion(type);
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
    config: GetFormattedTypeConfig = {
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
