import {
  SkyDocsCommentTags
} from './comment-tags';

import {
  TypeDocItemMember
} from './typedoc-types';

export function isOptional(item: TypeDocItemMember, tags: SkyDocsCommentTags): boolean {

  // If `@required` is in the comment, mark it as required.
  if (tags.extras.required) {
    return false;
  }

  // Enumeration members can't be optional.
  if (item.kindString === 'Enumeration member') {
    return false;
  }

  if (item.kindString === 'Parameter') {
    return !!(item.flags && item.flags.isOptional);
  }

  return true;
}
