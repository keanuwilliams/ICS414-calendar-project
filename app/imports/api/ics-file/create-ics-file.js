import saveAs from 'file-saver';
import EventInputForm from '../../ui/components/EventInputForm';
// import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

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
  let newLocation;

  // Begin adding event
  eventICS = `BEGIN:VEVENT\nSUMMARY:${event.eventName}\n`;

  // Add start and end date
  if (event.allDay) {
    eventICS += `DTSTART;VALUE=DATE:${start}\nDTEND;VALUE=DATE:${end}\n`;
  } else {
    eventICS += `DTSTART:${start}\nDTEND:${end}\n`;
  }

  // Add frequency if specified
  if (event.repeatFreq !== 'NONE') {
    if (event.repeatFreq === 'YEARLY') {
      eventICS += 'RRULE:FREQ=YEARLY';
    } else if (event.repeatFreq === 'MONTHLY') {
      eventICS += 'RRULE:FREQ=MONTHLY';
    } else if (event.repeatFreq === 'WEEKLY') {
      eventICS += 'RRULE:FREQ=WEEKLY';
    } else if (event.repeatFreq === 'DAILY') {
      eventICS += 'RRULE:FREQ=DAILY';
    }
    if (event.repeatEnd === 'OCCURRENCE') {
      eventICS += `;COUNT=${event.eventCount}`;
    }
    eventICS += '\n';
  }

  // Add geoposition
  if (event.geolocation !== '') {
    eventICS += `GEO:${event.geolocation}\n`;
  }

  // Add location
  if (event.location !== '') {
    const locationArray = event.location.split(',');
    newLocation = '';
    for (let i = 0; i < locationArray.length - 1; i++) {
      newLocation += `${locationArray[i]}\\,`;
    }
    newLocation += locationArray[locationArray.length - 1];
    eventICS += `LOCATION:${newLocation}\n`;
  }

  // Add organizer
  if (event.organizer !== '') {
    if (event.organizer !== event.userEmail) {
      eventICS += `ORGANIZER;SENT-BY="${event.userEmail}":mailto:${event.organizer}\n`;
    } else {
      eventICS += `ORGANIZER:MAILTO:${event.userEmail}\n`;
    }
  }

  // Add attendees
  for (let i = 0; i < event.guests.length; i++) {
    eventICS += `ATTENDEE;RSVP=${event.rsvp.toString().toUpperCase()}:mailto:${
      event.guests[i]
    }\n`;
  }

  // Add resources
  if (event.resources.length > 0) {
    eventICS += `RESOURCES:${event.resources[0].toUpperCase()}`;
    for (let i = 1; i < event.resources.length; i++) {
      eventICS += `,${event.resources[i].toUpperCase()}`;
    }
    eventICS += '\n';
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
   * [x] Geographic Position
   * [x] Location
   * [x] Priority
   * [x] Summary
   * [x] DTSTART
   * [x] DTEND
   * [x] Time zone identifier
   * [x] RSVP
   * [x] Sent-by
   * [x] Resources
   * And aspects of recurring events
   */

  let file = '';

  if (events.length !== 0) {
    // Begin creating the .ics file
    file = 'BEGIN:VCALENDAR\nVERSION:2.0\n';

    // Begin adding the Pacific/Honolulu timezone
    file += 'BEGIN:VTIMEZONE\nTZID:Pacific/Honolulu\n';

    file +=
      'BEGIN:DAYLIGHT\nTZOFFSETFROM:-1030\nTZOFFSETTO:-0930\nDTSTART:19330430T020000\nTZNAME:HDT\nEND:DAYLIGHT\n';

    file +=
      'BEGIN:STANDARD\nTZOFFSETFROM:-1030\nTZOFFSETTO:-1000\nDTSTART:19470608T020000\nTZNAME:HST\nEND:STANDARD\n';

    file += 'END:VTIMEZONE\n';

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
