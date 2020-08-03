import {
  Injectable
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

/**
 * Finds any type name that is NOT surrounded by alpha-numeric (and '>', '<', '.') characters.
 * (This is to avoid matching types that share similar words, such as `Foo` and `FooUser`.)
 * Notes:
 *  - If the type name is surrounded by angle brackets, then it has already been processed as a link.
 *  - If the type name starts with a period '.', then it is a sub property of an enumeration, etc. and should not be processed as a link.
 */
function createRegex(keyword: string): RegExp {
  return new RegExp(`(^|(?<=[^a-zA-Z0-9>.&lt;[/]+))(${keyword})(\\.\\w+)?(?=[^a-zA-Z0-9<])`, 'g');
}

@Injectable()
export class SkyDocsAnchorLinkService {

  private anchorIds: {[_: string]: string};

  constructor(
    typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) {
    this.anchorIds = typeDefinitionsProvider.anchorIds;
  }

  public applyTypeAnchorLinks(content: string, addCode: boolean = true): string {
    if (!this.anchorIds || !content) {
      return content;
    }

    content = this.removeDoubleSquareBrackets(content);

    Object.keys(this.anchorIds).forEach((typeName) => {
      content = this.removeBackticks(typeName, content);

      let matches: RegExpExecArray;
      let counter = 0;
      const max = 100;

      let regex = createRegex(typeName);

      do {
        matches = regex.exec(content);
        if (matches) {
          console.log(matches);
          console.log(content);

          let anchorId = this.anchorIds[typeName];
          let anchorHtml = '<a class="sky-docs-anchor-link" href="#' + anchorId + '">' + typeName + '</a>';

          let replacement;
          if (addCode) {
            replacement = '<code>' + anchorHtml + (matches[3] ? matches[3] : '') + '</code>';
          } else {
            replacement = anchorHtml + (matches[3] ? matches[3] : '');
          }

          let contentWithCodeTags = content.substr(0, matches.index) + replacement + content.substr(matches.index + matches[0].length);

          content = contentWithCodeTags;
          console.log(content);
          counter++;
        }
      } while (matches !== null && counter < max);
    });

    return content;
  }

  /**
   * For backwards compatibility, we need to remove any double brackets wrapped around types.
   * e.g., `[[SampleType]]`
   */
  private removeDoubleSquareBrackets(content: string): string {
    const match = content.match(/\[\[.*\]\]/);
    if (match) {
      const typeName = match[0].replace(/\[\[/g, '').replace(/\]\]/g, '');
      content = content.replace(match[0], typeName);
    }
    return content;
  }

  /**
   * Removes backtick characters around known types to prevent
   * the markdown pipe from wrapping them with code elements.
   */
  private removeBackticks(typeName: string, content: string): string {
    const regexp = new RegExp(`\`(${typeName})\``, 'g');
    return content.replace(regexp, typeName);
  }

}
