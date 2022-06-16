import React, { useEffect, useState } from "react";
import "./Calendar.css";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";

import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  addDays,
  isSameDay,
} from "date-fns";

/*
DEPENDENCIES:
$date-fns
$react-icons
*/

function Calendar({ style = null }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => {
    let newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const prevMonth = () => {
    let newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const dateSelected = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="calendar">
      <CalendarHeader
        currentMonth={currentMonth}
        nextMonth={nextMonth}
        previousMonth={prevMonth}
      />
      <CalendarBody
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        dateSelected={dateSelected}
        style={style}
      />
    </div>
  );
}

function CalendarBody({ currentMonth, selectedDate, dateSelected, style }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarData = { monthStart, monthEnd, startDate, endDate };
  const [cells, setCells] = useState(getBodyCells(calendarData));

  useEffect(() => {
    setCells(getBodyCells(calendarData));
  }, [currentMonth]);

  return (
    <div className="calendarBody">
      {cells.map((cell, index) => (
        <Cell
          key={index}
          cellData={cell}
          selectedDate={selectedDate}
          dateSelected={dateSelected}
          style={style}
        />
      ))}
    </div>
  );
}

function Cell({ cellData, selectedDate, dateSelected, style }) {
  return (
    <div
      style={style ? style(cellData.value) : null}
      className={`calendar-cell ${cellData.label ? "label-cell" : "day-cell"} ${
        cellData.sameMonth ? "" : "filler-day"
      } ${cellData.sameMonth && !cellData.label ? "month-day" : ""} ${
        isSameDay(cellData.day, selectedDate) ? "selected-day" : ""
      }`}
      onClick={() => {
        if (cellData.sameMonth) {
          dateSelected(cellData.day);
        }
      }}
    >
      <div>{cellData.value}</div>
    </div>
    /* 
      {cellData.label ? null : <div className="cell-indicator" />}
     */
  );
}

const getBodyCells = (calendarData) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dateFormat = "d";

  let cells = [];

  //Add days of week
  daysOfWeek.forEach((day) =>
    cells.push({
      label: true,
      sameMonth: true,
      value: day,
    })
  );
  //Get days to be displayed
  let day = calendarData.startDate;
  while (day <= calendarData.endDate) {
    cells.push({
      label: false,
      sameMonth: isSameMonth(day, calendarData.monthStart),
      value: format(day, dateFormat),
      day,
    });
    day = addDays(day, 1);
  }

  return cells;
};

function CalendarHeader({ currentMonth, nextMonth, previousMonth }) {
  const dateFormat = "MMMM yyyy";

  return (
    <div className="calendarHeader">
      <div className="calendarHeaderButton" onClick={previousMonth}>
        <FaChevronCircleLeft />
      </div>
      <div className="calendarTitle">{format(currentMonth, dateFormat)}</div>
      <div className="calendarHeaderButton" onClick={nextMonth}>
        <FaChevronCircleRight />
      </div>
    </div>
  );
}

export default Calendar;
