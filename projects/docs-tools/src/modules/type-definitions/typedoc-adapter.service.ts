import { Injectable, Optional } from '@angular/core';

import { SkyDocsCallSignatureDefinition } from './call-signature-definition';

import { SkyDocsClassDefinition } from './class-definition';

import { SkyDocsClassPropertyDefinition } from './property-definition';

import { SkyDocsCommentTags } from './comment-tags';

import { SkyDocsDirectiveDefinition } from './directive-definition';

import { SkyDocsEnumerationDefinition } from './enumeration-definition';

import { SkyDocsEnumerationMemberDefinition } from './enumeration-member-definition';

import { SkyDocsIndexSignatureDefinition } from './index-signature-definition';

import { SkyDocsInterfaceDefinition } from './interface-definition';

import { SkyDocsInterfacePropertyDefinition } from './interface-property-definition';

import { SkyDocsClassMethodDefinition } from './method-definition';

import { SkyDocsParameterDefinition } from './parameter-definition';

import { SkyDocsPipeDefinition } from './pipe-definition';

import { SkyDocsPropertyDecoratorDefinition } from './property-decorator';

import { SkyDocsTypeAliasDefinition } from './type-alias-definition';

import { SkyDocsTypeDefinition } from './type-definition';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

import { SkyDocsTypeParameterDefinition } from './type-parameter-definition';

import {
  TypeDocComment,
  TypeDocEntry,
  TypeDocEntryChild,
  TypeDocKind,
  TypeDocParameter,
  TypeDocSignature,
  TypeDocType,
  TypeDocTypeParameter,
} from './typedoc-types';

import orderBy from 'lodash.orderby';

