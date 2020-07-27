import saveAs from 'file-saver';
import EventInputForm from '../../ui/components/EventInputForm';

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
     * Time zone identifier
     * RSVP
     * Sent-by
     * Resources
     * And aspects of recurring events
     */

    let file = '';

    if (events.length !== 0) {
        file =
            'BEGIN:VCALENDAR\n' +
            'VERSION:2.0\n';

        for (let i = 0; i < events.length; i++) {
            file += events[i];
        }
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
