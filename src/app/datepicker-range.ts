import { Component, Inject } from "@angular/core";
import {
  NgbDate,
  NgbCalendar,
  NgbDateStruct,
  NgbDatepickerConfig
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "ngbd-datepicker-range",
  templateUrl: "./datepicker-range.html",
  styles: [
    `
      .custom-day {
        text-align: center;
        padding: 0.185rem 0.25rem;
        display: inline-block;
        height: 2rem;
        width: 2rem;
      }
      .custom-day.focused {
        background-color: #e6e6e6;
      }

      .custom-day.range,
      .custom-day:hover {
        background-color: rgb(2, 117, 216);
        color: white;
      }

      .custom-day:focus,
      .custom-day.range:focus,
      .custom-day.faded:focus {
        outline: none !important;
      }
      .custom-day.faded {
        background-color: rgba(2, 117, 216, 0.5);
      }

      .disabled .custom-day {
        color: red;
      }
    `
  ]
})
export class NgbdDatepickerRange {
  hoveredDate: NgbDate | null = null;
  model: NgbDateStruct;

  fromDate: NgbDate;
  today: NgbDate;
  toDate: NgbDate | null = null;
  firstDayOfWeek: number = 1;
  selectMultipleWeeks: boolean = true;
  showWeekNumbers: boolean = true;
  numberOfMonthsToEnable: number = 6;
  weekNumbers: string[] = [];

  constructor(
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig
  ) {
    this.fromDate = calendar.getToday();
    this.today = calendar.getToday();
    this.selectWeek(this.fromDate);

    config.markDisabled = (date: NgbDateStruct, current) => {
      let previousMonth = this.calendar.getPrev(
        this.today,
        "m",
        this.numberOfMonthsToEnable
      );
      if (NgbDate.from(previousMonth).before(date)) {
        return false;
      }
      return true;
    };
  }

  selectWeek(date: NgbDate) {
    const dateObject = new Date(date.year, date.month - 1, date.day);
    let constructDate = this.buildDate(dateObject);

    if (!this.selectMultipleWeeks) {
      //Single week selection
      this.fromDate = this.constructStartDate(dateObject)(constructDate);
      this.toDate = this.constructEndDate(dateObject)(constructDate);
      this.weekNumberGenerator();
    } else {
      //Multiple week selection
      if (!this.fromDate && !this.toDate) {
        this.fromDate = this.constructStartDate(dateObject)(constructDate);
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        const startDate = new Date(
          this.fromDate.year,
          this.fromDate.month - 1,
          this.fromDate.day
        );
        let buildStartDate = this.buildDate(startDate);
        this.fromDate = this.constructStartDate(startDate)(buildStartDate);

        //this.toDate = date;
        this.toDate = this.constructEndDate(dateObject)(constructDate);
      } else {
        this.toDate = null;
        this.fromDate = date;
      }
      this.weekNumberGenerator();
    }
  }

  weekNumberGenerator() {
    let dates = [];
    let week = [];

    let startDate = NgbDate.from(this.fromDate);
    let endDate = NgbDate.from(this.toDate);

    week.push(startDate);
    while (endDate != null && !startDate.equals(endDate)) {
      let date = this.calendar.getNext(startDate, "d", 1);
      startDate = date;
      week.push(date);
      if (week.length == 7) {
        dates.push(week);
        week = [];
      }
    }

    this.weekNumbers = [];
    if (dates.length > 0) {
      for (let date of dates) {
        this.weekNumbers.push(
          "week-" + this.calendar.getWeekNumber(date, this.firstDayOfWeek)
        );
      }
    }
  }

  constructStartDate(date: Date) {
    let firstDayOfWeek = this.firstDayOfWeek;
    return function(constructDate) {
      let startDay = date.getDay() != 0 ? firstDayOfWeek - date.getDay() : -6;
      return constructDate(startDay);
    };
  }

  constructEndDate(date: Date) {
    let firstDayOfWeek = this.firstDayOfWeek;
    return function(constructDate) {
      let endDay = date.getDay() != 0 ? firstDayOfWeek + 6 - date.getDay() : 0;
      return constructDate(endDay);
    };
  }

  buildDate(date: Date) {
    return function(number) {
      let day = date.getDate() + number;
      const dateObject = new Date(date.getFullYear(), date.getMonth(), day);

      let ngbDateObject = {} as NgbDate;
      ngbDateObject.day = day;

      if (ngbDateObject.day > 31 || ngbDateObject.day < 1) {
        ngbDateObject.day = dateObject.getDate();
      }

      ngbDateObject.month = dateObject.getMonth() + 1;
      ngbDateObject.year = dateObject.getFullYear();
      return ngbDateObject;
    };
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  previousWeek() {
    this.toDate = this.calendar.getPrev(this.fromDate, "d", 1);
    this.fromDate = this.calendar.getPrev(
      this.fromDate,
      "d",
      this.calendar.getDaysPerWeek()
    );
    this.weekNumberGenerator();
  }

  nextWeek() {
    this.fromDate = this.calendar.getNext(
      this.fromDate,
      "d",
      this.calendar.getDaysPerWeek()
    );
    this.toDate = this.calendar.getNext(
      this.fromDate,
      "d",
      this.calendar.getDaysPerWeek() - 1
    );
    this.weekNumberGenerator();
  }
}
