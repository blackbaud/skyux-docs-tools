import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

/**
 * Renders a custom control panel in the "Show options" dropdown above the demo.
 */
@Component({
  selector: 'sky-docs-demo-custom-control-panel',
  templateUrl: './demo-custom-control-panel.component.html',
  styleUrl: './demo-custom-control-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsDemoCustomControlPanelComponent {
  @HostBinding('class')
  protected readonly classes = 'sky-rounded-corners';
}
