export interface SkyDocsCommentTags {

  codeExample: string;

  codeExampleLanguage: string;

  defaultValue: string;

  deprecationWarning: string;

  description: string;

  parameters?: {
    name: string;
    description: string;
  }[];

  extras?: {
    [key: string]: any;
  };

}
