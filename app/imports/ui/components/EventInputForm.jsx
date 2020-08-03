import React from 'react';
import {
  Grid,
  Card,
  Form,
  Segment,
  Checkbox,
  Select,
  Input,
  Button,
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
      guest: '',
      rsvp: false,
      guests: [],
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

  handleRSVP = () => this.setState((prevState) => ({ rsvp: !prevState.rsvp }));

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

    // Begin adding event
    event = `BEGIN:VEVENT\nSUMMARY:${this.state.eventName}\n`;

    // Add start and end date
    if (this.state.allDay === true) {
      event += `DTSTART;VALUE=DATE:${start}\nDTEND;VALUE=DATE:${end}\n`;
    } else {
      event += `DTSTART:${start}\nDTEND:${end}\n`;
    }

    // Add attendees
    for (let i = 0; i < this.state.guests.length; i++) {
      event += `ATTENDEE;RSVP=${this.state.rsvp.toString().toUpperCase()}:mailto:${this.state.guests[i]}\n`;
    }

    // Add priority and classification then end
    event +=
      `PRIORITY:${this.state.priority}\n` +
      `CLASS:${this.state.classification}\n` +
      'END:VEVENT\n';

    this.forceUpdate();
    events.push(event);
    console.log(event);
  };

  addToEventDisplay = () => {
    const start = this.state.startDate.toISOString();
    const end = this.state.endDate.toISOString();

    const event = {
      eventName: this.state.eventName,
      startDate: start,
      endDate: end,
      priority: this.state.priority,
      class: this.state.classification,
      guests: this.state.guests,
    };

    eventsToDisplay.push(event);
    console.log(event);
  };

  /** Code from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
   *  Used to validate an email address */
  validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  }

  /** Add guest to guest array */
  addGuest = () => {
    if (this.state.guest === '') {
      this.setState({ error: 'email is empty.' });
    } else if (!this.validateEmail(this.state.guest)) {
      this.setState({ error: 'email is invalid.' });
    } else {
      this.state.guests.push(this.state.guest);
      this.setState({ error: '', guest: '' });
      this.forceUpdate();
    }
  }

  /** Remove guest from guest array */
  removeGuest = (c, v) => {
    this.state.guests.splice(this.state.guests.indexOf(v.description), 1);
    this.forceUpdate();
  }

  /** Handles the errors then submits the form. */
  submit = () => {
    // If incorrect dates and times
    if (
      this.state.startDate > this.state.endDate &&
      this.state.allDay === false
    ) {
      // Display error message
      this.setState({ error: 'the start date begins after the end date.' });
      this.setState({ success: '' });
    } else if (this.state.startDate === '' || this.state.endDate === '') {
      // If dates are empty
      // Display error message
      this.setState({ error: 'please enter a start and end date.' });
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
      guest: '',
      rsvp: false,
      guests: [],
    });
  };

  render() {
    const messageStyle = { marginBottom: '30px' };
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
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
          </Grid.Column>
          <Grid.Column width={6} id='guests'>
            <Segment secondary>
              <h4>Guests</h4>
              <Input
                name='guest'
                type='email'
                placeholder='Add Guest Email'
                onChange={this.handleChange}
                value={this.state.guest}
              />
              <Button
                content='Add'
                color='grey'
                onClick={this.addGuest}
              />
              <Checkbox
                label='RSVP'
                style={{ paddingTop: '10px' }}
                checked={this.state.rsvp}
                onChange={this.handleRSVP}
              />
              {this.state.guests.length === 0 ? ('') : (
                this.state.guests.map((e, i) => (
                  <div id='guests' key={i}>
                    <Card
                      color='blue'
                      description={e}
                      onClick={this.removeGuest}
                    />
                  </div>
                ))
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.state.error === '' ? ('') : (
              <Message
                error
                style={messageStyle}
                header={`ERROR: ${this.state.error}`}
              />
            )}
            {this.state.success === '' ? ('') : (
              <Message
                success
                style={messageStyle}
                header={`SUCCESS: ${this.state.success}`}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default EventInputForm;
