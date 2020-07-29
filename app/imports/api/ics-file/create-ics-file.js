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
   * [x] Time zone identifier
   * RSVP
   * Sent-by
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
      'BEGIN:DAYLIGHT\n';

    file +=
      `TZOFFSETFROM:${getTimezone(false)}\n` +
      'DTSTART:20200308T020000\n';

    // Check if timezone is one that doesn't observe daylight savings
    if (tzid === 'Pacific/Honolulu' ||
      tzid === 'America/Juneau' ||
      tzid === 'America/Puerto_Rico' ||
      tzid === 'America/St_Johns') {

      file += `TZOFFSETTO:${getTimezone(false)}\n`;
    } else {
      file += `TZOFFSETTO:${getTimezone(true)}\n`;
    }

    file += 'END:DAYLIGHT\n';

    // End timezone
    file += 'END:VTIMEZONE\n';

    // Add the events
    for (let i = 0; i < events.length; i++) {
      file += events[i];
    }
    // End the .ics file
    file += 'END:VCALENDAR\n';
  }
  return file;
}

/** Allows the user to save the file */
export function download() {
  const icsFile = createICSFile(EventInputForm.getEvents());
  let success = false;
  if (icsFile !== '') {
    // The comment below used to suppress Blob being undefined
    // eslint-disable-next-line no-undef
    const blob = new Blob([icsFile]);
    saveAs(blob, 'events.ics');
    success = true;
  }
  return success;
}
