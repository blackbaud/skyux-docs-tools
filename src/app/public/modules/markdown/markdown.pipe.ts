import {
  Pipe,
  PipeTransform
} from '@angular/core';

// See: https://github.com/jvandemo/generator-angular2-library/issues/221
import * as marked_ from 'marked';
const marked = marked_;

@Pipe({
  name: 'skyDocsMarkdown'
})
export class SkyDocsMarkdownPipe implements PipeTransform {

  public transform(markdown: string, parsingMode: 'inline' | 'block' = 'block'): string {
    if (!markdown) {
      return '';
    }

    if (parsingMode === 'inline') {
      return marked.inlineLexer(markdown, []);
    }

    return marked(markdown);
  }

}
