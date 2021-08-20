import React, { useState, useEffect, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
// import timegridPlugin from "@fullcalendar/resource-timegrid";
import timelinePlugin from "@fullcalendar/resource-timeline";
import moment, { locale } from "moment";
import { format, addMinutes } from "date-fns";
import { FullCalendarLicense } from "@utils/config";

const TimeTable = ({ events, setEvents }) => {
  const calendarRef = useRef(null);

  const [calendarDateArray, setCalendarDateArray] = useState(undefined);

  useEffect(() => {
    // // 캘린더 시작일
    let calendarStartDate =
      calendarRef.current._calendarApi.currentDataManager.data.dateProfile
        .activeRange.start;

    // calendarStartDate에 그대로 세팅하니 메모리에서 데이터 값이 꼬여서 복사하는 방식으로 진행
    const fullYear = calendarStartDate.getFullYear();
    const month = calendarStartDate.getMonth();
    const date = calendarStartDate.getDate();

    let firstDate = new Date(fullYear, month, date);

    // calendarDateArray에 일주일치 값 추가
    const calendarDateArray = [];

    calendarDateArray.push(firstDate);

    for (let i = 1; i < 7; i++) {
      const nextDate = new Date(fullYear, month, date + i);
      calendarDateArray.push(nextDate);
    }

    setCalendarDateArray(calendarDateArray);
  }, []);

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
        // 하루 클릭 vs 여러날 클릭 처리를 위한 data
        const startYear = info.start.getFullYear();
        const startMonth = info.start.getMonth();
        const startDate = info.start.getDate();

        const endYear = info.end.getFullYear();
        const endMonth = info.end.getMonth();
        const endDate = info.end.getDate();

        // diff 비교를 위해 시간을 제거한 날짜
        const start = moment(new Date(startYear, startMonth, startDate));
        const end = moment(new Date(endYear, endMonth, endDate));

        let diff = moment(end).diff(moment(start), "days");

        // ~24시일 경우 데이터는 다음날 00시로 날아온다.
        // 이 경우 diff를 1 줄여줘야 하기에 시간 확인
        const endHours = info.end.getHours();

        if (endHours === 0) {
          diff = diff - 1;
        }

        // 하루치 / 첫 날 요일
        const day = moment(info.start).day();

        // 배열 filtering과 데이터 전송을 위해 eventId 사용
        // eventId format : 요일/시작-끝
        // 요일 : 0,1,2,3,4,5,6 -> 일, 월, 화, 수, 목, 금, 토

        let newEvents = [];

        if (diff === 0) {
          // 하루치만 클릭한 경우

          // ~24시일 경우 시간 데이터가 00으로 날아오기 때문에
          // 이 경우 eventId에 사용하기 위해서 24로 변경
          const endTime =
            moment(info.end).format("HH") === "00"
              ? "24"
              : moment(info.end).format("HH");

          const eventObj = {
            start: info.start,
            end: info.end,
            display: "block",
            eventId: `${day}/${moment(info.start).format("HH")}-${endTime}`,
          };

          // console.log(`하루치 eventObj`, eventObj);

          newEvents = [...events, eventObj];
        } else {
          // 여러 날을 한꺼번에 클릭한 경우

          const eventArray = [];

          for (let i = 0; i <= diff; i++) {
            let eventObj = {};

            if (i === 0) {
              // 첫 날
              eventObj = {
                start: info.start,
                end: new Date(startYear, startMonth, startDate + 1),
                display: "block",
                eventId: `${day}/${moment(info.start).format("HH")}-24`,
              };

              // console.log(`첫 날 eventObj`, eventObj);
            } else if (i === diff) {
              // 마지막 날
              const date = new Date(startYear, startMonth, startDate + i);

              eventObj = {
                start: date,
                end: info.end,
                display: "block",
                eventId: `${date.getDay()}/00-${moment(info.end).format("HH")}`,
              };

              // console.log(`마지막 날 eventObj`, eventObj);
            } else {
              // 중간 날
              const date = new Date(startYear, startMonth, startDate + i);

              eventObj = {
                start: date,
                end: moment(date).day(i + 1)._d,
                display: "block",
                eventId: `${date.getDay()}/00-24`,
              };

              // console.log(`중간 날 eventObj`, eventObj);
            }
            eventArray.push(eventObj);
          }

          newEvents = [...events, ...eventArray];
        }

        setEvents(newEvents);
      }}
      selectOverlap={(event) => {
        console.log(`event`, event);
      }}
      unselectAuto={false}
      events={events}
      eventClick={(info) => {
        console.log(`info`, info);
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
