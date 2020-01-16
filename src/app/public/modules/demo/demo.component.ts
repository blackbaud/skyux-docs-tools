import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

export type SkyDocsDemoContentAlignment = 'left' | 'center';

/**
 * Wraps all behavior demo components and handles the configuration and appearance of the behavior demo.
 * @example
 * ```markup
 * <sky-docs-demo>
 *   Demo content here.
 * </sky-docs-demo>
 * ```
 */
@Component({
  selector: 'sky-docs-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoComponent {

  @Input()
  public set contentAlignment(value: SkyDocsDemoContentAlignment) {
    this._contentAlignment = value;
  }

  public get contentAlignment(): SkyDocsDemoContentAlignment {
    return this._contentAlignment || 'center';
  }

  public get toggleOptionsButtonIcon(): string {
    return (this.areOptionsVisible) ? 'chevron-up' : 'chevron-down';
  }

  public areOptionsVisible = false;

  private _contentAlignment: SkyDocsDemoContentAlignment;

  public onToggleOptionsButtonClick(): void {
    this.areOptionsVisible = !this.areOptionsVisible;
  }

}
