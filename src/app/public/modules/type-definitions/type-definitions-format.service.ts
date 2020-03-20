import {
  Injectable
} from '@angular/core';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsMethodDefinition
} from './method-definition';

import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  constructor(
    private anchorLinkService: SkyDocsAnchorLinkService
  ) { }

  public getMethodSignature(method: SkyDocsMethodDefinition): string {
    const typeParameterSignature: string = (method.typeParameters && method.typeParameters.length)
      ? `<${method.typeParameters.join(', ')}>`
      : '';

    let signature = `public ${method.name}${typeParameterSignature}(`;

    if (method.parameters) {
      signature += method.parameters
        .map((parameter) => this.getParameterSignature(parameter, false))
        .join(', ');
    }

    const returnType = (method.returnType)
      ? method.returnType
      : 'void';

    signature += `): ${returnType}`;

    return signature;
  }

  public getParameterSignature(
    parameter: SkyDocsParameterDefinition,
    createAnchorLinks: boolean = true
  ): string {
    const optionalMarker = (parameter.isOptional && !parameter.defaultValue) ? '?' : '';
    const defaultValue = (parameter.defaultValue) ? ` = ${parameter.defaultValue}` : '';
    const parameterType = (createAnchorLinks)
      ? this.anchorLinkService.applyTypeAnchorLinks(parameter.type)
      : parameter.type;

    return `${parameter.name}${optionalMarker}: ${parameterType}${defaultValue}`;
  }

  public getPropertySignature(item: SkyDocsPropertyDefinition): string {
    let signature = '';

    if (item.decorator) {
      signature += `@${item.decorator}()<br />`;
    }

    if (item.deprecationWarning) {
      signature += `<strike>${item.name}</strike>`;
    } else {
      signature += `${item.name}`;
    }

    // Don't use the '?' indicator if the property has a decorator.
    if (item.isOptional && !item.decorator) {
      signature += '?';
    }

    if (item.type) {
      const propertyType = this.anchorLinkService.applyTypeAnchorLinks(item.type);
      signature += `: ${propertyType}`;
    }

    return signature;
  }

}
