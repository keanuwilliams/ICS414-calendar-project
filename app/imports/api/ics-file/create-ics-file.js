import saveAs from 'file-saver';
import EventInputForm from '../../ui/components/EventInputForm';

/** Returns the user's timezone offset (i.e., -1000, -0900, etc.) */
function getTimezone(dst) {
  let offset = -(new Date().getTimezoneOffset() / 60) * 100;
  if (dst) {
    offset += 100;
    offset.toString();
    if (offset.length < 4) {
      offset = `-0${offset.substr(1, 3)}`;
    }
  } else {
    offset.toString();
    if (offset.length < 4) {
      offset = `-0${offset.substr(1, 3)}`;
    }
  }
  return offset;
}

/** Convert user-input date to date to be used in .ics file */
function convertDate(date, allDay) {
  let icsDate; // The date to be returned
  const dateString = date;
  const year = dateString.substr(0, 4);
  const day = dateString.substr(8, 2);
  const month = dateString.substr(5, 2);
  if (!allDay) {
    const hour = dateString.substr(11, 2);
    const min = dateString.substr(14, 2);
    const time = `T${hour}${min}00Z`;
    icsDate = year + month + day + time;
  } else {
    icsDate = year + month + day;
  }
  return icsDate;
}

/** Make .ics file event components given event */
function convertEvent(event) {
  let eventICS; // Event to be added
  const start = convertDate(event.startDate, event.allDay);
  const end = convertDate(event.endDate, event.allDay);

  // Begin adding event
  eventICS = `BEGIN:VEVENT\nSUMMARY:${event.eventName}\n`;

  // Add start and end date
  if (event.allDay) {
    eventICS += `DTSTART;VALUE=DATE:${start}\nDTEND;VALUE=DATE:${end}\n`;
  } else {
    eventICS += `DTSTART:${start}\nDTEND:${end}\n`;
  }

  // Add organizer
  if (event.organizer !== '') {
    if (event.organizer !== event.userEmail) {
      eventICS += `ORGANIZER;SENT-BY="${event.userEmail}:"mailto:${event.organizer}\n`;
      eventICS += `ATTENDEE;RSVP=${event.rsvp.toString().toUpperCase()}:mailto:${event.userEmail}\n`;
    } else {
      eventICS += `ORGANIZER:MAILTO:${event.userEmail}\n`;
    }
  }

  // Add attendees
  for (let i = 0; i < event.guests.length; i++) {
    eventICS += `ATTENDEE;RSVP=${event.rsvp.toString().toUpperCase()}:mailto:${event.guests[i]}\n`;
  }

  // Add priority and classification then end
  eventICS +=
    `PRIORITY:${event.priority}\n` +
    `CLASS:${event.classification}\n` +
    'END:VEVENT\n';

  return eventICS;
}

/** Create the .ics file to be downloaded by the user */
function createICSFile(events) {
  /** Implement required functionality
   * [x] Version
   * [x] Classification (i.e., public, private, confidential)
   * Geographic Position
   * Location
   * [x] Priority
   * [x] Summary
   * [x] DTSTART
   * [x] DTEND
   * [?] Time zone identifier
   * [x] RSVP
   * [x] Sent-by
   * Resources
   * And aspects of recurring events
   */

  const tzid = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  let file = '';

  if (events.length !== 0) {
    // Begin creating the .ics file
    file =
      'BEGIN:VCALENDAR\n' +
      'VERSION:2.0\n';

    // Begin adding the timezone
    file +=
      'BEGIN:VTIMEZONE\n' +
      `TZID:${tzid}\n` +
      'BEGIN:STANDARD\n';

    // Check if timezone is one that doesn't observe daylight savings
    if (tzid === 'Pacific/Honolulu' ||
      tzid === 'America/Juneau' ||
      tzid === 'America/Puerto_Rico' ||
      tzid === 'America/St_Johns') {

      file += `TZOFFSETFROM:${getTimezone(false)}\n`;
    } else {
      file += `TZOFFSETFROM:${getTimezone(true)}\n`;
    }

    file +=
      'DTSTART:20201101T020000\n' +
      `TZOFFSETTO:${getTimezone(false)}\n` +
      'END:STANDARD\n' +
      'END:TIMEZONE\n';

    // Add the events
    for (let i = 0; i < events.length; i++) {
      file += convertEvent(events[i]);
    }
    // End the .ics file
    file += 'END:VCALENDAR\n';
  }
  return file;
}

/** Allows the user to save the file */
export function download() {
  const icsFile = createICSFile(EventInputForm.getEvents());
  const userEmail = EventInputForm.getUserEmail();
  let success = false;
  if (icsFile !== '') {
    if (userEmail === '') {
      // The comment below used to suppress Blob being undefined
      // eslint-disable-next-line no-undef
      const blob = new Blob([icsFile]);
      saveAs(blob, 'events.ics');
    } else {
      // The comment below used to suppress Blob being undefined
      // eslint-disable-next-line no-undef
      const blob = new Blob([icsFile]);
      saveAs(blob, `${userEmail}.ics`);
    }
    success = true;
  }
  return success;
}
