# 4.8.1 (2021-01-20)

- Added support for `marked@1.2.7`. [#156](https://github.com/blackbaud/skyux-docs-tools/pull/156)

# 4.8.0 (2020-12-08)

- Added the `disabled` property to the `SkyDocsDemoControlPanelRadioGroupComponent` and `SkyDocsDemoControlPanelCheckboxComponent` to disable the demo form controls. [#154](https://github.com/blackbaud/skyux-docs-tools/pull/154)

# 4.7.4 (2020-11-09)

- Fixed the type definitions service to support type operator properties (e.g., `keyof`). [#153](https://github.com/blackbaud/skyux-docs-tools/pull/153)

# 4.7.3 (2020-10-12)

- Fixed the interface and class type definitions components to support "type literal" properties. [#148](https://github.com/blackbaud/skyux-docs-tools/pull/148)

# 4.7.2 (2020-10-1)

- Fixed the interface definition component to hide optional and required statuses for properties. [#145](https://github.com/blackbaud/skyux-docs-tools/pull/145)

# 4.7.1 (2020-09-25)

- Fixed the type definitions service to handle additional type formats. [#142](https://github.com/blackbaud/skyux-docs-tools/pull/142)

# 4.7.0 (2020-09-23)

- Added `SkyThemeService` to the app module's `providers` array for Stackblitz demos. [#137](https://github.com/blackbaud/skyux-docs-tools/pull/137)
- Updated the `SkyDocsCodeExampleComponent` to set the theme in Stackblitz demos based on the `SkyThemeService`. [#138](https://github.com/blackbaud/skyux-docs-tools/pull/138)

# 4.6.0 (2020-09-16)

- Added the `theme` property to the `SkyDocsCodeExampleComponent` to load Stackblitz demos in modern theme. [#130](https://github.com/blackbaud/skyux-docs-tools/pull/130)

# 4.5.3 (2020-09-15)

- Fixed the demo page component to retain URL params in the sidebar nav when linking between repos. [#128](https://github.com/blackbaud/skyux-docs-tools/pull/128)

# 4.5.2 (2020-09-11)

- Fixed the `SkyDocsSupportalService` calls to properly retain the `svcid` URL parameter. [#126](https://github.com/blackbaud/skyux-docs-tools/pull/126)

# 4.5.1 (2020-09-09)

- Fixed the demo page component to properly render links in the sidebar nav when components have URL parameters. [#121](https://github.com/blackbaud/skyux-docs-tools/pull/121)

# 4.5.0 (2020-09-04)

- Added support for `marked@1.1.1`. [#120](https://github.com/blackbaud/skyux-docs-tools/pull/120)

# 4.4.4 (2020-09-03)

- Reverted the `moment` package version to `0.8.0` since `0.8.2` includes breaking changes. [#119](https://github.com/blackbaud/skyux-docs-tools/pull/119)

# 4.4.3 (2020-09-01)

- Fixed the type definition service to handle classes with the `@Injectable` decorator. [#116](https://github.com/blackbaud/skyux-docs-tools/pull/116)

# 4.4.2 (2020-08-31)

- Fixed the type alias definition component to handle undocumented parameters for function types. [#115](https://github.com/blackbaud/skyux-docs-tools/pull/115)

# 4.4.1 (2020-08-27)

- Fixed the property definition component to hide default values for `Output` properties. [#113](https://github.com/blackbaud/skyux-docs-tools/pull/113)

# 4.4.0 (2020-08-27)

- Added the `sky-docs-thumbnail` component. [#106](https://github.com/blackbaud/skyux-docs-tools/pull/106)
- Fixed the directive definition component to properly parse `Input` property bindings (e.g., `@Input('foobar')`). [#107](https://github.com/blackbaud/skyux-docs-tools/pull/107)
- Fixed the parameter definition component to properly handle parameters of type "call signature". [#110](https://github.com/blackbaud/skyux-docs-tools/pull/110)

# 4.3.2 (2020-08-26)

- Fixed the class definition component to properly display default and required values. [#102](https://github.com/blackbaud/skyux-docs-tools/pull/102)
- Fixed the parameter definition component to properly format complex property types. [#103](https://github.com/blackbaud/skyux-docs-tools/pull/103)

# 4.3.1 (2020-08-21)

- Fixed the property definition component to properly display call signatures. [#94](https://github.com/blackbaud/skyux-docs-tools/pull/94)
- Fixed the directive definition component to properly display complex selectors. [#101](https://github.com/blackbaud/skyux-docs-tools/pull/101)
- Fixed the enumeration definition component to properly format markdown in the description. [#100](https://github.com/blackbaud/skyux-docs-tools/pull/100)

# 4.3.0 (2020-08-20)

- Added the `modern` property to `SkyDocsComponentInfo`. [#95](https://github.com/blackbaud/skyux-docs-tools/pull/95)
- Added class definitions to the type definitions component. [#93](https://github.com/blackbaud/skyux-docs-tools/pull/93)
- Fixed the type definitions component to display a property's array type arguments properly. [#91](https://github.com/blackbaud/skyux-docs-tools/pull/91)
- Fixed the service definitions component to properly display outputs if a class does not include inputs. [#96](https://github.com/blackbaud/skyux-docs-tools/pull/96)

# 4.2.1 (2020-08-05)

- Fixed the anchor link service to properly format known type names when they immedately precede a property. [#86](https://github.com/blackbaud/skyux-docs-tools/pull/86)

# 4.2.0 (2020-07-21)

- Added the ability to hide restricted items in the sidebar navigation. [#79](https://github.com/blackbaud/skyux-docs-tools/pull/79)

# 4.1.0 (2020-07-01)

- Added `restricted` property to `SkyDocsComponentInfo`. [#73](https://github.com/blackbaud/skyux-docs-tools/pull/73)

# 4.0.0 (2020-05-29)

### New features

- Added `SkyDocsHeadingAnchorModule`, `SkyDocsMarkdownModule`, `SkyDocsModuleInfoModule`, and `SkyDocsSafeHtmlModule` to the exports API. [#57](https://github.com/blackbaud/skyux-docs-tools/pull/57)
- Added support for `@angular/core@^9`. [#32](https://github.com/blackbaud/skyux-docs-tools/pull/32)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#32](https://github.com/blackbaud/skyux-docs-tools/pull/32)

### Bug fixes

- Added a global style reference for the native `code` element to match what's provided by `@blackbaud/skyux-lib-stache`. [#60](https://github.com/blackbaud/skyux-docs-tools/pull/60)
- Fixed the type definition components to run the markdown pipe in the correct order. [#59](https://github.com/blackbaud/skyux-docs-tools/pull/59)

### Breaking changes

- Upgraded all `@blackbaud/skyux-lib-*` dependencies to `4.0.0`. [#61](https://github.com/blackbaud/skyux-docs-tools/pull/61)
- Dropped support for `rxjs@5`. Consumers may install `rxjs-compat@^6` to support older versions of `rxjs`. [#32](https://github.com/blackbaud/skyux-docs-tools/pull/32)

# 4.0.0-rc.9 (2020-05-28)

- Upgraded all `@blackbaud/skyux-lib-*` dependencies to `4.0.0`. [#61](https://github.com/blackbaud/skyux-docs-tools/pull/61)

# 4.0.0-rc.8 (2020-05-22)

- Added a global style reference for the native `code` element to match what's provided by `@blackbaud/skyux-lib-stache`. [#60](https://github.com/blackbaud/skyux-docs-tools/pull/60)

# 4.0.0-rc.7 (2020-05-20)

- Fixed the type definition components to run the markdown pipe in the correct order. [#59](https://github.com/blackbaud/skyux-docs-tools/pull/59)

# 4.0.0-rc.6 (2020-05-19)

- Added `code` element styles to the safe HTML component. [#58](https://github.com/blackbaud/skyux-docs-tools/pull/58)

# 4.0.0-rc.5 (2020-05-19)

- Added `SkyDocsHeadingAnchorModule`, `SkyDocsMarkdownModule`, `SkyDocsModuleInfoModule`, and `SkyDocsSafeHtmlModule` to the exports API. [#57](https://github.com/blackbaud/skyux-docs-tools/pull/57)

# 4.0.0-rc.4 (2020-05-01)

- Added bug fixes and features from the `master` branch. [#55](https://github.com/blackbaud/skyux-docs-tools/pull/55)

# 3.3.0 (2020-04-30)

- Added a theme switcher control panel to the demo component. [#52](https://github.com/blackbaud/skyux-docs-tools/pull/52)

# 4.0.0-rc.3 (2020-04-28)

- Added bug fixes and features from the `master` branch. [#51](https://github.com/blackbaud/skyux-docs-tools/pull/51)

# 3.2.1 (2020-04-27)

- Fixed the anchor link service to handle types wrapped within markdown links. [#49](https://github.com/blackbaud/skyux-docs-tools/pull/49)

# 4.0.0-rc.2 (2020-04-16)

- Added bug fixes and features from the `master` branch. [#44](https://github.com/blackbaud/skyux-docs-tools/pull/44)

# 3.2.0 (2020-03-30)

- Added a `heading` attribute to the demo component to allow consumers to provide a custom heading. [#26](https://github.com/blackbaud/skyux-docs-tools/pull/26)
- Added the ability to provide additional content for the module info component. [#42](https://github.com/blackbaud/skyux-docs-tools/pull/42)
- Updated the default text in the module info component's Installation popover. [#42](https://github.com/blackbaud/skyux-docs-tools/pull/42)
- Fixed the pipe definition component to display the input value's property name. [#27](https://github.com/blackbaud/skyux-docs-tools/pull/27)
- Fixed the heading styles to conform to the heading styles provided in the Stache component library. [#42](https://github.com/blackbaud/skyux-docs-tools/pull/42)
- Fixed the Design/Development tabset border to extend to the full width of the page. [#42](https://github.com/blackbaud/skyux-docs-tools/pull/42)
- Fixed the method definition component to decode special characters in the method signature. [#42](https://github.com/blackbaud/skyux-docs-tools/pull/42)
- Fixed the demo control panel component to display properly when only the Reset button is shown. [#42](https://github.com/blackbaud/skyux-docs-tools/pull/42)
- Fixed the method definition component to display required parameters properly. [#42](https://github.com/blackbaud/skyux-docs-tools/pull/42)
- Fixed the property definition component to provide in-page links to known types in the deprecation messages. [#42](https://github.com/blackbaud/skyux-docs-tools/pull/42)

# 4.0.0-rc.1 (2020-02-24)

### Bug fixes

- Fixed the exports API to export the `SkyDemoModule`. [#34](https://github.com/blackbaud/skyux-docs-tools/pull/34)

# 4.0.0-rc.0 (2020-02-22)

### New features

- Added support for `@angular/core@^9`. [#32](https://github.com/blackbaud/skyux-docs-tools/pull/32)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#32](https://github.com/blackbaud/skyux-docs-tools/pull/32)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers may install `rxjs-compat@^6` to support older versions of `rxjs`. [#32](https://github.com/blackbaud/skyux-docs-tools/pull/32)

# 3.1.0 (2020-01-29)

- Added a `reset` emitter to the demo control panel component that fires when users click the reset button. [#21](https://github.com/blackbaud/skyux-docs-tools/pull/21)
- Fixed the code examples editor service to provide `SkyAppLocaleProvider` when running code examples in StackBlitz. [#19](https://github.com/blackbaud/skyux-docs-tools/pull/19)
- Fixed the module info component's `code` element styles to match Stache code snippet styles. [#23](https://github.com/blackbaud/skyux-docs-tools/pull/23)

# 3.0.0 (2020-01-24)

- Initial major release.

# 3.0.0-alpha.36 (2020-01-21)

- Fixed the demo component to hide the options dropdown if no control panels exist.

# 3.0.0-alpha.35 (2020-01-17)

- Fixed a bug where code example files were being shared between similarly named headings. [#15](https://github.com/blackbaud/skyux-docs-tools/pull/15)
- Adopted latest version of `SkyImageModule` (from `@blackbaud/skyux-lib-media@1.2.0`) which addresses some accessibility and responsiveness issues. [#15](https://github.com/blackbaud/skyux-docs-tools/pull/15)
- Added feature to allow custom content to be included under the "Development" tab. [#15](https://github.com/blackbaud/skyux-docs-tools/pull/15)

# 3.0.0-alpha.34 (2020-01-10)

- Removed the image component caption "Do" and "Don't" prefixes. [#14](https://github.com/blackbaud/skyux-docs-tools/pull/14)

# 3.0.0-alpha.33 (2020-01-10)

- Fixed an implementation problem of the package `marked` that affected Internet Explorer 11. [#13](https://github.com/blackbaud/skyux-docs-tools/pull/13)

# 3.0.0-alpha.32 (2020-01-10)

- Altered spacing between design guidelines thumbnails.
- Added space character between "optional" text on the anatomy item component marker.

# 3.0.0-alpha.31 (2020-01-09)

- Fixed design guideline thumbnail component to properly wrap multiple images.

# 3.0.0-alpha.30 (2020-01-09)

- Created anatomy module, added columns for design guideline thumbnails. [#12](https://github.com/blackbaud/skyux-docs-tools/pull/12)

# 3.0.0-alpha.29 (2020-01-03)

- Fixed the demo control panel checkbox component to signal changes when the reset button is clicked.

# 3.0.0-alpha.28 (2020-01-03)

- Added global style sheet to be used for table styles.

# 3.0.0-alpha.27 (2019-12-13)

- Changed the anatomy component's `thumbnailPath` input to `imagePath` to be consistent with the SKY UX documentation SPA's component.
- Isolated heading styles for various components to make them work in isolation.

# 3.0.0-alpha.26 (2019-12-11)

- Updated the sidebar header. [#7](https://github.com/blackbaud/skyux-docs-tools/pull/7)

# 3.0.0-alpha.25 (2019-12-02)

- Bugfix to allow popovers (and all future SPAs) to be marked as active. [#5](https://github.com/blackbaud/skyux-docs-tools/pull/5)

# 3.0.0-alpha.24 (2019-11-22)

- Added the `SkyDocsSupportalService` to allow consumers to fetch a list of component information. [#4](https://github.com/blackbaud/skyux-docs-tools/pull/4)

# 3.0.0-alpha.23 (2019-11-15)

- Fixed the demo page component's HTTP `GET` request to reference the correct supportal URL.

# 3.0.0-alpha.22 (2019-11-12)

- Added `SkyDocsToolsOptions` provider.
- Added documentation for the demo, demo page, and code examples components.

# 3.0.0-alpha.21 (2019-11-12)

- Fixed the module info component to generate the correct URL for NPM packages.

# 3.0.0-alpha.20 (2019-11-06)

- Added the `SkyDocsToolsModule` which exports the most commonly used modules.

# 3.0.0-alpha.19 (2019-10-31)

- Added mobile responsive view for the property definitions component.

# 3.0.0-alpha.18 (2019-10-30)

- Added the `SkyDocsDemoControlPanelRadioChoice` interface.
- Changed the name of the `sourceCodeLocation` input on the code example component to `sourceCodePath`.
- Changed the name of the `sourceCodeLocation` input on the type definitions component to `moduleSourceCodePath`.
- Changed the name of the `sourceCodeLocation` input on the demo page component to `moduleSourceCodePath`.
- Fixed type definitions component to properly recognize required state on properties.

# 3.0.0-alpha.17 (2019-10-24)

- Implemented call to supportal service to derive component sidebar navigation.
- Fixed the code example editor service to support pre-release versions of NPM packages.

# 3.0.0-alpha.16 (2019-10-02)

- Fixed the design guidelines thumbnail component to contrain video width to column width.

# 3.0.0-alpha.15 (2019-10-02)

- Fixed the code example component to display code example headings.

# 3.0.0-alpha.14 (2019-10-02)

- Added `headingStyle` to the design guidelines section component.
- Added `videoSource` to the design guidelines thumbnail component.

# 3.0.0-alpha.13 (2019-10-02)

- Fixed the `SkyDocsTypeDefinitionsModule` to provide the `SkyDocsTypeDefinitionsFormatService`.

# 3.0.0-alpha.12 (2019-10-02)

- Added inline mode for markdown pipe.
- Code cleanup.

# 3.0.0-alpha.11 (2019-10-02)

- Fixed the demo control panel component to watch for changes to dynamically added controls.

# 3.0.0-alpha.10 (2019-09-23)

- Fixed scroll-to behavior for dynamic links.

# 3.0.0-alpha.9 (2019-09-23)

- Implemented permalinks for tabs.
- Fixed positioning of scrolling behavior for heading anchor component.

# 3.0.0-alpha.8 (2019-09-23)

- Added safe HTML component.
- Added heading anchor component.
- Added automatic link generator for TypeScript types.
- Style adjustements.

# 3.0.0-alpha.7 (2019-08-22)

- Adjusted styles and placement for property definition "required" and "deprecated" labels.
- Added toggle button to show and hide the behavior demo.

# 3.0.0-alpha.6 (2019-06-25)

- Removed "Overview" heading from demo page summary.

# 3.0.0-alpha.5 (2019-06-24)

- Added sidebar navigation.

# 3.0.0-alpha.4 (2019-06-24)

- Added support for Angular pipe definitions.
- Added components to display design guidelines.

# 3.0.0-alpha.3 (2019-06-19)

- Added components to support TypeDoc JSON output.

# 3.0.0-alpha.2 (2019-06-05)

- Added checks to hide headings for demos and code examples if they do not exist.

# 3.0.0-alpha.1 (2019-06-04)

- Updated wording for module info component.
- Added peer dependencies.

# 3.0.0-alpha.0 (2019-06-03)

- Initial alpha release.
