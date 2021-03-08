import { Component } from "@angular/core";
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

  constructor(calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.selectWeek(this.fromDate);
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  /*  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    console.log(this.toDate);
    let toDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
    
  }*/

  selectWeek(date: NgbDate) {
    const d = new Date(date.year, date.month - 1, date.day);
    let constructDate = this.buildDate(d);

    // Get the weekDayNumber and reduce the number to select the date from monday
    // if zero(sunday) then reduce -6
    let startFromMonday = d.getDay() != 0 ? 1 - d.getDay() : -6;
    this.fromDate = constructDate(startFromMonday);

    // Get the weekDayNumber and reduce the number to select the date from sunday
    // if zero(sunday) then reduce 0
    let endAtSunday = d.getDay() != 0 ? 7 - d.getDay() : 0;
    this.toDate = constructDate(endAtSunday);
  }

  buildDate(date) {
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

  isDisabled(date: NgbDate) {
    const d = new Date(date.year, date.month - 1, date.day);
    console.log(typeof d.getDay());
    switch (d.getDay()) {
      case 0:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return true;
      default:
        return false;
    }
  }
}
