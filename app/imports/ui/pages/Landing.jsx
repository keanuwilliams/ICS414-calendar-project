import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import EventInputForm from '../components/EventInputForm';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

    render() {
        return (
            <Grid verticalAlign='middle' textAlign='center' container>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <h1>TheGoblet&apos;s Event Planner!</h1>
                        <p>Start creating events down below to get started.</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='left' width={7}>
                        <EventInputForm />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Landing;
