import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import Planner from '../components/Planner';
import EventInputForm from '../components/EventInputForm';
import { createSample } from '../../api/ics-file/create-ics-file';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

    render() {
        return (
            <Grid verticalAlign='middle' textAlign='center' container>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <h1>TheGoblet&apos;s Event Planner!</h1>
                        <p>Click below to download our sample .ics file.</p>
                        <Button content="Download" onClick={ createSample } />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Planner />
                    </Grid.Column>
                    <Grid.Column textAlign='left' width={4}>
                        <EventInputForm />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Landing;