/**
 * Converts TypeDoc types into SKY UX docs-tools types, to be supplied to the various definitions components.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyDocsTypeDocAdapterService {
  constructor(
    @Optional()
    private typeDefinitionsProvider?: SkyDocsTypeDefinitionsProvider,
  ) {}

  public toClassDefinition(entry: TypeDocEntry): SkyDocsClassDefinition {
    const definition: SkyDocsClassDefinition = {
      anchorId: this.getAnchorId(entry),
      name: entry.name,
      hasPreviewFeatures: false,
    };

    const tags = this.getCommentTags(entry.comment);
    this.applyCommentTagValues(definition, tags);

    const methods = this.getClassMethods(entry);
    if (methods.length) {
      definition.methods = methods;
    }

    const properties = this.getClassProperties(entry);
    if (properties.length) {
      definition.properties = properties;
    }

    definition.hasPreviewFeatures =
      !!definition.methods?.some((method) => method.isPreview) ||
      !!definition.properties?.some((property) => property.isPreview);

    return definition;
  }

  public toDirectiveDefinition(
    entry: TypeDocEntry,
  ): SkyDocsDirectiveDefinition {
    const definition: SkyDocsDirectiveDefinition = {
      anchorId: this.getAnchorId(entry),
      name: entry.name,
      selector: this.getSelector(entry),
      hasPreviewFeatures: false,
    };

    const tags = this.getCommentTags(entry.comment);
    this.applyCommentTagValues(definition, tags);

    const properties = this.getClassProperties(entry);

    const eventProperties = properties.filter(
      (p) => p.decorator?.name === 'Output',
    );
    if (eventProperties.length) {
      definition.eventProperties = eventProperties;
    }

    const inputProperties = properties.filter((p) => this.#isInputProperty(p));
    if (inputProperties.length) {
      definition.inputProperties = inputProperties;
    }

    definition.hasPreviewFeatures =
      !!definition.inputProperties?.some((property) => property.isPreview) ||
      !!definition.eventProperties?.some((property) => property.isPreview);

    return definition;
  }

  public toEnumerationDefinition(
    entry: TypeDocEntry,
  ): SkyDocsEnumerationDefinition {
    const members = this.getEnumerationMembers(entry);
    const definition: SkyDocsEnumerationDefinition = {
      anchorId: this.getAnchorId(entry),
      members,
      name: entry.name,
      hasPreviewFeatures: !!members.find((member) => member.isPreview),
    };

    const tags = this.getCommentTags(entry.comment);
    this.applyCommentTagValues(definition, tags);

    return definition;
  }

  public toInterfaceDefinition(
    entry: TypeDocEntry,
  ): SkyDocsInterfaceDefinition {
    const properties = this.getInterfaceProperties(entry);
    const definition: SkyDocsInterfaceDefinition = {
      anchorId: this.getAnchorId(entry),
      name: entry.name,
      hasPreviewFeatures: !!properties.find((member) => member.isPreview),
      properties,
    };

    const tags = this.getCommentTags(entry.comment);
    this.applyCommentTagValues(definition, tags);

    const typeParameters = this.getTypeParameterDefinitions(
      entry.typeParameters,
    );
    if (typeParameters.length) {
      definition.typeParameters = typeParameters;
    }

    return definition;
  }

  public toPipeDefinition(entry: TypeDocEntry): SkyDocsPipeDefinition {
    const methods = this.getClassMethods(entry);
    const transformMethod = methods.find((m) => m.name === 'transform');
    const definition: SkyDocsPipeDefinition = {
      anchorId: this.getAnchorId(entry),
      name: entry.name,
      transformMethod,
    };

    const tags = this.getCommentTags(entry.comment);
    this.applyCommentTagValues(definition, tags);

    return definition;
  }

  public toTypeAliasDefinition(
    entry: TypeDocEntry,
  ): SkyDocsTypeAliasDefinition {
    const definition: SkyDocsTypeAliasDefinition = {
      anchorId: this.getAnchorId(entry),
      name: entry.name,
      isPreview: false,
      type: this.getTypeDefinition({
        comment: entry.comment,
        type: entry.type,
      }),
    };

    const tags = this.getCommentTags(
      entry.type.declaration?.signatures
        ? entry.type.declaration.signatures[0].comment
        : entry.comment,
    );
    this.applyCommentTagValues(definition, tags);

    const typeParameters = this.getTypeParameterDefinitions(
      entry.typeParameters,
    );
    if (typeParameters.length) {
      definition.typeParameters = typeParameters;
    }

    return definition;
  }

  private getSelector(entry: TypeDocEntry): string {
    const decoratorSource = entry.decorators[0].arguments.obj;
    return decoratorSource.indexOf('selector: `') > -1
      ? decoratorSource
          .split('selector: `')[1]
          .split('`')[0]
          .replace(/\s\s+/g, ' ')
      : decoratorSource.split("selector: '")[1].split("'")[0];
  }

  private getClassProperties(
    entry: TypeDocEntry,
  ): SkyDocsClassPropertyDefinition[] {
    if (!entry.children) {
      return [];
    }

    const definitions = entry.children
      .filter(
        (child) =>
          // We only want properties (both with or without a getter/setter)
          child.kind === TypeDocKind.Property ||
          child.kind === TypeDocKind.Accessor,
      )
      .filter(
        (child) =>
          // We only want accessors that don't have a setter if they are not inputs
          child.kind !== TypeDocKind.Accessor ||
          child.setSignature ||
          this.getDecorator(child)?.name !== 'Input',
      )
      .map((child) => {
        let definition: SkyDocsClassPropertyDefinition = {
          isOptional: true,
          isPreview: false,
          name: this.getPropertyName(child),
          type: this.getTypeDefinition(child),
        };
        let defaultValue: string;

        /* Ensure we are properly capturing definitions which use a getter/setter. Final check is a sanity check */
        if (
          child.kind === TypeDocKind.Accessor &&
          !child.comment?.summary
            ?.map((item) => item.text)
            .join('')
            .trim() &&
          (child.setSignature || child.getSignature)
        ) {
          const mainTags = this.getCommentTags(child.comment);

          this.applyCommentTagValues(definition, mainTags);

          if (child.getSignature) {
            const getTags = this.getCommentTags(child.getSignature.comment);

            definition.isOptional = !getTags.extras.required;

            this.applyCommentTagValues(definition, getTags);
            defaultValue = this.getDefaultValue(child, getTags);
          }

          if (child.setSignature) {
            const setTags = this.getCommentTags(child.setSignature.comment);

            this.applyCommentTagValues(definition, setTags);

            definition.isOptional =
              definition.isOptional && !setTags.extras.required;
            defaultValue = defaultValue || this.getDefaultValue(child, setTags);
          } else {
            definition.isOptional = !mainTags.extras.required;
            defaultValue = this.getDefaultValue(child, mainTags);
          }
        } else {
          let tags: SkyDocsCommentTags | undefined;
          if (
            child.kind === TypeDocKind.Property &&
            !child.comment?.summary
              ?.map((item) => item.text)
              .join('')
              .trim() &&
            child.type.declaration?.signatures?.length > 0 &&
            child.type.declaration.signatures[0].comment
          ) {
            tags = this.getCommentTags(
              child.type.declaration.signatures[0].comment,
            );

            definition.isOptional = !tags.extras.required;
            this.applyCommentTagValues(definition, tags);
          }

          tags = this.getCommentTags(child.comment);

          definition.isOptional =
            definition.isOptional && !tags.extras.required;

          this.applyCommentTagValues(definition, tags);

          defaultValue = this.getDefaultValue(child, tags);
        }

        if (defaultValue) {
          definition.defaultValue = defaultValue;
        }

        const decorator = this.getDecorator(child);
        if (decorator) {
          definition.decorator = decorator;
        }

        if (!definition.description) {
          const constructor = entry.children.find(
            (child) => child.kind === TypeDocKind.Constructor,
          );
          if (constructor) {
            const signature = constructor.signatures.find(
              (signature) =>
                signature.kind === TypeDocKind.ConstructorSignature,
            );
            /* Sanity check */
            /* istanbul ignore else */
            if (signature) {
              const matchingParam = signature.parameters?.find(
                (parameter) => parameter.name === child.name,
              );
              if (matchingParam) {
                const matchingParamTags = this.getCommentTags(
                  matchingParam.comment,
                );
                this.applyCommentTagValues(definition, matchingParamTags);
              }
            }
          }
        }

        return definition;
      });

    return orderBy(definitions, ['isOptional', 'name'], ['asc', 'asc']);
  }

  private getClassMethods(entry: TypeDocEntry): SkyDocsClassMethodDefinition[] {
    if (!entry.children) {
      return [];
    }

    const methods = entry.children
      .filter(
        (child) =>
          child.kind === TypeDocKind.Method && /^ng/.test(child.name) === false,
      )
      .map((child) => {
        const definition: SkyDocsClassMethodDefinition = {
          name: this.getPropertyName(child),
          type: this.getTypeDefinition(child),
          isStatic: !!child.flags?.isStatic,
          isPreview: false,
          parentName: entry.name,
        };

        // Comments for methods are stored in a different location.
        const comment = child.signatures[0].comment;
        const tags = this.getCommentTags(comment);
        this.applyCommentTagValues(definition, tags);

        const typeParameters = this.getTypeParameterDefinitions(
          child.signatures[0].typeParameters,
        );
        if (typeParameters.length) {
          definition.typeParameters = typeParameters;
        }

        return definition;
      });

    return orderBy(methods, ['name'], ['asc']);
  }

  private getInterfaceProperties(
    entry: TypeDocEntry,
  ): SkyDocsInterfacePropertyDefinition[] {
    if (!entry.children && !entry.indexSignature) {
      return [];
    }

    const definitions =
      entry.children?.map((child) => {
        let tags: SkyDocsCommentTags | undefined;
        if (child.kind === TypeDocKind.Method && child.signatures.length > 0) {
          tags = this.getCommentTags(child.signatures[0].comment);
        } else if (
          child.type.type === 'reflection' &&
          child.type?.declaration?.signatures?.length > 0
        ) {
          tags = this.getCommentTags(
            child.type.declaration.signatures[0].comment,
          );
        } else {
          tags = this.getCommentTags(child.comment);
        }
        const definition: SkyDocsInterfacePropertyDefinition = {
          isOptional: tags.extras.required ? false : !!child.flags?.isOptional,
          isPreview: false,
          name: this.getPropertyName(child),
          type: this.getTypeDefinition(child),
        };

        this.applyCommentTagValues(definition, tags);

        return definition;
      }) || [];

    const sorted = orderBy(definitions, ['isOptional', 'name'], ['asc', 'asc']);

    // Add any index signatures, e.g. `[_: string]: any`
    if (entry.indexSignature) {
      const indexSignature = entry.indexSignature;
      const definition: SkyDocsInterfacePropertyDefinition = {
        isOptional: true,
        isPreview: false,
        name: indexSignature.name,
        type: {
          indexSignature: this.getIndexSignatureDefinition(indexSignature),
        },
      };

      // New versions of typedoc do not seem to add the comment for index signatures - the else statement is a default based on the only index signature we had in September 2023 (SkySelectField).
      if (indexSignature.comment) {
        const tags = this.getCommentTags(indexSignature.comment);
        this.applyCommentTagValues(definition, tags);
      } else {
        definition.description = 'All other properties for an item.';
      }
      sorted.push(definition);
    }

    return sorted;
  }

  private getEnumerationMembers(
    entry: TypeDocEntry,
  ): SkyDocsEnumerationMemberDefinition[] {
    if (!entry.children) {
      return [];
    }

    return entry.children.map((child) => {
      const definition: SkyDocsEnumerationMemberDefinition = {
        name: child.name,
        isPreview: false,
      };

      const tags = this.getCommentTags(child.comment);
      this.applyCommentTagValues(definition, tags);

      return definition;
    });
  }

  private getTypeDefinition(child: TypeDocEntryChild): SkyDocsTypeDefinition {
    let definition: SkyDocsTypeDefinition;

    const kind = child.kind;
    switch (kind) {
      case TypeDocKind.Accessor:
        if (child.setSignature) {
          return this.getTypeDefinition(child.setSignature.parameters[0]);
        }
        return this.getTypeDefinition(child.getSignature);

      case TypeDocKind.Method:
        definition = {
          callSignature: this.getCallSignatureDefinition(
            child.signatures[0],
            this.getCommentTags(child.comment),
          ),
          name: child.signatures[0].name,
        };

        return definition;

      default:
        let name: string =
          child.type.name || child.type.elementType?.name || child.type.value;

        definition = {
          type: child.type.type,
        };

        if (name) {
          definition.name = name;
        }

        // Union?
        if (child.type.types) {
          definition.unionTypes = child.type.types.map((t) =>
            this.getTypeDefinition({ type: t }),
          );
        }

        // Convert reflection types.
        if (
          child.type.type === 'reflection' ||
          child.type.elementType?.type === 'reflection'
        ) {
          const declaration =
            child.type.elementType?.type === 'reflection'
              ? child.type.elementType.declaration
              : child.type.declaration;
          /*istanbul ignore else */
          if (declaration) {
            if (declaration.signatures) {
              definition.callSignature = this.getCallSignatureDefinition(
                declaration.signatures[0],
                this.getCommentTags(child.comment),
              );
            } else if (declaration.indexSignature) {
              const indexSignature = declaration.indexSignature;
              definition.indexSignature =
                this.getIndexSignatureDefinition(indexSignature);
            } /* istanbul ignore else */ else if (declaration.children) {
              definition.typeLiteral = {
                properties: this.getInterfaceProperties({
                  children: declaration.children,
                }),
              };
            }
          }
        }

        if (child.type.type === 'typeOperator') {
          definition.name = `${child.type.operator} ${child.type.target.name}`;
        }

        if (child.type.typeArguments) {
          definition.typeArguments = this.getTypeArgumentDefinitions(
            child.type,
          );
        }

        if (child.type.package) {
          definition.package = child.type.package;
        }

        return definition;
    }
  }

  private getParameterDefinitions(
    callSignature: TypeDocSignature,
    parentTags: SkyDocsCommentTags,
  ): SkyDocsParameterDefinition[] {
    if (!callSignature.parameters) {
      return [];
    }

    const parameters: SkyDocsParameterDefinition[] =
      callSignature.parameters.map((p) => {
        const tags = this.getParameterCommentTags(p, parentTags);
        const defaultValue = this.getDefaultValue(p, tags);
        const typeArguments = this.getTypeArgumentDefinitions(p.type);

        const parameter: SkyDocsParameterDefinition = {
          isOptional: !!(defaultValue || !!p.flags?.isOptional),
          name: p.name,
          type: this.getTypeDefinition(p),
        };

        if (defaultValue !== undefined) {
          parameter.defaultValue = defaultValue;
        }

        if (tags.description) {
          parameter.description = tags.description;
        }

        if (typeArguments.length) {
          parameter.typeArguments = typeArguments;
        }

        return parameter;
      });
    return parameters;
  }

  private getTypeArgumentDefinitions(
    typeConfig: TypeDocType,
  ): SkyDocsTypeDefinition[] {
    if (!typeConfig || !typeConfig.typeArguments) {
      return [];
    }

    return typeConfig.typeArguments.map((typeArgument) => {
      return this.getTypeDefinition({ type: typeArgument });
    });
  }

  private getCallSignatureDefinition(
    callSignature: TypeDocSignature,
    tags: SkyDocsCommentTags,
  ): SkyDocsCallSignatureDefinition {
    const definition: SkyDocsCallSignatureDefinition = {
      returnType: this.getTypeDefinition(callSignature),
    };

    const parameters = this.getParameterDefinitions(callSignature, tags);
    if (parameters.length) {
      definition.parameters = parameters;
    }

    return definition;
  }

  private getIndexSignatureDefinition(
    signature: TypeDocSignature,
  ): SkyDocsIndexSignatureDefinition {
    return {
      key: {
        name: signature.parameters[0].name,
        type: this.getTypeDefinition(signature.parameters[0]),
      },
      type: this.getTypeDefinition(signature),
    };
  }

  private getTypeParameterDefinitions(
    typeParameters: TypeDocTypeParameter[],
  ): SkyDocsTypeParameterDefinition[] {
    if (!typeParameters) {
      return [];
    }

    return typeParameters.map((typeParam) => {
      const definition: SkyDocsTypeParameterDefinition = {
        name: typeParam.name,
      };

      if (typeParam.type) {
        definition.type = this.getTypeDefinition({
          type: typeParam.type,
        });
      }

      return definition;
    });
  }

  private getCommentTags(comment: TypeDocComment): SkyDocsCommentTags {
    let codeExample: string;
    let codeExampleLanguage: string = 'markup';
    let deprecationWarning: string;
    let defaultValue: string;
    let description: string = '';

    let parameters: {
      name: string;
      description: string;
    }[];

    const extras: {
      [key: string]: any;
    } = {};

    if (comment) {
      if (comment.blockTags) {
        comment.blockTags.forEach((tag) => {
          switch (tag.tag) {
            case '@deprecated':
              deprecationWarning = tag.content
                .map((item) => item.text)
                .join('')
                .trim();
              break;

            case '@default':
            case '@defaultValue':
              defaultValue = tag.content
                .map((item) => item.text)
                .join('')
                .trim();

              if (tag.content[0].kind === 'code') {
                defaultValue = defaultValue.split('```')[1].trim();

                const defaultLanguage = defaultValue.split('\n')[0];
                if (
                  defaultLanguage === 'markup' ||
                  defaultLanguage === 'typescript' ||
                  defaultLanguage === 'ts'
                ) {
                  defaultValue = defaultValue
                    .slice(defaultLanguage.length)
                    .trim();
                }
              }
              break;

            case '@example':
              codeExample = tag.content
                .map((item) => item.text)
                .join('')
                .trim()
                .split('```')[1]
                .trim();
              const exampleLanguage = codeExample.split('\n')[0];
              if (
                exampleLanguage === 'markup' ||
                exampleLanguage === 'typescript' ||
                exampleLanguage === 'ts'
              ) {
                codeExample = codeExample.slice(exampleLanguage.length).trim();
                codeExampleLanguage = exampleLanguage;
              }
              break;

            case '@param':
              parameters = parameters || [];
              parameters.push({
                name: tag.param,
                description: tag.content
                  .map((item) => item.text)
                  .join('')
                  .trim(),
              });
              break;
            case '@preview':
              extras['preview'] = true;
              break;
            case '@required':
              extras['required'] = true;
              break;
            /* istanbul ignore next */
            default:
              break;
          }
        });
      }

      description = comment.summary
        ?.map((item) => item.text)
        .join('')
        .trim();
    }

    return {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationWarning,
      description,
      extras,
      parameters,
    };
  }

  /**
   * Parameter descriptions are derived from the parent's (function/method) comment.
   */
  private getParameterCommentTags(
    parameter: TypeDocParameter,
    parentTags: SkyDocsCommentTags,
  ): SkyDocsCommentTags {
    const tags = this.getCommentTags(parameter.comment);
    const paramTags = parentTags.parameters;
    const tagParam = paramTags
      ? paramTags.find((param) => param.name === parameter.name)
      : undefined;

    if (!tagParam || !tagParam.description) {
      return tags;
    }

    return {
      ...tags,
      ...{
        description: tagParam.description,
      },
    };
  }

  /**
   * Applies comment tag (e.g. `@param`) values to the provided definition, if the value is defined.
   */
  private applyCommentTagValues(
    definition: {
      codeExample?: string;
      codeExampleLanguage?: string;
      deprecationWarning?: string;
      description?: string;
      isPreview?: boolean;
    },
    tags: SkyDocsCommentTags,
  ): void {
    if (tags.codeExample) {
      definition.codeExample = tags.codeExample;
      definition.codeExampleLanguage = tags.codeExampleLanguage;
    }

    if (tags.deprecationWarning !== undefined) {
      definition.deprecationWarning = tags.deprecationWarning;
    }

    if (tags.description) {
      definition.description = tags.description;
    }

    if (tags.extras?.preview) {
      definition.isPreview = tags.extras?.preview;
    }
  }

  private getDecorator(
    child: TypeDocEntryChild,
  ): SkyDocsPropertyDecoratorDefinition {
    const name =
      child.decorators && child.decorators[0] && child.decorators[0].name;
    if (name) {
      return { name };
    }
  }

  private getPropertyName(property: TypeDocEntryChild): string {
    const decorators = property.decorators && property.decorators[0];
    // Use the Input's bound property name, if found.
    // e.g. @Input('foobar')
    return decorators?.arguments?.bindingPropertyName
      ? decorators.arguments.bindingPropertyName.replace(/(\'|\")/g, '')
      : property.name;
  }

  private getDefaultValue(
    child: TypeDocEntryChild,
    tags: SkyDocsCommentTags,
  ): string | undefined {
    if (tags.defaultValue) {
      return tags.defaultValue;
    }

    // TypeDoc version 0.20.x stopped auto-generating initializers for the default value
    // (and replaced them with "...") due to the complicated logic it required.
    // See: https://github.com/TypeStrong/typedoc/issues/1552
    if (child.defaultValue === '...') {
      return;
    }

    return child.defaultValue;
  }

  private getAnchorId(entry: TypeDocEntry): string {
    return (
      entry.anchorId ||
      this.typeDefinitionsProvider?.anchorIds[entry.name] ||
      ''
    );
  }

  #isInputProperty(property: SkyDocsClassPropertyDefinition): boolean {
    return (
      property.decorator?.name === 'Input' ||
      (property.type.name === 'InputSignal' &&
        property.type.package === '@angular/core')
    );
  }
}
