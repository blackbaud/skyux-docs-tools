import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMediaQueryService } from '@skyux/core';

import { MockSkyMediaQueryService } from '@skyux/core/testing';

import { expect } from '@skyux-sdk/testing';

import { of } from 'rxjs';

import { SkyDocsSupportalService } from '../shared/docs-tools-supportal.service';

import { SkyDocsTypeDefinitionsProvider } from '../type-definitions/type-definitions-provider';

import { DemoPageFixtureComponent } from './fixtures/demo-page.component.fixture';

import { DemoPageFixturesModule } from './fixtures/demo-page-fixtures.module';
import { SkyDocsTypeDefinitionsService } from '../type-definitions/type-definitions.service';
import { MockTypeDocAdapterService } from '../type-definitions/fixtures/mock-type-definitions.service';
import { SkyDocsTypeDocAdapterService } from '../type-definitions/typedoc-adapter.service';
import { TypeDocKind } from '../type-definitions/typedoc-types';
function getService(
  provider: SkyDocsTypeDefinitionsProvider = {
    anchorIds: {},
    typeDefinitions: [
      {
        anchorId: '',
        decorators: [{ name: 'Component', type: {} }],
        name: 'FooComponent',
        sources: [
          {
            fileName:
              'src/app/public/modules/_documentation-test/foo.component.ts',
          },
        ],
      },
      {
        anchorId: '',
        decorators: [{ name: 'Directive', type: {} }],
        name: 'FooDirective',
        sources: [
          {
            fileName:
              'src/app/public/modules/_documentation-test/foo.directive.ts',
          },
        ],
      },
      {
        anchorId: '',
        decorators: [{ name: 'Injectable', type: {} }],
        name: 'FooService',
        sources: [
          {
            fileName:
              'src/app/public/modules/_documentation-test/foo.service.ts',
          },
        ],
      },
      {
        anchorId: '',
        decorators: [{ name: 'NgModule', type: {} }],
        name: 'FooModule',
        sources: [
          {
            fileName:
              'src/app/public/modules/_documentation-test/foo.module.ts',
          },
        ],
      },
      {
        anchorId: '',
        decorators: [
          {
            name: 'Pipe',
            type: {
              declaration: {
                children: [
                  {
                    name: 'transform',
                    kind: TypeDocKind.Method,
                    signatures: [
                      {
                        name: 'transform',
                        kind: TypeDocKind.CallSignature,
                        parameters: [
                          {
                            name: 'value',
                            kind: TypeDocKind.Parameter,
                            type: {
                              type: 'reference',
                              name: 'Date',
                            },
                          },
                        ],
                        type: {
                          type: 'intrinsic',
                          name: 'string',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        name: 'FooPipe',
        sources: [
          {
            fileName: 'src/app/public/modules/_documentation-test/foo.pipe.ts',
          },
        ],
      },
      {
        anchorId: '',
        name: 'FooClass',
        kind: TypeDocKind.Class,
        sources: [
          {
            fileName: 'src/app/public/modules/_documentation-test/foo-class.ts',
          },
        ],
      },
      {
        anchorId: '',
        name: 'Foo',
        kind: TypeDocKind.Interface,
        sources: [
          { fileName: 'src/app/public/modules/_documentation-test/foo.ts' },
        ],
      },
      {
        anchorId: '',
        name: 'FooEnum',
        kind: TypeDocKind.Enum,
        sources: [
          {
            fileName: 'src/app/public/modules/_documentation-test/foo-enum.ts',
          },
        ],
      },
      {
        anchorId: '',
        name: 'TypeAlias',
        kind: TypeDocKind.TypeAlias,
        sources: [
          {
            fileName: 'src/app/public/modules/_documentation-test/foo-alias.ts',
          },
        ],
      },
      {
        anchorId: '',
        decorators: [{ name: 'Component', type: {} }],
        name: 'BarComponent',
        sources: [
          {
            fileName:
              'src/app/public/modules/_documentation-test-additional/additional.component.ts',
          },
        ],
      },
    ],
  }
): SkyDocsTypeDefinitionsService {
  const adapter = new MockTypeDocAdapterService();
  return new SkyDocsTypeDefinitionsService(
    provider,
    adapter as SkyDocsTypeDocAdapterService
  );
}
//#region helpers
function getSidebarLinks(
  fixture: ComponentFixture<any>
): NodeListOf<HTMLAnchorElement> {
  return fixture.nativeElement.querySelectorAll('.stache-nav a');
}

describe('Demo page component', () => {
  let fixture: ComponentFixture<DemoPageFixtureComponent>;
  let component: DemoPageFixtureComponent;
  let mockMediaQueryService: MockSkyMediaQueryService;

  beforeEach(() => {
    mockMediaQueryService = new MockSkyMediaQueryService();
    TestBed.configureTestingModule({
      imports: [DemoPageFixturesModule],
      providers: [
        {
          provide: SkyMediaQueryService,
          useValue: mockMediaQueryService,
        },
        { provide: SkyDocsTypeDefinitionsService, useValue: getService() },
      ],
    });

    fixture = TestBed.createComponent(DemoPageFixtureComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set the page title on init', () => {
    fixture.detectChanges();
    const pageTitle = document.title;

    expect(pageTitle).toEqual(component.pageTitle);
  });

  it('should show all items within the module source code', () => {
    fixture.detectChanges();
    const elements = document.querySelectorAll(
      '.sky-docs-type-definition-wrapper sky-docs-heading-anchor'
    );
    expect(elements.length).toBe(8);
    expect(elements[0]).toHaveText('FooComponent');
    expect(elements[1]).toHaveText('FooDirective');
    expect(elements[2]).toHaveText('FooPipe');
    expect(elements[3]).toHaveText('FooService');
    expect(elements[4]).toHaveText('FooClass');
    expect(elements[5]).toHaveText('Foo');
    expect(elements[6]).toHaveText('FooEnum');
    expect(elements[7]).toHaveText('TypeAlias');
  });

  it('should show all items within the additional source code paths', () => {
    fixture.componentInstance.additionalPaths = true;
    fixture.detectChanges();
    const elements = document.querySelectorAll(
      '.sky-docs-type-definition-wrapper sky-docs-heading-anchor'
    );
    expect(elements.length).toBe(9);
    expect(elements[0]).toHaveText('FooComponent');
    expect(elements[1]).toHaveText('BarComponent');
    expect(elements[2]).toHaveText('FooDirective');
    expect(elements[3]).toHaveText('FooPipe');
    expect(elements[4]).toHaveText('FooService');
    expect(elements[5]).toHaveText('FooClass');
    expect(elements[6]).toHaveText('Foo');
    expect(elements[7]).toHaveText('FooEnum');
    expect(elements[8]).toHaveText('TypeAlias');
  });

  it('should call the supportal service and update the sidebar routes', () => {
    const supportalService = TestBed.inject(SkyDocsSupportalService);
    const spy = spyOn(supportalService, 'getComponentsInfo').and.returnValue(
      of([
        {
          name: 'foo',
          url: '/foo',
        },
        {
          name: 'bar',
          url: '/bar',
        },
        {
          name: 'baz',
          url: '/baz',
        },
      ])
    );

    fixture.detectChanges();
    const sidebarLinks = getSidebarLinks(fixture);

    expect(spy).toHaveBeenCalled();
    expect(sidebarLinks.length).toEqual(3);
    expect(sidebarLinks[0].textContent).toEqual('foo');
    expect(sidebarLinks[1].textContent).toEqual('bar');
    expect(sidebarLinks[2].textContent).toEqual('baz');
  });

  it('should remove hostname for any links returned from the supportal service that match current site', () => {
    const supportalService = TestBed.inject(SkyDocsSupportalService);
    const spy = spyOn(supportalService, 'getComponentsInfo').and.returnValue(
      of([
        {
          name: 'foo',
          url: 'https://www.example.com/demo-test/foo', // Hostname matches MockSkyAppConfig.skyux.host.url
        },
        {
          name: 'bar',
          url: 'https://www.anothersite.com/bar',
        },
      ])
    );

    fixture.detectChanges();
    const sidebarLinks = getSidebarLinks(fixture);

    expect(spy).toHaveBeenCalled();
    expect(sidebarLinks[0].getAttribute('href')).toEqual('/foo');
    expect(sidebarLinks[1].getAttribute('href')).toEqual(
      'https://www.anothersite.com/bar'
    );
  });

  it('should remove URL parameters from any URLs returned by supportal service that match current site', () => {
    const supportalService = TestBed.inject(SkyDocsSupportalService);
    const spy = spyOn(supportalService, 'getComponentsInfo').and.returnValue(
      of([
        {
          name: 'foo',
          url: 'https://www.notmatchingsite.com/foo?svcid=test-svcid', // Hostname matches MockSkyAppConfig.skyux.host.url
        },
        {
          name: 'bar',
          url: 'https://www.example.com/demo-test/bar?svcid=test-svcid',
        },
      ])
    );

    fixture.detectChanges();
    const sidebarLinks = getSidebarLinks(fixture);

    expect(spy).toHaveBeenCalled();
    expect(sidebarLinks[0].getAttribute('href')).toEqual(
      'https://www.notmatchingsite.com/foo?svcid=test-svcid'
    );
    expect(sidebarLinks[1].getAttribute('href')).toEqual('/bar');
  });
});
