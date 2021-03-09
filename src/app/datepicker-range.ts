import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { NgbDate, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";

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
    `
  ]
})
export class NgbdDatepickerRange {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  firstDayOfWeek: number = 1;
  selectMultipleWeeks: boolean = true;
  counter: number = 0;
  showWeekNumbers: boolean = true;

  constructor(private calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.selectWeek(this.fromDate);
  }

  selectWeek(date: NgbDate) {
    const dateObject = new Date(date.year, date.month - 1, date.day);
    let constructDate = this.buildDate(dateObject);

    if (!this.selectMultipleWeeks) {
      // Get the weekDayNumber and reduce the number to select the date from firstDayOfWeek
      // if zero(sunday) then reduce -6
      this.fromDate = this.constructStartDate(dateObject)(constructDate);

      // Get the weekDayNumber and reduce the number to select the date
      // if zero(sunday) then reduce 0
      this.toDate = this.constructEndDate(dateObject)(constructDate);
      //this.weekNumberGenerator().next();
    } else {
      if (!this.fromDate && !this.toDate) {
        //this.fromDate = date;
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
    console.log(this.fromDate);
    let startDate = this.fromDate;
    let endDate = this.toDate;
    let dates = [];
    while(!(startDate.equals(endDate)))
    {
       let date = this.calendar.getNext(startDate, "d", 1);
       startDate = date;
       dates.push(date);
    }
    console.log(dates);
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
}
