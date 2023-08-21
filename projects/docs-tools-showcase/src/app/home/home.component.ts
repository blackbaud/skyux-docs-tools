import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  SkyDatepickerCalendarChange,
  SkyDatepickerCustomDate,
  SkyFuzzyDate,
} from '@skyux/datetime';
import { SkyDocsDemoControlPanelChange, SkyDocsToolsOptions } from 'docs-tools';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux',
        packageName: '@skyux/datetime',
      },
    },
  ],
})
export class HomeComponent {
  public fuzzyForm: UntypedFormGroup;

  public fuzzyMaxDate: SkyFuzzyDate | undefined = undefined;

  public fuzzyMinDate: SkyFuzzyDate | undefined = undefined;

  public fuzzyFutureDisabled: boolean = false;

  public fuzzyYearRequired: boolean = false;

  public showCustomDates: boolean = false;

  public standardForm: UntypedFormGroup;

  public standardMaxDate: Date | undefined = undefined;

  public standardMinDate: Date | undefined = undefined;

  constructor(
    private changeRef: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder
  ) {
    this.fuzzyForm = this.formBuilder.group({
      myDate: new UntypedFormControl(new Date(1955, 10, 5)),
    });
    this.standardForm = this.formBuilder.group({
      myDate: new UntypedFormControl(new Date(1955, 10, 5)),
    });
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.standardValidation === true) {
      this.standardMaxDate = new Date(2020, 0, 31);
      this.standardMinDate = new Date(2020, 0, 1);
    } else if (change.standardValidation === false) {
      this.standardMaxDate = undefined;
      this.standardMinDate = undefined;
    }

    if (change.customDates !== undefined) {
      this.showCustomDates = change.customDates;
    }

    if (change.fuzzyValidation === true) {
      this.fuzzyMaxDate = { day: 31, month: 1, year: 2020 };
      this.fuzzyMinDate = { day: 1, month: 1, year: 2020 };
    } else if (change.fuzzyValidation === false) {
      this.fuzzyMaxDate = undefined;
      this.fuzzyMinDate = undefined;
    }

    if (change.fuzzyFutureDates !== undefined) {
      this.fuzzyFutureDisabled = !change.fuzzyFutureDates;
    }

    if (change.fuzzyYearRequired !== undefined) {
      this.fuzzyYearRequired = change.fuzzyYearRequired;
    }

    this.changeRef.markForCheck();
  }

  public onCalendarDateRangeChange(event: SkyDatepickerCalendarChange): void {
    if (event) {
      if (this.showCustomDates) {
        // Bind observable to `customDates` argument and simulate delay for async process to finish.
        // Normally, `getCustomDates()` would be replaced by an async call to fetch data.
        event.customDates = this.getCustomDates(event).pipe(delay(2000));
      }
    }
  }

  /**
   * Generate fake custom dates based on the date range returned from the event.
   * This is for demonstration purposes only.
   */
  private getCustomDates(
    event: SkyDatepickerCalendarChange
  ): Observable<SkyDatepickerCustomDate[]> {
    const getNextDate = function (startDate: Date, daystoAdd: number): Date {
      let newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + daystoAdd);
      return newDate;
    };

    const customDates: SkyDatepickerCustomDate[] = [];
    customDates.push({
      date: getNextDate(event.startDate, 8),
      keyDate: true,
      keyDateText: ['Homework due'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 10),
      disabled: true,
      keyDate: true,
      keyDateText: ['Class cancelled'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 12),
      keyDate: true,
      keyDateText: ['Labs due'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 16),
      keyDate: true,
      keyDateText: ['Homework due'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 26),
      keyDate: true,
      keyDateText: ['Mid-term'],
    });

    return of(customDates);
  }
}
