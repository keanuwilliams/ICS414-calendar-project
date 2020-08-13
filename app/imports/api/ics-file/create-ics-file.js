import saveAs from "file-saver";
import EventInputForm from "../../ui/components/EventInputForm";

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
  let until;
  let currentDate;

  if (event.repeatFreq !== "NONE" && event.repeatEnd === "UNTIL") {
    until = convertDate(event.repeatUntil, false);
  }

  // Begin adding event
  eventICS = `BEGIN:VEVENT\r\nSUMMARY:${event.eventName}\r\n`;

  // Create unique value for UID, current time in milliseconds
  eventICS += `UID:${Date.now()}@hawaii.edu\r\n`;

  // Add DTSTAMP for current time event was created
  currentDate = new Date();
  eventICS += `DTSTAMP:${convertDate(currentDate.toISOString(), false)}\r\n`;

  // Add start and end date
  if (event.allDay) {
    eventICS += `DTSTART;VALUE=DATE:${start}\nDTEND;VALUE=DATE:${end}\r\n`;
  } else {
    eventICS += `DTSTART:${start}\nDTEND:${end}\r\n`;
  }

  // Add recurring details if specified
  if (event.repeatFreq !== "NONE") {
    if (event.repeatFreq === "YEARLY") {
      eventICS += "RRULE:FREQ=YEARLY";
    } else if (event.repeatFreq === "MONTHLY") {
      eventICS += "RRULE:FREQ=MONTHLY";
    } else if (event.repeatFreq === "WEEKLY") {
      eventICS += "RRULE:FREQ=WEEKLY";
    } else if (event.repeatFreq === "DAILY") {
      eventICS += "RRULE:FREQ=DAILY";
    }
    if (event.repeatEnd === "OCCURRENCE") {
      eventICS += `;COUNT=${event.repeatCount}`;
    } else if (event.repeatEnd === "UNTIL") {
      eventICS += `;UNTIL=${until}`;
    }
    if (event.repeatInterval !== 1) {
      eventICS += `;INTERVAL=${event.repeatInterval}`;
    }
    eventICS += "\r\n";
  }

  // Add geoposition
  if (event.geolocation !== "") {
    eventICS += `GEO:${event.geolocation}\r\n`;
  }

  // Add location
  if (event.location !== "") {
    const locationArray = event.location.split(",");
    newLocation = "";
    for (let i = 0; i < locationArray.length - 1; i++) {
      newLocation += `${locationArray[i]}\\,`;
    }
    newLocation += locationArray[locationArray.length - 1];
    eventICS += `LOCATION:${newLocation}\r\n`;
  }

  // Add organizer
  if (event.organizer !== "") {
    if (event.organizer !== event.userEmail) {
      eventICS += `ORGANIZER;SENT-BY="${event.userEmail}":mailto:${event.organizer}\r\n`;
    } else {
      eventICS += `ORGANIZER:MAILTO:${event.userEmail}\r\n`;
    }
  }

  // Add attendees
  for (let i = 0; i < event.guests.length; i++) {
    eventICS += `ATTENDEE;RSVP=${event.rsvp.toString().toUpperCase()}:mailto:${
      event.guests[i]
    }\r\n`;
  }

  // Add resources
  if (event.resources.length > 0) {
    eventICS += `RESOURCES:${event.resources[0].toUpperCase()}`;
    for (let i = 1; i < event.resources.length; i++) {
      eventICS += `,${event.resources[i].toUpperCase()}`;
    }
    eventICS += "\r\n";
  }

  // Add priority and classification then end
  eventICS +=
    `PRIORITY:${event.priority}\r\n` +
    `CLASS:${event.classification}\r\n` +
    "END:VEVENT\r\n";

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

  let file = "";

  if (events.length !== 0) {
    // Begin creating the .ics file
    file =
      "BEGIN:VCALENDAR\r\nPRODID:-//Team Goblet//ICS-414//SU2020\r\nVERSION:2.0\r\n";

    // Begin adding the Pacific/Honolulu timezone
    file += "BEGIN:VTIMEZONE\r\nTZID:Pacific/Honolulu\r\n";

    file +=
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-1030\r\nTZOFFSETTO:-0930\r\nDTSTART:19330430T020000\r\nTZNAME:HDT\r\nEND:DAYLIGHT\r\n";

    file +=
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1030\r\nTZOFFSETTO:-1000\r\nDTSTART:19470608T020000\r\nTZNAME:HST\r\nEND:STANDARD\r\n";

    file += "END:VTIMEZONE\r\n";

    // Add the events
    for (let i = 0; i < events.length; i++) {
      file += convertEvent(events[i]);
    }
    // End the .ics file
    file += "END:VCALENDAR\r\n";
  }
  return file;
}

/** Allows the user to save the file */
export function download() {
  const icsFile = createICSFile(EventInputForm.getEvents());
  const userEmail = EventInputForm.getUserEmail();
  let success = false;
  if (icsFile !== "") {
    if (userEmail === "") {
      // The comment below used to suppress Blob being undefined
      // eslint-disable-next-line no-undef
      const blob = new Blob([icsFile]);
      saveAs(blob, "events.ics");
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
