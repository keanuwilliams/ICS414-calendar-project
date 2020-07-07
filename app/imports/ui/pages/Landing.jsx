import React from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import { createSample } from '../../api/ics-file/create-ics-file';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

    render() {
        return (
            <Grid verticalAlign='middle' textAlign='center' container>

                <Grid.Column width={4}>
                    <Image size='small' circular src="/images/meteor-logo.png"/>
                </Grid.Column>

                <Grid.Column width={8}>
                    <h1>Team The Goblet&apos;s Calendar Template!</h1>
                    <p>Click down below to download our sample .ics file.</p>
                    <Button content="Download" onClick={createSample} />
                </Grid.Column>

            </Grid>
        );
    }
}

export default Landing;
