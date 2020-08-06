import React from 'react';
import { Grid } from 'semantic-ui-react';
import EventInputForm from '../components/EventInputForm';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

    render() {
        return (
            <Grid textAlign='center' container>
                <Grid.Row verticalAlign='top'>
                    <Grid.Column textAlign='left' width={16}>
                        <EventInputForm />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Landing;
