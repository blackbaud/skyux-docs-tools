import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  inject,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { SkyAppConfig } from '@skyux/config';

import { StacheNavLink } from '@blackbaud/skyux-lib-stache';

import { SkyDocsCodeExamplesComponent } from '../code-examples/code-examples.component';

import { SkyDocsDesignGuidelinesComponent } from '../design-guidelines/design-guidelines.component';

import { SkyDocsSupportalService } from '../shared/docs-tools-supportal.service';

import { SkyDocsComponentInfo } from '../shared/docs-tools-component-info';

import { SkyDocsDemoPageDomAdapterService } from './demo-page-dom-adapter.service';

import { SkyDocsDemoPageTitleService } from './demo-page-title.service';
import { SkyDocsTypeDefinitionsService } from '../type-definitions/type-definitions.service';
import { SkyDocsTypeDefinitions } from '../type-definitions/type-definitions';
import { SkyDocsToolsSiteOptions } from '../shared/docs-tools-site-options';

/**
 * The demo page component wraps all documentation components and handles the configuration and layout of the page.
 * @example
 * ```
 * <sky-docs-demo-page
 *   pageTitle="My demo page"
 * >
 *   Content here.
 * </sky-docs-demo-page>
 * ```
 */
@Component({
  selector: 'sky-docs-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss'],
  providers: [SkyDocsDemoPageDomAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDocsDemoPageComponent
  implements OnInit, AfterContentInit, AfterViewInit
{
  /**
   * Specifies the local path to any other relevant source code. The values are relative to the root directory.
   */
  @Input()
  public set additionalSourceCodePaths(paths: string[] | undefined) {
    this.#_additionalSourceCodePaths = paths;
    this.#updateTypes();
  }

  public get additionalSourceCodePaths(): string[] | undefined {
    return this.#_additionalSourceCodePaths;
  }

  /**
   * Specifies the local path to any other relevant testing source code. The values are relative to the root directory.
   */
  @Input()
  public set additionalTestingSourceCodePaths(paths: string[] | undefined) {
    this.#_additionalTestingSourceCodePaths = paths;
    this.#updateTestingTypes();
  }

  public get additionalTestingSourceCodePaths(): string[] | undefined {
    return this.#_additionalTestingSourceCodePaths;
  }

  /**
   * Specifies the URL to the repo that stores the module's source code.
   * @required
   */
  @Input()
  public gitRepoUrl: string;

  /**
   * Specifies the TypeScript class name of the module. For example, `SkySampleModule`.
   */
  @Input()
  public moduleName: string;

  /**
   * Specifies the local path to the module's source code. The value is relative to the root directory.
   */
  @Input()
  public set moduleSourceCodePath(path: string | undefined) {
    this.#_moduleSourceCodePath = path;
    this.testingSourceCodePath = path.replace('/modules/', '/testing/');
    this.#updateTypes();
    this.#updateTestingTypes();
  }

  public get moduleSourceCodePath(): string | undefined {
    return this.#_moduleSourceCodePath;
  }

  /**
   * Specifies the type definitions for the development tab.
   */
  public moduleTypeDefinitions: SkyDocsTypeDefinitions | undefined;

  /**
   * Specifies the local path to the testing source code. The value is relative to the root directory.
   */
  public testingSourceCodePath: string;

  /**
   * Specifies the type definitions for the testing tab.
   */
  public testingTypeDefinitions: SkyDocsTypeDefinitions | undefined;

  /**
   * Specifies the qualified name of the NPM package. For example, `@blackbaud/sample`.
   * @required
   */
  @Input()
  public packageName: string;

  /**
   * Specifies the URL to the NPM package.
   */
  @Input()
  public packageUrl: string;

  /**
   * Specifies the primary page heading.
   * @required
   */
  @Input()
  public pageTitle: string;

  /**
   * @internal
   */
  public enableCodeExamples = false;

  /**
   * @internal
   */
  public enableTestingTab = false;

  /**
   * @internal
   */
  public enableTabLayout = false;

  /**
   * @internal
   */
  public sidebarRoutes: StacheNavLink[];

  protected hasPreviewFeatures = false;

  @ContentChild(SkyDocsDesignGuidelinesComponent)
  protected designGuidelinesComponent: SkyDocsDesignGuidelinesComponent;

  @ContentChildren(SkyDocsCodeExamplesComponent)
  private codeExampleComponents: QueryList<SkyDocsCodeExamplesComponent>;

  protected readonly siteOptions: SkyDocsToolsSiteOptions | undefined = inject(
    SkyDocsToolsSiteOptions,
    { optional: true },
  );

  #_additionalSourceCodePaths: string[] | undefined;
  #_additionalTestingSourceCodePaths: string[] | undefined;
  #_moduleSourceCodePath: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private skyAppConfig: SkyAppConfig,
    private domAdapter: SkyDocsDemoPageDomAdapterService,
    private supportalService: SkyDocsSupportalService,
    private titleService: SkyDocsDemoPageTitleService,
    private typeDefinitionService: SkyDocsTypeDefinitionsService,
  ) {}

  public ngOnInit(): void {
    const currentHostUrl =
      this.skyAppConfig.skyux.host.url + '/' + this.skyAppConfig.skyux.name;
    this.updateTitle();

    this.supportalService
      .getComponentsInfo()
      .subscribe((results: SkyDocsComponentInfo[]) => {
        this.sidebarRoutes = [
          {
            name: 'Components',
            path: 'https://developer.blackbaud.com/skyux/components',
            children: results.map((component: SkyDocsComponentInfo) => ({
              name: component.name,
              path: this.getPath(component.url, currentHostUrl),
            })),
          },
        ];
        this.changeDetector.markForCheck();
      });
  }

  public ngAfterContentInit(): void {
    this.enableCodeExamples = this.codeExampleComponents.length > 0;
    this.enableTabLayout =
      !!this.designGuidelinesComponent || this.enableCodeExamples;
  }

  public ngAfterViewInit(): void {
    // Watch for route fragment to change and scroll to heading.
    this.activatedRoute.fragment.subscribe((fragment) => {
      this.domAdapter.scrollToFragment(fragment);
    });

    // Change the HREF attribute for all dynamic links when the query params change.
    // This will also generate the appropriate HREF if the user wants to open the link in a new window.
    this.activatedRoute.queryParams.subscribe(() => {
      this.domAdapter.setupAnchorLinks();
    });

    // When a dynamic link is clicked, use Angular's router so that everything works correctly.
    this.domAdapter.anchorLinkClick.subscribe((anchorLink: any) => {
      const fragment = anchorLink.href.split('#')[1];

      this.router.navigate([], {
        fragment,
        queryParamsHandling: 'merge',
      });

      if (this.activatedRoute.snapshot.fragment === fragment) {
        this.domAdapter.scrollToFragment(fragment);
      }
    });
  }

  private updateTitle(): void {
    /*istanbul ignore else*/
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

  private getPath(url: string, currentHostUrl: string): string {
    // Replace host + SPA so Stache will mark active.
    // Strip URL params is url is local, as those will be preserved by stacheRouterLink.
    if (url.indexOf(currentHostUrl) > -1) {
      return url.replace(currentHostUrl, '').split('?')[0];
    } else {
      return url;
    }
  }

  #updateTypes(): void {
    this.moduleTypeDefinitions = this.typeDefinitionService.getTypeDefinitions(
      this.moduleSourceCodePath,
      this.additionalSourceCodePaths,
    );
  }

  #updateTestingTypes(): void {
    this.testingTypeDefinitions = this.typeDefinitionService.getTypeDefinitions(
      this.testingSourceCodePath,
      this.additionalTestingSourceCodePaths,
    );
    this.enableTestingTab = Object.values(this.testingTypeDefinitions).some(
      (value) => value && value.length > 0,
    );
  }
}
