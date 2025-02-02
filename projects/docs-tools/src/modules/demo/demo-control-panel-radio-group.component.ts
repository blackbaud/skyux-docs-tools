import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyDocsDemoControlPanelChange } from './demo-control-panel-change';

import { SkyDocsDemoControlPanelRadioChoice } from './demo-control-panel-radio-choice';

/**
 * Renders a radio control group.
 * @example
 * ```markup
 * <sky-docs-demo-control-panel-radio-group
 *   [choices]="[
 *     { 'label': 'Red', value: '#f00' },
 *     { 'label': 'Green', value: '#0f0' },
 *     { 'label': 'Blue', value: '#00f' }
 *   ]"
 *   heading="Choose a color"
 *   initialValue="Red"
 *   propertyName="color"
 * >
 * </sky-docs-demo-control-panel-radio-group>
 * ```
 */
@Component({
  selector: 'sky-docs-demo-control-panel-radio-group',
  templateUrl: './demo-control-panel-radio-group.component.html',
  styleUrls: ['./demo-control-panel-radio-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDocsDemoControlPanelRadioGroupComponent
  implements OnInit, OnDestroy
{
  /**
   * The possible choices to be represented by radio controls.
   * @required
   */
  @Input()
  public choices: SkyDocsDemoControlPanelRadioChoice[];

  /**
   * Indicates whether to disable the radio group.
   */
  @Input()
  public disabled: boolean = false;

  /**
   * The heading text to appear above the radio group.
   */
  @Input()
  public heading: string;

  /**
   * The initial value of the radio group.
   */
  @Input()
  public initialValue: any;

  /**
   * The name of the component property that is affected by this radio group.
   * @required
   */
  @Input()
  public propertyName: string;

  /**
   * @internal
   */
  public selectionChange = new ReplaySubject<SkyDocsDemoControlPanelChange>();

  /**
   * @internal
   */
  public value: any;

  constructor(private changeDetector: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.value = this.cloneValue(this.initialValue);
    this.#notifyChange();
  }

  public ngOnDestroy(): void {
    this.selectionChange.complete();
  }

  public onModelChange(value: any): void {
    this.value = value;
    this.#notifyChange();
  }

  public resetValue(): void {
    this.value = this.cloneValue(this.initialValue);
    this.#notifyChange();
    this.changeDetector.markForCheck();
  }

  private cloneValue(value: any): any {
    if (typeof value === 'object') {
      return JSON.parse(JSON.stringify(value));
    }

    return value;
  }

  #notifyChange(): void {
    this.selectionChange.next({
      [this.propertyName]: this.value,
    });
  }
}
