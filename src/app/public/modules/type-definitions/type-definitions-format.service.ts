import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCommentTags
} from './comment-tags';

import {
  isTypeOptional
} from './is-type-optional';

import {
  SkyDocsJSDocsService
} from './jsdoc.service';

import {
  TypeDocEntry,
  TypeDocEntryChild,
  TypeDocParameter,
  TypeDocType
} from './typedoc-types';

interface ParseFormattedTypeConfig {
  escapeSpecialCharacters: boolean;
}

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  constructor(
    private jsDocService: SkyDocsJSDocsService
  ) { }

  /**
   * Returns an HTML-formatted representation of the provided type alias config.
   */
  public parseTypeAliasSourceCodeSignature(entry: TypeDocEntry): string {
    const entryType = entry.type;

    let signature: string = `type ${entry.name} = `;
    if (entryType.declaration?.signatures) {
      signature += this.parseFormattedCallSignature(entryType, { escapeSpecialCharacters: false });
    } else if (entryType.declaration?.indexSignature) {
      const indexSignature = entryType.declaration.indexSignature[0];
      const param = indexSignature.parameters[0];
      signature += `{\n  [${param.name}: ${this.parseFormattedType(param)}]: ${this.parseFormattedType(indexSignature)};\n}`;
    } else if (entryType.type === 'union') {
      signature += this.parseUnionType(entryType);
    }

    return signature;
  }

  /**
   * Returns an HTML-formatted representation of the provided interface config.
   */
  public parseInterfaceSourceCodeSignature(entry: TypeDocEntry): string {
    const typeParameterSignature = this.parseTypeArguments(entry.type);

    let signature: string = `interface ${entry.name}${typeParameterSignature} {`;

    entry.children.forEach(property => {
      const tags = this.jsDocService.parseCommentTags(property.comment);
      const optionalIndicator = (isTypeOptional(property, tags)) ? '?' : '';
      const propertyType = this.parseFormattedType(property, {
        escapeSpecialCharacters: false
      });

      signature += `\n  ${property.name}${optionalIndicator}: ${propertyType};`;
    });

    signature += '\n}';

    return signature;
  }

  /**
   * Returns a formatted string representing a parameter's name and value. For example: `'foo: string'`.
   */
  public parseFormattedParameterName(
    parameter: TypeDocParameter,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    let signature = '';

    const tags = this.jsDocService.parseCommentTags(parameter.comment);
    const optionalMarker = isTypeOptional(parameter, tags) ? '?' : '';
    const parameterType = this.parseFormattedType(parameter, config);

    signature = `${parameter.name}${optionalMarker}: ${parameterType}`;

    if (config.escapeSpecialCharacters) {
      signature = this.escapeSpecialCharacters(signature);
    }

    return signature;
  }

  /**
   * Returns a formatted string representing a property (or method's) name and value. For example: `'public foo: string'`.
   */
  public parseFormattedPropertyName(item: TypeDocEntryChild): string {
    let signature = '';

    if (item.kindString === 'Enumeration member') {
      return item.name;
    }

    if (item.kindString === 'Method') {
      return `${item.name}()`;
    }

    const decorators = item.decorators && item.decorators[0];

    if (decorators) {
      signature += `@${decorators.name}()<br>`;
    }

    // Use the Input's bound property name, if found.
    // e.g. @Input('foobar')
    const name = (decorators?.arguments?.bindingPropertyName)
      ? decorators?.arguments?.bindingPropertyName.replace(/(\'|\")/g, '')
      : item.name;

    const tags = this.jsDocService.parseCommentTags(item.comment);
    if (tags.deprecationWarning !== undefined) {
      signature += `<strike>${name}</strike>`;
    } else {
      signature += name;
    }

    if (isTypeOptional(item, tags)) {
      signature += '?';
    }

    signature += `: ${this.parseFormattedType(item)}`;

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
    item: TypeDocEntryChild,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    let formatted = 'any';

    const kindString = item.kindString;
    switch (kindString) {
      case 'Method':
        const typeArguments = this.parseTypeArguments(item.type);
        const returnType = this.parseFormattedType(item.signatures[0], config) || 'void';
        let params: string = '';
        if (item.signatures[0].parameters) {
          params += '\n  ';
          params += item.signatures[0].parameters
            .map(p => this.parseFormattedParameterName(p, config))
            .join(',\n  ');
          params += '\n';
        }
        formatted = `public ${item.name}${typeArguments}(${params}): ${returnType}`;
        break;

      case 'Call signature':
      case 'Parameter':
      case 'Property':
      default:
        const typeConfig = item.type;
        // Parse call signature types.
        if (typeConfig.type === 'reflection') {
          return this.parseFormattedCallSignature(typeConfig, config);
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

  private parseFormattedCallSignature(
    typeConfig: TypeDocType,
    config: ParseFormattedTypeConfig = {
      escapeSpecialCharacters: true
    }
  ): string {
    const callSignatures = typeConfig.declaration.signatures;
    const returnType = this.parseFormattedType(callSignatures[0], config) || 'void';

    if (!callSignatures[0].parameters) {
      return `() => ${returnType}`;
    }

    const formattedParams = callSignatures[0].parameters
      .map(p => this.parseFormattedParameterName(p, config))
      .join(', ');

    return `(${formattedParams}) => ${returnType}`;
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
