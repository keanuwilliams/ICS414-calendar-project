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
  Table,
  Message,
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete';
import { download } from '../../api/ics-file/create-ics-file';
import 'react-google-places-autocomplete/dist/index.min.css';
import 'react-datepicker/dist/react-datepicker.css';

const events = []; // Events to be added to .ics file
let userEmail = ''; // The user's email
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
      userEmail: '',
      userEmailAdded: false,
      userIsOrganizer: false,
      eventName: '',
      geolocation: '',
      location: '',
      startDate: '',
      endDate: '',
      allDay: false,
      priority: 0,
      classification: 'PUBLIC',
      organizer: '',
      organizerAdded: false,
      guest: '',
      rsvp: false,
      guests: [],
      resource: '',
      resources: [],
      success: '',
      error: '',
    };
  }

  /** Get the events that were added by the event form */
  static getEvents() {
    return events;
  }

  static getUserEmail() {
    return userEmail;
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

  handleUserIsOrganizer = () => {
    if (!this.state.userIsOrganizer) {
      this.setState({
        userIsOrganizer: true,
        organizer: this.state.userEmail,
        organizerAdded: true,
      });
    } else {
      this.setState({
        userIsOrganizer: false,
        organizer: '',
        organizerAdded: false,
      });
    }
    this.forceUpdate();
  };

  /** Add an event to the events array */
  addEvent = () => {
    const start = this.state.startDate.toISOString();
    const end = this.state.endDate.toISOString();

    const event = {
      userEmail: this.state.userEmail,
      eventName: this.state.eventName,
      geolocation: this.state.geolocation,
      location: this.state.location,
      startDate: start,
      endDate: end,
      allDay: this.state.allDay,
      priority: this.state.priority,
      classification: this.state.classification,
      organizer: this.state.organizer,
      guests: this.state.guests,
      rsvp: this.state.rsvp,
      resources: this.state.resources,
    };

    events.push(event);
    this.forceUpdate();
  };

  // Extracts geolocation from autocompleted-location
  locationSelect = (location) => {
    this.setState({ location: location.description });
    geocodeByAddress(location.description)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => this.setState({ geolocation: `${lat};${lng}` }));
  };

  /** Code from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
   *  Used to validate an email address */
  validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  }

  /** Add organizer to event */
  addOrganizer = () => {
    if (this.state.organizer === '') {
      this.setState({ error: 'organizer email is empty.' });
    } else if (!this.validateEmail(this.state.organizer)) {
      this.setState({ error: 'organizer email is invalid.' });
    } else {
      this.setState({ error: '', organizerAdded: true });
      this.forceUpdate();
    }
  };

  removeOrganizer = () => {
    this.setState({
      organizer: '',
      organizerAdded: false,
      userIsOrganizer: false,
    });
  };

  /** Add user to event */
  addUserEmail = () => {
    if (this.state.userEmail === '') {
      this.setState({ error: 'user email is empty.' });
    } else if (!this.validateEmail(this.state.userEmail)) {
      this.setState({ error: 'user email is invalid.' });
    } else {
      this.setState({ error: '', userEmailAdded: true });
      this.forceUpdate();
    }
  };

  /** Add guest to guest array */
  addGuest = () => {
    if (this.state.guest === '') {
      this.setState({ error: 'guest email is empty.' });
    } else if (!this.validateEmail(this.state.guest)) {
      this.setState({ error: 'guest email is invalid.' });
    } else {
      this.state.guests.push(this.state.guest);
      this.setState({ error: '', guest: '' });
      this.forceUpdate();
    }
  };

  /** Remove guest from guest array */
  removeGuest = (c, v) => {
    this.state.guests.splice(this.state.guests.indexOf(v.description), 1);
    this.forceUpdate();
  };

  /** Add resource to resource array */
  addResource = () => {
    if (this.state.resource === '') {
      this.setState({ error: 'resource field is empty.' });
    } else {
      this.state.resources.push(this.state.resource);
      this.setState({ error: '', resource: '' });
      this.forceUpdate();
    }
  };

  /** Remove resource from resource array */
  removeResource = (c, v) => {
    this.state.resources.splice(this.state.guests.indexOf(v.description), 1);
    this.forceUpdate();
  };

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
      // Remove error message if there was one
      this.setState({ error: '' });
      // Add success message
      this.setState({
        success: `'${this.state.eventName}' successfully added.`,
      });
      userEmail = this.state.userEmail;
      this.resetForm();
    }
  };

  /** Reset the form */
  resetForm = () => {
    this.setState({
      userIsOrganizer: false,
      eventName: '',
      geolocation: '',
      location: '',
      startDate: '',
      endDate: '',
      allDay: false,
      priority: 0,
      classification: 'PUBLIC',
      organizer: '',
      organizerAdded: false,
      guest: '',
      rsvp: false,
      guests: [],
      resource: '',
      resources: [],
    });
  };

  render() {
    const messageStyle = { marginBottom: '30px' };
    return (
      <div className='eventInputForm'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              {this.state.error === '' ? (
                ''
              ) : (
                <Message
                  error
                  style={messageStyle}
                  header={`ERROR: ${this.state.error}`}
                />
              )}
              {this.state.success === '' ? (
                ''
              ) : (
                <Message
                  success
                  style={messageStyle}
                  header={`SUCCESS: ${this.state.success}`}
                />
              )}
            </Grid.Column>
          </Grid.Row>
          {!this.state.userEmailAdded ? (
            <Grid.Row centered>
              <div>
                <h2>
                  Before you are able to create an event, please enter your
                  email address.
                </h2>
                <h3 style={{ color: 'red', marginTop: '-5px' }}>
                  You will not be able to change it, unless you refresh the
                  page.
                </h3>
              </div>
              <Input
                style={{ width: '35%', marginTop: '10px', fontSize: '18px' }}
                action={{
                  style: { fontSize: '18px' },
                  secondary: true,
                  content: 'Use Email',
                  onClick: this.addUserEmail,
                }}
                name='userEmail'
                type='email'
                placeholder='Your Email'
                onChange={this.handleChange}
                value={this.state.userEmail}
              />
            </Grid.Row>
          ) : (
            <Grid.Row centered>
              <h2>
                Disclaimer: All events created will be in the Pacific/Honolulu
                Timezone
              </h2>
              <Grid.Column width={8}>
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
                    <Form.Field>
                      <label>Location</label>
                      <GooglePlacesAutocomplete
                        initialValue={this.state.location}
                        apiKey='AIzaSyDUy3PQMDR4Q_wx-8ZSH0p45R8_qgQRNx0'
                        onSelect={this.locationSelect}
                        placeholder='Address'
                      />
                    </Form.Field>
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
              <Grid.Column width={4} id='guests'>
                <Segment.Group>
                  <Segment secondary>
                    <h4>Your Email</h4>
                    <div>{this.state.userEmail}</div>
                  </Segment>
                  <Segment secondary>
                    <h4>Organizer</h4>
                    {!this.state.organizerAdded ? (
                      <div>
                        <Input
                          action={{
                            content: 'Use',
                            color: 'grey',
                            onClick: this.addOrganizer,
                          }}
                          name='organizer'
                          type='email'
                          placeholder='Organizer&apos;s email'
                          onChange={this.handleChange}
                          value={this.state.organizer}
                        />
                      </div>
                    ) : (
                      <div>
                        {this.state.organizer} (
                        <a
                          style={{ color: 'red' }}
                          onClick={this.removeOrganizer}
                        >
                          x
                        </a>
                        )
                      </div>
                    )}
                    <Checkbox
                      label='I am the organizer'
                      style={{ paddingTop: '10px' }}
                      checked={this.state.userIsOrganizer}
                      onChange={this.handleUserIsOrganizer}
                    />
                  </Segment>
                  {!this.state.organizerAdded ? (
                    ''
                  ) : (
                    <Segment secondary>
                      <h4>Guests</h4>
                      <Input
                        action={{
                          content: 'Add',
                          color: 'grey',
                          onClick: this.addGuest,
                        }}
                        name='guest'
                        type='email'
                        placeholder='Add Guest Email'
                        onChange={this.handleChange}
                        value={this.state.guest}
                      />
                      <Checkbox
                        label='RSVP'
                        style={{ paddingTop: '10px' }}
                        checked={this.state.rsvp}
                        onChange={this.handleRSVP}
                      />
                      {this.state.guests.length === 0
                        ? ''
                        : this.state.guests.map((e, i) => (
                            <div style={{ paddingTop: '10px' }} key={i}>
                              <Card
                                color='blue'
                                description={e}
                                onClick={this.removeGuest}
                              />
                            </div>
                          ))}
                    </Segment>
                  )}
                </Segment.Group>
              </Grid.Column>
              <Grid.Column width={4} id='resources'>
                <Segment secondary>
                  <h4>Resources</h4>
                  <Input
                    action={{
                      color: 'grey',
                      content: 'Add',
                      onClick: this.addResource,
                    }}
                    name='resource'
                    placeholder='Add Resource'
                    onChange={this.handleChange}
                    value={this.state.resource}
                  />
                  {this.state.resources.length === 0
                    ? ''
                    : this.state.resources.map((e, i) => (
                      <div key={i} style={{ paddingTop: '10px' }}>
                        <Card
                          color='black'
                          description={e}
                          onClick={this.removeResource}
                        />
                      </div>
                    ))}
                </Segment>
              </Grid.Column>
              <Grid.Column width={16} style={{ paddingTop: '15px' }}>
                <Segment>
                  <h3>Added Events</h3>
                  {events.length === 0 ? (
                    <h4 style={{ color: 'grey', marginTop: '5px' }}>
                      There are currently no events added.
                    </h4>
                  ) : (
                    <Table celled>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Name</Table.HeaderCell>
                          <Table.HeaderCell>Location</Table.HeaderCell>
                          <Table.HeaderCell>Start Date</Table.HeaderCell>
                          <Table.HeaderCell>End Date</Table.HeaderCell>
                          <Table.HeaderCell>Organizer</Table.HeaderCell>
                          <Table.HeaderCell>Guests</Table.HeaderCell>
                          <Table.HeaderCell>RSVP</Table.HeaderCell>
                          <Table.HeaderCell>Resources</Table.HeaderCell>
                          <Table.HeaderCell>Priority</Table.HeaderCell>
                          <Table.HeaderCell>Class</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {events.map((e, i) => (
                          <Table.Row key={i}>
                            <Table.Cell>{e.eventName}</Table.Cell>
                            <Table.Cell>{e.location === '' ? 'N/A' : e.location}</Table.Cell>
                            <Table.Cell>
                              {e.allDay
                                ? e.startDate.substr(0, 10)
                                : `${e.startDate.substr(
                                    0,
                                    10,
                                  )}\n${e.startDate.substr(11, 5)} (UTC)`}
                            </Table.Cell>
                            <Table.Cell>
                              {e.allDay
                                ? e.endDate.substr(0, 10)
                                : `${e.endDate.substr(
                                    0,
                                    10,
                                  )}\n${e.endDate.substr(11, 5)} (UTC)`}
                            </Table.Cell>
                            <Table.Cell>
                              {e.organizer === '' ? 'N/A' : e.organizer}
                            </Table.Cell>
                            <Table.Cell>
                              {e.guests.length === 0
                                ? 'N/A'
                                : e.guests.map((c, n) => (
                                    <div key={n}>
                                      {c} <br />
                                    </div>
                                  ))}
                            </Table.Cell>
                            <Table.Cell>
                              <Checkbox checked={e.rsvp} />
                            </Table.Cell>
                            <Table.Cell>
                              {e.resources.length === 0
                                ? 'N/A'
                                : e.resources.map((c, n) => (
                                  <div key={n}>
                                    {c} <br />
                                  </div>
                                ))}
                            </Table.Cell>
                            <Table.Cell>{e.priority}</Table.Cell>
                            <Table.Cell>{e.classification}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                      <Table.Footer>
                        <Table.Row>
                          <Table.HeaderCell colSpan={10}>
                            <Button
                              primary
                              floated='right'
                              content='Download File'
                              onClick={download}
                            />
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Footer>
                    </Table>
                  )}
                </Segment>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </div>
    );
  }
}

export default EventInputForm;
