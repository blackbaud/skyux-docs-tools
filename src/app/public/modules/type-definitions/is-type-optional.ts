// import {
//   SkyDocsCommentTags
// } from './comment-tags';

// import {
//   TypeDocEntryChild
// } from './typedoc-types';

// /**
//  * Determines if a given TypeDoc type is marked as "optional".
//  */
// export function isTypeOptional(item: TypeDocEntryChild, tags: SkyDocsCommentTags): boolean {

//   // If `@required` is in the comment, mark it as required.
//   if (tags.extras.required) {
//     return false;
//   }

//   // Class methods can't be optional.
//   if (item.kindString === 'Method') {
//     return false;
//   }

//   // Enumeration members can't be optional.
//   if (item.kindString === 'Enumeration member') {
//     return false;
//   }

//   if (item.kindString === 'Parameter') {
//     return !!(item.flags && item.flags.isOptional);
//   }

//   return true;
// }
