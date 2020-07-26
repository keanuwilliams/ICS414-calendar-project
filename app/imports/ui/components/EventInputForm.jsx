import React from 'react';
import { Container, Form, Segment, Checkbox, Message } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/** The events to be added to the .ics file */
const events = [];

class EventInputForm extends React.Component {

    /** Initialize state fields. */
    constructor(props) {
        super(props);
        this.state = {
            eventName: '',
            startDate: '',
            endDate: '',
            allDay: false,
            success: '',
            error: '' };
    }

    /** Update the form controls each time the user interacts with them. */
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    startDateChange = date => {
        this.setState({ startDate: date });
    };

    endDateChange = date => {
        this.setState({ endDate: date });
    };

    handleAllDay = () => this.setState((prevState) => ({ allDay: !prevState.allDay }));

    /** Returns the user's timezone number (i.e., -10, -9, etc.) */
    getTimezone = () => -(new Date().getTimezoneOffset() / 60)

    /** Convert user-input date to date to be used in .ics file */
    convertDate = date => {
        let icsDate; // The date to be returned
        const dateString = date.toISOString();
        const year = dateString.substr(0, 4);
        const day = dateString.substr(8, 2);
        const month = dateString.substr(5, 2);
        if (this.state.allDay === false) {
            const hour = dateString.substr(11, 2);
            const min = dateString.substr(14, 2);
            const time = `T${hour}${min}00Z`;
            icsDate = year + month + day + time;
        } else {
            icsDate = year + month + day;
        }
        return icsDate;
    }

    /** Add an event to the events array */
    addEvent = () => {

        let event; // Event to be added
        const start = this.convertDate(this.state.startDate);
        const end = this.convertDate(this.state.endDate);

        if (this.state.allDay === true) {
            event =
                'BEGIN:VEVENT\n' +
                `SUMMARY:${this.state.eventName}\n` +
                `DTSTART;VALUE=DATE:${start}\n` +
                `DTEND;VALUE=DATE:${end}\n` +
                'END:VEVENT';
        } else {
            event =
                'BEGIN:VEVENT\n' +
                `SUMMARY:${this.state.eventName}\n` +
                `DTSTART:${start}\n` +
                `DTEND:${end}\n` +
                'END:VEVENT';
        }

        events.push(event);
        console.log(event);
    }

    /** Handles the errors then submits the form. */
    submit = () => {
        // If incorrect dates and times
        if ((this.state.startDate > this.state.endDate) && (this.state.allDay === false)) {
            // Display error message
            this.setState({ error: 'The start date begins after the end date.' });
            this.setState({ success: '' });
        } else if (this.state.startDate === '' || this.state.endDate === '') { // If dates are empty
            // Display error message
            this.setState({ error: 'Please enter a start and end date.' });
            this.setState({ success: '' });
        } else { // Else add the event
            // Add event to events
            this.addEvent();
            // Remove error message if there was one
            this.setState({ error: '' });
            // Add success message
            this.setState({ success: `"${this.state.eventName}" successfully added.` });
            this.resetForm();
        }
    }

    /** Reset the form */
    resetForm = () => {
        this.setState({
            eventName: '',
            startDate: '',
            endDate: '',
            allDay: false });
    }

    /** Create the .ics file to be downloaded by the user */
    createICSFile() {
        /** Implement required functionality
         * Version
         * Classification (i.e., public, private, confidential)
         * Geographic Position
         * Location
         * Priority
         * Summary [x]
         * DTSTART
         * DTEND
         * Time zone identifier
         * RSVP
         * Sent-by
         * Resources
         * And aspects of recurring events
         */
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
                            name='eventName'
                            placeholder='Event Name'
                            value={this.state.eventName}
                            onChange={ this.handleChange }
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
                                    checked={this.state.allDay}
                        />
                        <Form.Button secondary content='Add Event' />
                    </Segment>
                </Form>
                {this.state.error === '' ? (
                    ''
                ) : (
                    <Message
                        error
                        style={ messageStyle }
                        header="ERROR"
                        content={ this.state.error }
                    />
                )}
                {this.state.success === '' ? (
                    ''
                ) : (
                    <Message
                        success
                        style={ messageStyle }
                        header="EVENT ADDED"
                        content={ this.state.success }
                    />
                )}
            </Container>
        );
    }
}

export default EventInputForm;
