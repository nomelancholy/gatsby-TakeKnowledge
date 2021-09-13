import React, { useState, useEffect, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
import moment, { locale } from "moment";
import { format, addMinutes } from "date-fns";
import { FullCalendarLicense } from "@utils/config";

const TimeTable = ({ events, setEvents, calendarRef }) => {
  return (
    <FullCalendar
      ref={calendarRef}
      schedulerLicenseKey={FullCalendarLicense}
      plugins={[interactionPlugin, timegridPlugin]}
      initialView="timeGridWeek"
      height="auto"
      // handleWindowResize={true}
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
      firstDay={1}
      slotDuration={{ hours: 1 }}
      slotMinTime="00:00:00"
      slotMaxTime="24:00:00"
      slotMinWidth={60}
      slotLabelContent={(arg) => {
        const timeHour = format(arg.date, "H시");
        return timeHour;
      }}
      selectable={true}
      select={(info) => {
        console.log(`info`, info);

        // 업데이트되는 events 처리를 위한 배열
        let newEvents = [];

        // 월,화,수,목,금,토,일 -> 1,2,3,4,5,6,7
        // 시작 요일 숫자로 저장
        let startDay = moment(info.start).day();
        // 종료 요일 숫자로 저장
        let endDay = moment(info.end).day();

        // 일요일인 경우 숫자 7로 변경 (full calendar에서 일요일은 0)
        if (startDay === 0) {
          startDay = 7;
        }

        if (endDay === 0) {
          endDay = 7;
        }

        // 시간 추출
        const startTime = moment(info.start).format("HH");
        const endTime = moment(info.end).format("HH");

        const eventObj = {
          start: info.start,
          end: info.end,
          display: "block",
          eventId: `${startDay}${startTime}-${endDay}${endTime}`,
        };

        newEvents = [...events, eventObj];

        setEvents(newEvents);
      }}
      selectOverlap={(event) => {
        console.log(`event`, event);
      }}
      unselectAuto={false}
      events={events}
      eventClick={(info) => {
        // 클릭한 이벤트 삭제
        const id = info.event._def.extendedProps.eventId;

        const newEvents = events.filter((event) => {
          return event.eventId !== id;
        });

        setEvents(newEvents);
      }}
    />
  );
};

export default TimeTable;
