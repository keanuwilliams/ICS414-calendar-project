import React from 'react';
import { Button, Form, Segment, Checkbox } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

class EventInputForm extends React.Component {

    state = {
        startDate: new Date(),
        endDate: new Date(),
        allDay: false,
    };

    handleStartDate = date => {
        if (date <= this.state.endDate) {
            this.setState({
                startDate: date,
            });
        }
    };

    handleEndDate = date => {
        if (date >= this.state.startDate) {
            this.setState({
                endDate: date,
            });
        }
    };

    handleAllDay = () => this.setState((prevState) => ({ allDay: !prevState.allDay }));

    render() {
        return (
            <Form>
                <Segment>
                    <Form.Input
                        required
                        placeholder='Event Name'
                    />
                    { this.state.allDay === false ? (
                        <Form.Group>
                            <Form.Input required label='Start Date'>
                                <DatePicker
                                    required
                                    selectsStart
                                    showTimeSelectOnly
                                    timeFormat='HH:mm'
                                    dateFormat='MM/d/yyyy h:mm aa'
                                    selected={ this.state.startDate }
                                    onChange={ this.handleStartDate }
                                    startDate={ this.state.startDate }
                                    endDate={ this.state.endDate }
                                />
                            </Form.Input>
                            <Form.Input required label='End Date'>
                                <DatePicker
                                    required
                                    selectsEnd
                                    showTimeSelectOnly
                                    timeFormat='HH:mm'
                                    dateFormat='MM/d/yyyy h:mm aa'
                                    selected={ this.state.endDate }
                                    onChange={ this.handleEndDate }
                                    startDate={ this.state.startDate }
                                    endDate={ this.state.endDate }
                                />
                            </Form.Input>
                        </Form.Group>
                    ) : (
                        <Form.Group>
                            <Form.Input required label='Start Date'>
                                <DatePicker
                                    required
                                    selectsStart
                                    showTimeSelectOnly
                                    selected={ this.state.startDate }
                                    onChange={ this.handleStartDate }
                                    startDate={ this.state.startDate }
                                    endDate={ this.state.endDate }
                                />
                            </Form.Input>
                            <Form.Input required label='End Date'>
                                <DatePicker
                                    required
                                    selectsEnd
                                    showTimeSelectOnly
                                    selected={ this.state.endDate }
                                    onChange={ this.handleEndDate }
                                    startDate={ this.state.startDate }
                                    endDate={ this.state.endDate }
                                />
                            </Form.Input>
                        </Form.Group>
                    )}
                    <Form.Field control={Checkbox}
                                label='All Day'
                                onChange={ this.handleAllDay }
                    />
                    <Button secondary type='submit' content='Add Event' />
                </Segment>
            </Form>
        );
    }
}

export default EventInputForm;
