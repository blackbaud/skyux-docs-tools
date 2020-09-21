import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsAnchorLinkServiceFormatType
} from './anchor-link-service-format';

/**
 * Adds same-page anchor tags around known TypeScript types.
 */
@Pipe({
  name: 'skyDocsTypeAnchorLinks',
  pure: true
})
export class SkyDocsTypeAnchorLinksPipe implements PipeTransform {

  constructor(
    private anchorLinkService: SkyDocsAnchorLinkService
  ) { }

  public transform(
    value: string,
    formatType?: SkyDocsAnchorLinkServiceFormatType
  ): string {
    return this.anchorLinkService.applyTypeAnchorLinks(value, {
      applyCodeFormatting: (formatType !== 'no-code-tags')
    });
  }

}
