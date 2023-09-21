import { Injectable } from '@angular/core';

import { SkyDocsComponentInfo } from 'projects/docs-tools/src/public-api';
import { Observable, of } from 'rxjs';

const componentList = {
  components: [
    {
      icon: 'square-o',
      name: 'Action button',
      summary:
        'The action button module creates a large button with an icon, heading, and details.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/action-button',
    },
    {
      icon: 'bell-o',
      name: 'Action hub',
      summary:
        'The action hub module combines needs-attention items, recent links, and other actionable insights.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/action-hub',
    },
    {
      icon: 'bell',
      name: 'Alert',
      summary:
        'The alert component highlights critical information that users must see.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/alert',
    },
    {
      icon: 'search',
      name: 'Autocomplete',
      summary:
        'The autocomplete component creates a text input that filters data based on user entries.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/autocomplete',
    },
    {
      icon: 'calculator',
      name: 'Autonumeric',
      summary:
        'The autonumeric module formats currency and other numbers that users enter in form inputs.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/autonumeric',
    },
    {
      icon: 'user',
      name: 'Avatar',
      summary:
        'The avatar component displays an image to identify a record and allows users to change the image.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/avatar',
    },
    {
      icon: 'arrow-up',
      name: 'Back to top',
      summary:
        'The back to top directive creates a button for users to easily access the top of long lists.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/back-to-top',
    },
    {
      icon: 'square-o',
      name: 'Box',
      summary:
        'The box module provides a container for related content and actions.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/box',
    },
    {
      icon: 'square-o',
      name: 'Button',
      summary:
        'The button classes create buttons to trigger actions from within an interface.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/button',
    },
    {
      icon: 'th-large',
      name: 'Card',
      summary:
        'The card module creates a small container to highlight important information.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/card',
    },
    {
      icon: 'calculator',
      name: 'Character count',
      summary:
        'The character count indicator component extends a text input to apply a character limit and display an indicator.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/character-count',
    },
    {
      icon: 'check-square',
      name: 'Checkbox',
      summary: 'The checkbox component renders a SKY UX-themed checkbox.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/checkbox',
    },
    {
      icon: 'eyedropper',
      name: 'Colorpicker',
      summary:
        'The colorpicker module provides an input for users to select colors.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/colorpicker',
    },
    {
      icon: 'list-alt',
      name: 'Confirm',
      summary:
        'The confirm component launches simple confirmation dialogs for users to confirm actions.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/confirm',
    },
    {
      icon: 'globe',
      name: 'Country field',
      summary:
        'The country field component creates a text input for users to enter search criteria and select a country.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/country-field',
    },
    {
      icon: 'table',
      name: 'Data entry grid',
      summary:
        'Data entry grids provide a spreadsheet-like user interface to enter large amounts of data.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/data-entry-grid',
    },
    {
      icon: 'table',
      name: 'Data grid',
      summary:
        'Data grids provide a spreadsheet-like user interface to view large amounts of data.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/data-grid',
    },
    {
      icon: 'list',
      name: 'Data manager',
      summary:
        'Data managers enable the exploration of data sets across multiple SKY UX, third-party, or custom views.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/data-manager',
    },
    {
      icon: 'calendar',
      name: 'Date pipe',
      summary: 'The date pipe formats date values according to locale rules.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/date-pipe',
    },
    {
      icon: 'calendar',
      name: 'Date range picker',
      summary:
        'The date range picker component creates a text input to select a date range from a set of well-known options.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/date-range-picker',
    },
    {
      icon: 'calendar',
      name: 'Datepicker',
      summary:
        'The datepicker module creates an input and calendar picker to select dates or fuzzy dates.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/datepicker',
    },
    {
      icon: 'list-alt',
      name: 'Definition list',
      summary:
        'The definition list module displays a list of label-value pairs.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/definition-list',
    },
    {
      icon: 'list-alt',
      name: 'Description list',
      summary:
        'Description lists display scannable data in term-description pairs.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/description-list',
    },
    {
      icon: 'caret-down',
      name: 'Dropdown',
      summary:
        'The dropdown component renders a button to display related actions or context menus in grids or lists.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/dropdown',
    },
    {
      icon: 'check',
      name: 'Email validation',
      summary:
        'The email validation module ensures that user entries in an input element are valid email addresses.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/email-validation',
    },
    {
      icon: 'exclamation',
      name: 'Error',
      summary:
        'The error component provides a template for other components to display error messages.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/error',
    },
    {
      icon: 'cloud-upload',
      name: 'File attachment',
      summary:
        'The file attachment module creates options to attach files to forms and to display metadata about attachments.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/file-attachments',
      children: [
        {
          icon: 'files-o',
          name: 'File attachment',
          summary:
            'The file attachment module creates an element to attach multiple local or external files.',
          supported_themes: ['default'],
          url: 'https://developer.blackbaud.com/skyux-v5/components/file-attachment',
        },
        {
          icon: 'cloud-upload',
          name: 'Single file attachment',
          summary:
            'The single file attachment component creates an input to attach a single local file.',
          supported_themes: ['default', 'modern'],
          url: 'https://developer.blackbaud.com/skyux-v5/components/single-file-attachment',
        },
      ],
    },
    {
      icon: 'filter',
      name: 'Filter',
      summary:
        'The filter module creates a button to select filtering options.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/filter',
    },
    {
      icon: 'table',
      name: 'Fluid grid',
      summary:
        'The fluid grid component provides a responsive 12-column layout to organize content for all device sizes.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/fluid-grid',
    },
    {
      icon: 'columns',
      name: 'Flyout',
      summary:
        'The flyout service launches a container to display supplementary information related to a task.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/flyout',
    },
    {
      icon: 'keyboard-o',
      name: 'Form',
      summary:
        'The form classes create styled inputs and labels for use in forms.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/form',
    },
    {
      icon: 'building-o',
      name: 'Format',
      summary:
        'The format component places formatted text inside a tokenized string template.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/format',
    },
    {
      icon: 'table',
      name: 'Grid',
      summary:
        'The grid component displays data in a consistent and flexible way.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/grid',
    },
    {
      icon: 'question',
      name: 'Help inline',
      summary:
        'The help inline component creates a small help button next to a field.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/help-inline',
    },
    {
      icon: 'picture-o',
      name: 'Icon',
      summary: 'The icon component displays a Font Awesome icon.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/icon',
    },
    {
      icon: 'id-card-o',
      name: 'ID',
      summary:
        'The ID directive assigns a unique ID to an element that can be referenced by other elements.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/id',
    },
    {
      icon: 'refresh',
      name: 'Infinite scroll',
      summary:
        'The infinite scroll component dynamically loads data as users scroll.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/infinite-scroll',
    },
    {
      icon: 'trash',
      name: 'Inline delete confirmation',
      summary:
        'The inline delete confirmation component prompts users to confirm that they want to delete an item in a list.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/inline-delete',
    },
    {
      icon: 'keyboard-o',
      name: 'Inline form',
      summary:
        'The inline form component renders a form in the current view rather than in a modal.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/inline-form',
    },
    {
      icon: 'server',
      name: 'Input box',
      summary:
        'The input box provides styling for prompts to enter data in forms.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/input-box',
    },
    {
      icon: 'key',
      name: 'Key info',
      summary:
        'The key info component highlights important information such as summary numbers.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/key-info',
    },
    {
      icon: 'tags',
      name: 'Label',
      summary:
        'The label component calls out important status information such as warnings.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/label',
    },
    {
      icon: 'list',
      name: 'List',
      summary:
        'The list module displays a SKY UX-themed list of data in a consistent, flexible way.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/list',
      children: [
        {
          icon: 'list',
          name: 'List overview',
          summary:
            'The list component displays a SKY UX-themed list of data in a consistent, flexible way.',
          supported_themes: ['default'],
          url: 'https://developer.blackbaud.com/skyux-v5/components/list-overview',
        },
        {
          icon: 'filter',
          name: 'List filters',
          summary:
            'The list filters module provides components that allow users to select filter criteria.',
          supported_themes: ['default'],
          url: 'https://developer.blackbaud.com/skyux-v5/components/list-filters',
        },
        {
          icon: 'file-o',
          name: 'List paging',
          summary:
            'The list paging component displays a SKY UX-themed pagination control for a list.',
          supported_themes: ['default'],
          url: 'https://developer.blackbaud.com/skyux-v5/components/list-paging',
        },
        {
          icon: 'wrench',
          name: 'List toolbar',
          summary:
            'The list toolbar component displays a SKY UX-themed toolbar for a list.',
          supported_themes: ['default'],
          url: 'https://developer.blackbaud.com/skyux-v5/components/list-toolbar',
        },
        {
          icon: 'list-ul',
          name: 'List view checklist',
          summary:
            'The list view checklist component builds a filterable checkbox list of data.',
          supported_themes: ['default'],
          url: 'https://developer.blackbaud.com/skyux-v5/components/list-view-checklist',
        },
        {
          icon: 'table',
          name: 'List view grid',
          summary:
            'The list view grid component provides a SKY UX-themed grid for a list of data.',
          supported_themes: ['default'],
          url: 'https://developer.blackbaud.com/skyux-v5/components/list-view-grid',
        },
      ],
    },
    {
      icon: 'search',
      name: 'Lookup',
      summary:
        'The lookup component provides a typeahead search input that lets users select multiple items.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/lookup',
    },
    {
      icon: 'mobile',
      name: 'Media queries',
      summary:
        'The media queries service allows users to subscribe to screen size changes at breakpoints.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/media-query',
    },
    {
      icon: 'list-alt',
      name: 'Modal',
      summary:
        'The modal component launches modals in a consistent way in SKY UX applications.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/modal',
    },
    {
      icon: 'compass',
      name: 'Navbar',
      summary:
        'The navbar component displays a list of top-level navigation items.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/navbar',
    },
    {
      icon: 'calculator',
      name: 'Numeric',
      summary:
        'The numeric pipe shortens long numbers and can format as currency.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/numeric',
    },
    {
      icon: 'object-group',
      name: 'Page',
      summary:
        "The page component resets the SPA's background to white and provides an easy way to override styling.",
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/page',
    },
    {
      icon: 'newspaper-o',
      name: 'Page summary',
      summary:
        'The page summary displays critical information and actions for users to access frequently.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/page-summary',
    },
    {
      icon: 'files-o',
      name: 'Paging',
      summary:
        'The paging component displays a SKY UX-themed pagination control.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/paging',
    },
    {
      icon: 'tasks',
      name: 'Passive progress indicator',
      summary:
        'The passive progress indicator represents sequential steps in processes outside of user control.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/progress-indicator-passive',
    },
    {
      icon: 'phone',
      name: 'Phone field',
      summary:
        'The phone field module creates a button, search input, and text input for entering and validating phone numbers.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/phone-field',
    },
    {
      icon: 'newspaper-o',
      name: 'Popover',
      summary:
        'The popover module displays small chunks of contextual content in an HTML-formatted popover on pages or modals.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/popover',
    },
    {
      icon: 'circle-o',
      name: 'Radio button',
      summary:
        'The radio button module ceates a small set of selection inputs and allows users to select one option only.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/radio',
    },
    {
      icon: 'chevron-down',
      name: 'Repeater',
      summary:
        'The repeater component creates a container to display formatted information for a list of objects.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/repeater',
    },
    {
      icon: 'search',
      name: 'Search',
      summary:
        'The search component creates a mobile-responsive input control for users to enter search criteria.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/search',
    },
    {
      icon: 'object-group',
      name: 'Sectioned form',
      summary:
        'The sectioned form component combines forms and lets users target specific areas.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/sectioned-form',
    },
    {
      icon: 'search',
      name: 'Select field',
      summary:
        'The select field component launches a modal that displays items for users to select.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/select-field',
    },
    {
      icon: 'sort',
      name: 'Sort',
      summary:
        'The sort component creates a button and dropdown to select sorting criteria.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/sort',
    },
    {
      icon: 'columns',
      name: 'Split view',
      summary:
        'The split view component displays a list alongside a workspace where users can view details and take actions.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/split-view',
    },
    {
      icon: 'exclamation-triangle',
      name: 'Status indicator',
      summary:
        'The status indicator classes provide icons to draw attention to status information.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/status-indicator',
    },
    {
      icon: 'sun-o',
      name: 'Summary action bar',
      summary:
        'The summary action bar provides a docked container for actions and summary information.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/summary-action-bar',
    },
    {
      icon: 'folder-open-o',
      name: 'Tabs',
      summary:
        'The tabs module renders tabs that divide large subsets of content on a page.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/tabs',
    },
    {
      icon: 'pencil-square-o',
      name: 'Text editor',
      summary:
        'The text editor component lets users format and manipulate text.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/text-editor',
    },
    {
      icon: 'text-height',
      name: 'Text expand',
      summary:
        'The text expand component truncates long blocks of text with an ellipsis and a link to expand the full text.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/text-expand',
    },
    {
      icon: 'list',
      name: 'Text expand repeater',
      summary:
        'The text expand repeater component truncates a list of items and initially displays a limited number of items.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/text-expand-repeater',
    },
    {
      icon: 'paint-brush',
      name: 'Text highlight',
      summary: 'The highlight component highlights text within DOM elements.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/text-highlight',
    },
    {
      icon: 'th-large',
      name: 'Tile',
      summary:
        'The tile component creates a collapsible container that is a building block for pages and forms.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/tile',
    },
    {
      icon: 'clock-o',
      name: 'Timepicker',
      summary:
        'The timepicker module provides an input for users to select times.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/timepicker',
    },
    {
      icon: 'envelope',
      name: 'Toast',
      summary:
        "The toast module launches a container to display a message over a page's content.",
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/toast',
    },
    {
      icon: 'toggle-on',
      name: 'Toggle switch',
      summary:
        'The toggle switch component renders a SKY UX-themed switch for values that can either be "on" or "off."',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/toggle-switch',
    },
    {
      icon: 'th-large',
      name: 'Tokens',
      summary:
        'The tokens component displays a series of objects for users to interact with.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/tokens',
    },
    {
      icon: 'bars',
      name: 'Toolbar',
      summary: 'The toolbar component displays a SKY UX-themed toolbar.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/toolbar',
    },
    {
      icon: 'sitemap',
      name: 'Tree view',
      summary:
        'The tree view module provides a hierarchical list view with multiple modes for selecting items in the list.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/angular-tree',
    },
    {
      icon: 'check',
      name: 'URL validation',
      summary:
        'The URL validation module ensures that user entries in an input element are valid URLs.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/url-validation',
    },
    {
      icon: 'folder-open-o',
      name: 'Vertical tabs',
      summary:
        'The vertical tabs module displays large amounts of information within collapsible groups.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/vertical-tabs',
    },
    {
      icon: 'spinner',
      name: 'Wait',
      summary:
        'The wait directive and service display a wait indication on elements.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/wait',
    },
    {
      icon: 'tasks',
      name: 'Waterfall progress indicator',
      summary:
        'The waterfall progress indicator walks users through sequential steps in lengthy or complex tasks.',
      supported_themes: ['default', 'modern'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/progress-indicator-waterfall',
    },
    {
      icon: 'window-maximize',
      name: 'Window',
      summary:
        'The application window reference service allows users to reference the global window variable.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/window',
    },
    {
      icon: 'magic',
      name: 'Wizard',
      summary:
        'The wizard guides users through a set of pre-defined steps in a particular order.',
      supported_themes: ['default'],
      url: 'https://developer.blackbaud.com/skyux-v5/components/progress-indicator-wizard',
    },
  ],
};

@Injectable()
export class LocalDocsService {
  public getComponentsInfo(): Observable<SkyDocsComponentInfo[]> {
    return of(componentList.components);
  }
}
