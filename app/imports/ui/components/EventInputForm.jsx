import React from 'react';
import { Form, Segment, Checkbox } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class EventInputForm extends React.Component {

    /** Initialize state fields. */
    constructor(props) {
        super(props);
        this.state = { startDate: '', endDate: '', allDay: false };
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
            // Display error message
        // Else add the event
            // Handle all day events
    }

    render() {
        return (
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
        );
    }
}

export default EventInputForm;
