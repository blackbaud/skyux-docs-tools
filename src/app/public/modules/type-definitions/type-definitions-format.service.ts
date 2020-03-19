import {
  Injectable
} from '@angular/core';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsMethodDefinition,
  SkyDocsParameterDefinition,
  SkyDocsPropertyDefinition
} from './type-definitions';

@Injectable()
export class SkyDocsTypeDefinitionsFormatService {

  constructor(
    private anchorLinkService: SkyDocsAnchorLinkService
  ) { }

  public getMethodSignature(method: SkyDocsMethodDefinition): string {
    let signature = `public ${method.name}(`;

    if (method.parameters.length) {
      const parameters: string[] = [];
      method.parameters.forEach((parameter) => {
        const optionalMarker = (parameter.defaultValue || parameter.isOptional) ? '?' : '';
        const defaultValue = (parameter.defaultValue) ? ` = ${parameter.defaultValue}` : '';
        parameters.push(
          `${parameter.name}${optionalMarker}: ${parameter.type}${defaultValue}`
        );
      });

      signature += parameters.join(', ');
    }

    signature += `): ${method.returnType}`;

    return signature;
  }

  public getParameterSignature(item: SkyDocsParameterDefinition): string {
    let signature: string = item.name || '';

    if (item.isOptional) {
      signature += '?';
    }

    if (item.type) {
      if (item.name) {
        signature += ': ';
      }
      const parameterType = this.anchorLinkService.wrapWithAnchorLink(item.type);
      signature += parameterType;
    }

    return signature;
  }

  public getPropertySignature(item: SkyDocsPropertyDefinition): string {
    let signature = `${item.name}`;

    // Don't use the '?' indicator if the property has a decorator.
    if (item.isOptional && !item.decorator) {
      signature += '?';
    }

    if (item.type) {
      const propertyType = this.anchorLinkService.wrapWithAnchorLink(item.type);
      signature += `: ${propertyType}`;
    }

    return signature;
  }

}
