import { Pipe, PipeTransform } from '@angular/core';

import { marked } from 'marked';

@Pipe({
  name: 'skyDocsMarkdown',
  standalone: false,
})
export class SkyDocsMarkdownPipe implements PipeTransform {
  public transform(markdown: string): string {
    if (!markdown) {
      return '';
    }

    return marked(markdown);
  }
}
