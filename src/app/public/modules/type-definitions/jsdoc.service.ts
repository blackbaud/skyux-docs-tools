import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCommentTags
} from './comment-tags';

import {
  TypeDocComment,
  TypeDocParameter
} from './typedoc-types';

@Injectable()
export class SkyDocsJSDocsService {

  public parseCommentTags(comment: TypeDocComment): SkyDocsCommentTags {
    let codeExample: string;
    let codeExampleLanguage: string = 'markup';
    let deprecationWarning: string;
    let defaultValue: string;
    let description: string = '';
    let parameters: { name: string; description: string }[];

    const extras: {
      [key: string]: any
    } = {};

    if (comment) {
      /*istanbul ignore else*/
      if (comment.tags) {
        comment.tags.forEach(tag => {
          switch (tag.tag) {
            case 'deprecated':
              /*istanbul ignore else*/
              deprecationWarning = tag.text.trim();
              break;

            case 'default':
            case 'defaultvalue':
            case 'defaultValue':
              defaultValue = tag.text.trim();
              break;

            case 'example':
              /*istanbul ignore else*/
              codeExample = tag.text.trim().split('```')[1].trim();
              const language = codeExample.split('\n')[0];
              if (language === 'markup' || language === 'typescript') {
                codeExample = codeExample.slice(language.length).trim();
                codeExampleLanguage = language;
              }
              break;

            case 'param':
              parameters = parameters || [];
              parameters.push({
                name: tag.param,
                description: tag.text.trim()
              });
              break;

            default:
              extras[tag.tag] = tag.text;
              break;
          }
        });
      }

      if (comment.shortText) {
        description = comment.shortText;
      }
    }

    return {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationWarning,
      description,
      extras,
      parameters
    };
  }

  public parseParameterCommentTags(parameter: TypeDocParameter, parentTags: SkyDocsCommentTags): SkyDocsCommentTags {
    const tags = this.parseCommentTags(parameter.comment);
    const paramTags = parentTags.parameters;
    const tagParam = (paramTags) ? paramTags.find((param) => param.name === parameter.name) : undefined;

    return {
      ...tags,
      ...{
        description: tagParam?.description
      }
    };
  }

}
