import React from 'react';
import { Grid, Button, Message } from 'semantic-ui-react';
import { download } from '../../api/ics-file/create-ics-file';
import EventInputForm from '../components/EventInputForm';
import EventDisplay from '../components/EventDisplay';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

    constructor(props) {
        super(props);
        this.state = { success: true };
    }

    downloadSuccess = () => {
        this.setState({ success: download });
    }

    render() {
        return (
            <Grid textAlign='center' container>
                <Grid.Row>
                    <Grid.Column>
                        <h1>TheGoblet&apos;s Event Planner</h1>
                        <p>Click the button below to download your file.</p>
                        <Button
                            content='Download File'
                            onClick={ this.downloadSuccess }
                        />
                    </Grid.Column>
                </Grid.Row>
                { this.state.success !== true ? (
                    <Grid.Row>
                        <Grid.Column textAlign='left' width={14}>
                            <Message
                                error
                                floating
                                header='ERROR'
                                content='Please add an event before trying to download.'
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) : ('')}
                <Grid.Row verticalAlign='top'>
                    <Grid.Column textAlign='left' width={7}>
                        <EventInputForm />
                    </Grid.Column>
                    <Grid.Column textAlign='left' width={7}>
                        <EventDisplay />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Landing;
