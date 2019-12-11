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
