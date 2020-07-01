import React from 'react';
import {Grid, Image, Button} from 'semantic-ui-react';
import '../../../imports/api/ics-file/create-ics-file.test';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

    constructor(props) {
        super(props);
    }

    downloadICSFile = () => {
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
            'DTSTAMP;TZID=Pacific/Honolulu;VALUE=DATE-TIME:20200701T002526Z\n'+
            'DTSTART;TZID=Pacific/Honolulu;VALUE=DATE-TIME:20200701T120000Z\n'+
            'DTEND;TZID=Pacific/Honolulu;VALUE=DATE-TIME:20200701T121000Z\n'+
            'END:VEVENT\n';

        // End .ics file
        file += 'END:VCALENDAR\n';

        let blob = new Blob([file]);
        saveAs(blob, "example.ics");
        return file;
    };

    render() {
        return (
            <Grid verticalAlign='middle' textAlign='center' container>

                <Grid.Column width={4}>
                    <Image size='small' circular src="/images/meteor-logo.png"/>
                </Grid.Column>

                <Grid.Column width={8}>
                    <h1>Team The Goblet's Calendar Template!</h1>
                    <p>Click down below to download our sample .ics file.</p>
                    <Button content="Download" onClick={this.downloadICSFile}/>
                </Grid.Column>

            </Grid>
        );
    }
}

export default Landing;
