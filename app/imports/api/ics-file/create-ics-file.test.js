/**
 * Creates the sample .ics file
 * @author Keanu Williams
 */

import saveAs from 'file-saver';

function icsFile () {

    // The beginning of the file
    let file =
        'BEGIN:VCALENDAR\n'+
        'PRODID:-//Apple Inc.//Mac OS X 10.15.5//EN\n'+
        'VERSION:2.0\n'+
        'CALSCALE:GREGORIAN\n';

    // Add sample event
    file +=
        'BEGIN:VEVENT\n'+
        'SUMMARY:ICS414 Meeting #2\n'+
        'DESCRIPTION:Meet up with Nancy to discuss the progress we are making with our project.\n'+
        'DTSTAMP:20200701T002526Z\n'+
        'DTSTART:20200701T120000Z\n'+
        'DTEND:20200701T121000Z\n'+
        'END:VEVENT\n';

    // End .ics file
    file += 'END:VCALENDAR\n';

    let blob = new Blob([file]);
    saveAs(blob, "example.ics");
    return file;
}