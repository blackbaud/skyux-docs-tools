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
  TypeDocItem,
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

  public getTypeAliasSignatureHTML(item: TypeDocItem): string {
    let signature: string = `type ${item.name} = `;

    if (item.type.declaration?.signatures) {
      signature += this.getCallSignatureHTML(item.type, { escapeSpecialCharacters: false });
    } else if (item.type.declaration?.indexSignature) {
      const indexSignature = item.type.declaration.indexSignature[0];
      const param = indexSignature.parameters[0];
      signature += `{\n  [${param.name}: ${this.parseFormattedType(param)}]: ${this.parseFormattedType(indexSignature)};\n}`;
    } else if (item.type.type === 'union') {
      signature += this.parseUnionType(item.type);
    }

    return signature;
  }

  public getInterfaceSignatureHTML(item: TypeDocItem): string {
    const typeParameterSignature = this.parseTypeArguments(item.type);

    let signature: string = `interface ${item.name}${typeParameterSignature} {`;

    item.children.forEach(property => {
      const tags = this.jsDocService.parseCommentTags(property.comment);
      const isOptional = this.typeDefinitionService.isOptional(property, tags);
      const optionalIndicator = (isOptional) ? '?' : '';
      const propertyType = this.parseFormattedType(property, {
        escapeSpecialCharacters: false
      });

      signature += `\n  ${property.name}${optionalIndicator}: ${propertyType};`;
    });

    signature += '\n}';
    return signature;
  }

  public getParameterSignatureHTML(parameter: TypeDocParameter, config: {
    escapeSpecialCharacters: boolean;
  } = {
    escapeSpecialCharacters: true
  }): string {
    let signature = '';

    const tags = this.jsDocService.parseCommentTags(parameter.comment);

    const isOptional = this.typeDefinitionService.isOptional(parameter, tags);
    const optionalMarker = (isOptional) ? '?' : '';

    const parameterType = this.parseFormattedType(parameter, config);
    const defaultValue = this.getDefaultValueHTML(parameter, tags);
    const defaultValueFormatted = (defaultValue) ? ` = ${defaultValue}` : '';

    signature = `${parameter.name}${optionalMarker}: ${parameterType}${defaultValueFormatted}`;

    if (config.escapeSpecialCharacters) {
      signature = this.escapeSpecialCharacters(signature);
    }

    return signature;
  }

  public getPropertySignatureHTML(item: TypeDocItemMember): string {
    let signature = '';

    if (item.kindString === 'Enumeration member') {
      return item.name;
    }

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

  /**
   * TODO: Put all methods in this one? Or have specific ones for code signatures?
   */
  public parseFormattedType(item: TypeDocItemMember, config: {
    escapeSpecialCharacters: boolean;
  } = {
    escapeSpecialCharacters: true
  }): string {
    let formatted = 'any';

    const kindString = item.kindString;
    switch (kindString) {
      case 'Method':
        const typeArguments = this.parseTypeArguments(item.type);
        const returnType = this.parseFormattedType(item.signatures[0], config) || 'void';
        let params: string = '';
        if (item.signatures[0].parameters) {
          params += '\n  ';
          params += item.signatures[0].parameters.map(p => this.getParameterSignatureHTML(p, config)).join(',\n  ');
          params += '\n';
        }
        formatted = `public ${item.name}${typeArguments}(${params}): ${returnType}`;
        break;

      case 'Call signature': // <-- move up?
      case 'Parameter':
      case 'Property':
      default:
        const typeConfig = item.type;
        // Parse call signature types.
        if (typeConfig.type === 'reflection') {
          return this.getCallSignatureHTML(item.type, config);
        }

        // Parse union types.
        if (typeConfig.type === 'union') {
          return this.parseUnionType(typeConfig);
        }

        // Parse primitive types.
        if (typeConfig.name) {
          formatted = typeConfig.name;
        } else if (typeConfig.elementType) {
          formatted = typeConfig.elementType.name;
        } else if (typeConfig.type === 'stringLiteral') {
          formatted = `'${typeConfig.value}'`;
        }

        formatted += this.parseTypeArguments(item.type);

        // Format array types.
        if (typeConfig.type === 'array') {
          formatted += '[]';
        }

        break;

      case 'Accessor':
        /*istanbul ignore else*/
        if (item.setSignature) {
          formatted = this.parseFormattedType(item.setSignature[0].parameters[0], config);
        } else if (item.getSignature) {
          formatted = this.parseFormattedType(item.getSignature[0], config);
        }
        break;
    }

    if (config.escapeSpecialCharacters) {
      return this.escapeSpecialCharacters(formatted);
    }

    return formatted;
  }

  // TODO: Add this logic to the parseFormattedType method?
  private getCallSignatureHTML(typeConfig: TypeDocType, config: {
    escapeSpecialCharacters: boolean;
  } = {
    escapeSpecialCharacters: true
  }): string {
    const callSignatures = typeConfig.declaration.signatures;
    const returnType = this.parseFormattedType(callSignatures[0], config) || 'void';

    if (!callSignatures[0].parameters) {
      return `() => ${returnType}`;
    }

    const paramSignatures = callSignatures[0].parameters.map(p => {
      return this.getParameterSignatureHTML(p, config);
    }).join(', ');

    return `(${paramSignatures}) => ${returnType}`;
  }

  private parseUnionType(typeConfig: TypeDocType): string {
    return typeConfig.types.map(t => {
      return this.parseFormattedType({ type: t });
    }).join(' | ');
  }

  /**
   * Parse any type arguments e.g. `<T, F>`.
   */
  private parseTypeArguments(typeConfig: TypeDocType): string {
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

  private escapeSpecialCharacters(value: string): string {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

}
