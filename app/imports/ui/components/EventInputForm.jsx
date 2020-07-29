import React from 'react';
import {
  Container,
  Form,
  Segment,
  Checkbox,
  Select,
  Message,
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import 'react-google-places-autocomplete/dist/index.min.css';

const events = []; // Events to be added to .ics file
const eventsToDisplay = []; // Events to be displayed
const priorityOptions = [
  // The options for priority field in form
  { key: 'n', text: 'None', value: 0 },
  { key: 'l', text: 'Low', value: 6 },
  { key: 'm', text: 'Medium', value: 5 },
  { key: 'h', text: 'High', value: 1 },
];
const classOptions = [
  { key: 'pub', text: 'Public', value: 'PUBLIC' },
  { key: 'pri', text: 'Private', value: 'PRIVATE' },
  { key: 'con', text: 'Confidential', value: 'CONFIDENTIAL' },
];

class EventInputForm extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      startDate: '',
      endDate: '',
      allDay: false,
      priority: 0,
      classification: 'PUBLIC',
      success: '',
      error: '',
    };
  }

  /** Get the events that were added by the event form */
  static getEvents() {
    return events;
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  startDateChange = (date) => {
    this.setState({ startDate: date });
  };

  endDateChange = (date) => {
    this.setState({ endDate: date });
  };

  handleAllDay = () => this.setState((prevState) => ({ allDay: !prevState.allDay }));

  /** Convert user-input date to date to be used in .ics file */
  convertDate = (date) => {
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
  };

  /** Add an event to the events array */
  addEvent = () => {
    let event; // Event to be added
    const start = this.convertDate(this.state.startDate);
    const end = this.convertDate(this.state.endDate);

    event = `BEGIN:VEVENT\nSUMMARY:${this.state.eventName}\n`;

    if (this.state.allDay === true) {
      event += `DTSTART;VALUE=DATE:${start}\nDTEND;VALUE=DATE:${end}\n`;
    } else {
      event += `DTSTART:${start}\nDTEND:${end}\n`;
    }

    event +=
      `PRIORITY:${this.state.priority}\n` +
      `CLASS:${this.state.classification}\n` +
      'END:VEVENT\n';

    events.push(event);
    console.log(event);
  };

  addToEventDisplay = () => {
    const start = this.state.startDate.toISOString();
    const end = this.state.endDate.toISOString();

    const event = [
      { name: 'eventName', value: this.state.eventName },
      { name: 'startDate', value: start },
      { name: 'endDate', value: end },
      { name: 'priority', value: this.state.priority },
      { name: 'classification', value: this.state.classification },
    ];
    eventsToDisplay.push(event);
    console.log(event);
  };

  /** Handles the errors then submits the form. */
  submit = () => {
    // If incorrect dates and times
    if (
      this.state.startDate > this.state.endDate &&
      this.state.allDay === false
    ) {
      // Display error message
      this.setState({ error: 'The start date begins after the end date.' });
      this.setState({ success: '' });
    } else if (this.state.startDate === '' || this.state.endDate === '') {
      // If dates are empty
      // Display error message
      this.setState({ error: 'Please enter a start and end date.' });
      this.setState({ success: '' });
    } else {
      // Else add the event
      // Add event to events array for both the display and the .ics file
      this.addEvent();
      this.addToEventDisplay();
      // Remove error message if there was one
      this.setState({ error: '' });
      // Add success message
      this.setState({
        success: `'${this.state.eventName}' successfully added.`,
      });
      this.resetForm();
    }
  };

  /** Reset the form */
  resetForm = () => {
    this.setState({
      eventName: '',
      startDate: '',
      endDate: '',
      allDay: false,
      priority: 0,
      classification: 'PUBLIC',
    });
  };

  render() {
    const messageStyle = { marginBottom: '30px' };
    return (
      <Container>
        <Form onSubmit={this.submit}>
          <Segment>
            <h3>Create Event</h3>
            <Form.Input
              required
              name='eventName'
              placeholder='Event Name'
              value={this.state.eventName}
              onChange={this.handleChange}
            />
            {this.state.allDay === false ? (
              <Form.Group>
                {/* The Start Date Input */}
                <Form.Input required label='Start Date'>
                  <DatePicker
                    isClearable
                    name='startDate'
                    placeholderText='Start Date'
                    todayButton='Today'
                    selected={this.state.startDate}
                    onChange={this.startDateChange}
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    maxDate={this.state.endDate}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat='MM/dd/yyyy hh:mm aa'
                  />
                </Form.Input>
                {/* The End Date Input */}
                <Form.Input required label='End Date'>
                  <DatePicker
                    isClearable
                    name='endDate'
                    placeholderText='End Date'
                    todayButton='Today'
                    selected={this.state.endDate}
                    onChange={this.endDateChange}
                    selectsEnd
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    minDate={this.state.startDate}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat='MM/dd/yyyy hh:mm aa'
                  />
                </Form.Input>
              </Form.Group>
            ) : (
              <Form.Group>
                {/* The Start Date Input */}
                <Form.Input fluid required label='Start Date'>
                  <DatePicker
                    isClearable
                    name='startDate'
                    placeholderText='Start Date'
                    todayButton='Today'
                    selected={this.state.startDate}
                    onChange={this.startDateChange}
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    maxDate={this.state.endDate}
                    dateFormat='MM/dd/yyyy'
                  />
                </Form.Input>
                {/* The End Date Input */}
                <Form.Input fluid required label='End Date'>
                  <DatePicker
                    isClearable
                    name='endDate'
                    placeholderText='End Date'
                    todayButton='Today'
                    selected={this.state.endDate}
                    onChange={this.endDateChange}
                    selectsEnd
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    minDate={this.state.startDate}
                    dateFormat='MM/dd/yyyy'
                  />
                </Form.Input>
              </Form.Group>
            )}
            <Form.Field
              control={Checkbox}
              label='All Day'
              onChange={this.handleAllDay}
              checked={this.state.allDay}
            />
            <Form.Group>
              <Form.Field
                control={Select}
                name='priority'
                label='Priority'
                options={priorityOptions}
                onChange={this.handleChange}
                value={this.state.priority}
              />
              <Form.Field
                control={Select}
                name='classification'
                label='Classification'
                options={classOptions}
                onChange={this.handleChange}
                value={this.state.classification}
              />
            </Form.Group>
            <Form.Button secondary content='Add Event' />
          </Segment>
        </Form>
        {this.state.error === '' ? (
          ''
        ) : (
          <Message
            error
            style={messageStyle}
            header='ERROR'
            content={this.state.error}
          />
        )}
        {this.state.success === '' ? (
          ''
        ) : (
          <Message
            success
            style={messageStyle}
            header='EVENT ADDED'
            content={this.state.success}
          />
        )}
      </Container>
    );
  }
}

export default EventInputForm;
