import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyDocsDemoControlPanelChange
} from './demo-control-panel-change';

@Component({
  selector: 'sky-docs-demo-control-panel-checkbox',
  templateUrl: './demo-control-panel-checkbox.component.html',
  styleUrls: ['./demo-control-panel-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoControlPanelCheckboxComponent implements OnInit, OnDestroy {

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

  @Input()
  public label: string;

  @Input()
  public name: string;

  /**
   * @internal
   */
  public selectionChange = new Subject<SkyDocsDemoControlPanelChange>();

  /**
   * @internal
   */
  private initialState: {
    checked?: boolean;
  } = {};

  private _checked: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    setTimeout(() => {
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
    this.checked = !!this.initialState.checked;
    this.changeDetector.markForCheck();
  }

  private notifyChange(): void {
    this.selectionChange.next({
      [this.name]: this.checked
    });
  }

}
