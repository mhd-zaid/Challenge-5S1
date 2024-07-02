import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import dayjs from 'dayjs';

const Calendar = ({ user, plannings, setEvent }) => {
  const handleEventClick = (clickInfo) => {
      setEvent(clickInfo.event);
  };

  const handleDateSelect = (selectInfo) => {
    const date = dayjs(selectInfo.dateStr).format('YYYY-MM-DD');
    setEvent({ start: date });
  };

  const renderEventContent = (eventInfo) => (
    <>
      <p>{eventInfo.event.extendedProps.employeeFullName}</p>
      <p>{eventInfo.event.extendedProps.studioName}</p>
    </>
  );

  return (
    <FullCalendar
      locales={[frLocale]}
      plugins={[timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay',
      }}
      allDaySlot={false}
      eventClick={handleEventClick}
      eventContent={renderEventContent}
      dateClick={user.roles.includes('ROLE_PRESTA') ? handleDateSelect : null}
      selectMirror={true}
      initialView="timeGridWeek"
      events={plannings}
    />
  );
};

export default Calendar;
