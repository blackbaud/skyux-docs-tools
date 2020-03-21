import {
 SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Anchor link service', function () {

  let mockTypeDefinitionsProvider: SkyDocsTypeDefinitionsProvider;

  beforeEach(() => {
    mockTypeDefinitionsProvider = {
      anchorIds: {
        'FooComponent': 'foo-component',
        'Foo': 'foo',
        'FooUser': 'foo-user'
      },
      typeDefinitions: [
        {
          name: 'FooComponent'
        },
        {
          name: 'Foo'
        },
        {
          name: 'FooUser'
        }
      ]
    };
  });

  it('should add anchor links to known types', () => {
    const service = new SkyDocsAnchorLinkService(mockTypeDefinitionsProvider);
    const content = 'Foo FooComponent FooUser Foo [[Foo]] [[FooUser]] FooComponent [[Foo]] (FooUser) FooUnknown UnknownFoo';
    const result = service.applyTypeAnchorLinks(content);

    expect(result).toEqual([
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>',
      '<a class="sky-docs-anchor-link" href="#foo-component">FooComponent</a>',
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>',
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>',
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>',
      '<a class="sky-docs-anchor-link" href="#foo-component">FooComponent</a>',
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>',
      '(<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>)',
      'FooUnknown',
      'UnknownFoo'
    ].join(' '));
  });

});
