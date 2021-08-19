import React, { useState, useEffect, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
// import timegridPlugin from "@fullcalendar/resource-timegrid";
import timelinePlugin from "@fullcalendar/resource-timeline";
import moment, { locale } from "moment";
import { format, addMinutes } from "date-fns";
import { FullCalendarLicense } from "@utils/config";

const TimeTable = (props) => {
  const calendarRef = useRef(null);

  return (
    <FullCalendar
      ref={calendarRef}
      schedulerLicenseKey={FullCalendarLicense}
      plugins={[interactionPlugin, timegridPlugin]}
      initialView="timeGridWeek"
      height="auto"
      handleWindowResize={true}
      headerToolbar={{
        left: "",
        center: "",
        right: "",
      }}
      dayHeaderContent={(date) => {
        let weekList = ["일", "월", "화", "수", "목", "금", "토"];
        return weekList[date.dow];
      }}
      allDaySlot={false}
      slotDuration={{ hours: 1 }}
      slotMinTime="00:00:00"
      slotMaxTime="24:00:00"
      slotMinWidth={60}
      slotLabelContent={(arg) => {
        const timeHour = format(arg.date, "H시");
        return timeHour;
      }}
      selectable={true}
      select={(info, start, end, jsEvent, view) => {
        console.log(`select info`, info);
        console.log(`calendarRef`, calendarRef);
      }}
      selectOverlap={(event) => {
        console.log(`event`, event);
      }}
      unselectAuto={false}
    />
  );
};

export default TimeTable;
