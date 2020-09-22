import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional
} from '@angular/core';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyDocsCodeExampleTheme
} from './code-example-theme';

/**
 * Renders a single code example.
 * @example
 * ```
 * <sky-docs-code-example
 *   heading="My code example"
 *   sourceCodePath="src/app/public/plugin-resources/foobar"
 * >
 * </sky-docs-code-example>
 * ```
 */
@Component({
  selector: 'sky-docs-code-example',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCodeExampleComponent {

  /**
   * The heading to be used for the code example.
   * @required
   */
  @Input()
  public heading: string;

  /**
   * Specifies the local path to the code example's source code. The value is relative to the root directory.
   * @required
   */
  @Input()
  public sourceCodePath: string;

  /**
   * Specifies if the editor service should show the example in modern theme.
   * The value will be gleaned from `SkyThemeService` first, then fallback to 'default' if the service is not found.
   */
  @Input()
  public set theme(value: SkyDocsCodeExampleTheme) {
    this._theme = value;
  }

  public get theme(): SkyDocsCodeExampleTheme {
    return this._theme || SkyDocsCodeExampleTheme.Default;
  }

  private _theme: SkyDocsCodeExampleTheme;

  constructor(
    @Optional() themeSvc?: SkyThemeService
  ) {
    // Update theme property with SkyThemeService if it has not been set.
    if (!this._theme && themeSvc) {
      themeSvc.settingsChange.subscribe(change => {
        if (change.currentSettings.theme.name === 'modern') {
          this.theme = SkyDocsCodeExampleTheme.Modern;
        } else if (change.currentSettings.theme.name === 'default') {
          this.theme = SkyDocsCodeExampleTheme.Default;
        }
      });
    }
  }

}
