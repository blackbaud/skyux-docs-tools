import {
  Injectable
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

@Injectable()
export class SkyDocsAnchorLinkService {

  private anchorIds: {[_: string]: string};

  constructor(
    typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) {
    this.anchorIds = typeDefinitionsProvider.anchorIds;
  }

  public applyTypeAnchorLinks(content: string): string {
    if (!this.anchorIds) {
      return content;
    }

    // For backwards compatibility, we need to remove any double brackets wrapped around types.
    // e.g., `[[SampleType]]`
    const match = content.match(/\[\[.*\]\]/);
    if (match) {
      const typeName = match[0].replace('[[', '').replace(']]', '');
      content = content.replace(match[0], typeName);
    }

    const matchingTypes = Object.keys(this.anchorIds)
      .filter(typeName => new RegExp(typeName).test(content));

    let html: string;
    if (matchingTypes.length) {

      // Sort by longest name to prevent replacement of name fragments that are shared with other shorter type names.
      matchingTypes.sort((a, b) => b.length - a.length);

      const typeName = matchingTypes[0];
      const anchorId = this.anchorIds[typeName];
      const anchorHtml = `<a href="#${anchorId}" class="sky-docs-anchor-link">${typeName}</a>`;

      html = content.replace(typeName, anchorHtml);
    } else {
      html = content;
    }

    return html;
  }

}
