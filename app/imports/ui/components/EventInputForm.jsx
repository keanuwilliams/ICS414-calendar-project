import React from 'react';
import { Container, Form, Segment, Checkbox, Message } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class EventInputForm extends React.Component {

    /** Initialize state fields. */
    constructor(props) {
        super(props);
        this.state = { startDate: '', endDate: '', allDay: false, error: '' };
    }

    /** Update the form controls each time the user interacts with them. */
    startDateChange = date => {
        this.setState({ startDate: date });
    };

    endDateChange = date => {
        this.setState({ endDate: date });
    };

    handleAllDay = () => this.setState((prevState) => ({ allDay: !prevState.allDay }));

    /** Handles the errors then submits the form. */
    submit = () => {
        // If incorrect dates and times
        if ((this.state.startDate > this.state.endDate) && (this.state.allDay === false)) {
            // Display error message
            this.setState({ error: 'The start date begins after the end date.' });
        } else { // Else add the event
            // Remove error message if there was one
            this.setState({ error: '' });
            // Handle all day events
        }
    }

    render() {
        const messageStyle = { marginBottom: '30px' };
        return (
            <Container>
                <Form onSubmit={ this.submit }>
                    <Segment>
                        <h3>Create Event</h3>
                        <Form.Input
                            required
                            placeholder='Event Name'
                        />
                        { this.state.allDay === false ? (
                            <Form.Group>
                                { /* The Start Date Input */ }
                                <Form.Input required label='Start Date'>
                                    <DatePicker
                                        isClearable
                                        name='startDate'
                                        placeholderText='Start Date'
                                        todayButton='Today'
                                        selected={ this.state.startDate }
                                        onChange={ this.startDateChange }
                                        selectsStart
                                        startDate={ this.state.startDate }
                                        endDate={ this.state.endDate }
                                        maxDate={ this.state.endDate }
                                        showTimeSelect
                                        timeIntervals={ 15 }
                                        dateFormat='MM/dd/yyyy hh:mm aa'
                                    />
                                </Form.Input>
                                { /* The End Date Input */ }
                                <Form.Input required label='End Date'>
                                    <DatePicker
                                        isClearable
                                        name='endDate'
                                        placeholderText='End Date'
                                        todayButton='Today'
                                        selected={ this.state.endDate }
                                        onChange={ this.endDateChange }
                                        selectsEnd
                                        startDate={ this.state.startDate }
                                        endDate={ this.state.endDate }
                                        minDate={ this.state.startDate }
                                        showTimeSelect
                                        timeIntervals={ 15 }
                                        dateFormat='MM/dd/yyyy hh:mm aa'
                                    />
                                </Form.Input>
                            </Form.Group>
                        ) : (
                            <Form.Group>
                                { /* The Start Date Input */ }
                                <Form.Input fluid required label='Start Date'>
                                    <DatePicker
                                        isClearable
                                        name='startDate'
                                        placeholderText='Start Date'
                                        todayButton='Today'
                                        selected={ this.state.startDate }
                                        onChange={ this.startDateChange }
                                        selectsStart
                                        startDate={ this.state.startDate }
                                        endDate={ this.state.endDate }
                                        maxDate={ this.state.endDate }
                                        dateFormat='MM/dd/yyyy'
                                    />
                                </Form.Input>
                                { /* The End Date Input */ }
                                <Form.Input fluid required label='End Date'>
                                    <DatePicker
                                        isClearable
                                        name='endDate'
                                        placeholderText='End Date'
                                        todayButton='Today'
                                        selected={ this.state.endDate }
                                        onChange={ this.endDateChange }
                                        selectsEnd
                                        startDate={ this.state.startDate }
                                        endDate={ this.state.endDate }
                                        minDate={ this.state.startDate }
                                        dateFormat='MM/dd/yyyy'
                                    />
                                </Form.Input>
                            </Form.Group>
                        )}
                        <Form.Field control={ Checkbox }
                                    label='All Day'
                                    onChange={ this.handleAllDay }
                        />
                        <Form.Button secondary content='Add Event' />
                    </Segment>
                </Form>
                {this.state.error === '' ? (
                    ''
                ) : (
                    <Message
                        error
                        style={messageStyle}
                        header="ERROR: invalid input"
                        content={this.state.error}
                    />
                )}
            </Container>
        );
    }
}

export default EventInputForm;
