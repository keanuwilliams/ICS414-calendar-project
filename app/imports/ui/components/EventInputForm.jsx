import React from 'react';
import { Button, Form, Segment, Header } from 'semantic-ui-react';

class EventInputForm extends React.Component {
    render() {
        return (
            <Form>
                <Segment>
                    <Header as='h3'>Add Event</Header>
                    <Form.Input
                        required
                        label='Event Name'
                        placeholder='Event Name'
                    />
                    <Form.Input required label='Start Date'>
                        
                    </Form.Input>
                    <Button type='submit' content='Add Event' />
                </Segment>
            </Form>
        );
    }
}

export default EventInputForm;
