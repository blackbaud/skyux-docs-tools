import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyDocsDemoControlPanelChange } from './demo-control-panel-change';

/**
 * Renders a checkbox control within the control panel.
 * @example
 * ```markup
 * <sky-docs-demo-control-panel-checkbox
 *   label="Show title"
 *   [checked]="true"
 *   [propertyName]="showTitle"
 * >
 * </sky-docs-demo-control-panel-checkbox>
 * ```
 */
@Component({
  selector: 'sky-docs-demo-control-panel-checkbox',
  templateUrl: './demo-control-panel-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsDemoControlPanelCheckboxComponent
  implements OnInit, OnDestroy
{
  /**
   * The checked status of the checkbox.
   * @default false
   */
  @Input()
  public set checked(value: boolean) {
    if (value !== undefined && this._checked === undefined) {
      this.initialState.checked = value;
    }

    this._checked = value;
  }

  public get checked(): boolean {
    return this._checked || false;
  }

  /**
   * Indicates whether to disable the checkbox.
   */
  @Input()
  public disabled: boolean = false;

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the control panel checkbox label. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   * @preview
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   * @preview
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * The text label of the checkbox.
   * @required
   */
  @Input()
  public label: string;

  /**
   * The name of the component property that is affected by this control.
   * @required
   */
  @Input()
  public propertyName: string;

  public selectionChange = new ReplaySubject<SkyDocsDemoControlPanelChange>();

  private initialState: {
    checked?: boolean;
  } = {};

  private _checked: boolean;

  constructor(private changeDetector: ChangeDetectorRef) {}

  public ngOnInit(): void {
    setTimeout(() => {
      this.initialState.checked = this.checked;
      this.notifyChange();
    });
  }

  public ngOnDestroy(): void {
    this.selectionChange.complete();
  }

  public onModelChange(): void {
    this.notifyChange();
  }

  public resetState(): void {
    if (this.initialState.checked !== this.checked) {
      this.checked = !!this.initialState.checked;
      this.notifyChange();
      this.changeDetector.markForCheck();
    }
  }

  private notifyChange(): void {
    this.selectionChange.next({
      [this.propertyName]: this.checked,
    });
  }
}
