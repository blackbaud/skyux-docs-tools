/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module modules/shared/sky-docs-tools' schematic.
 * To update this file, simply rerun the command.
 */

import { NgModule } from '@angular/core';
import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  SkyLibResourcesService,
  getLibStringForLocale,
} from '@skyux/i18n';

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-US': {
    'sky-docs-demo-heading': { message: 'Demo' },
    'sky-docs-demo-toggle-button-on': { message: 'Show options' },
    'sky-docs-demo-toggle-button-off': { message: 'Hide options' },
    'sky-docs-code-example-launch-button-label': {
      message: 'Run in StackBlitz',
    },
    'sky-docs-demo-control-panel-reset-button-label': { message: 'Reset' },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyDocsToolsResourcesProvider implements SkyLibResourcesProvider {
  public getString(
    localeInfo: SkyAppLocaleInfo,
    name: string,
  ): string | undefined {
    return getLibStringForLocale(RESOURCES, localeInfo.locale, name);
  }
}

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
  providers: [
    {
      provide: SKY_LIB_RESOURCES_PROVIDERS,
      useClass: SkyDocsToolsResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyDocsToolsResourcesModule {}
