import React from "react";
import {
  Button,
  Form,
  Segment,
  Checkbox,
  Grid,
  Header,
  Calendar,
} from "semantic-ui-react";
import {
  AutoForm,
  TextField,
  DateField,
  SelectField,
  SubmitField,
} from "uniforms-semantic";
import DatePicker from "react-datepicker";
import SimpleSchema from "simpl-schema";

const eventFormSchema = new SimpleSchema({
  eventName: String,
  startDate: {
    type: Date,
    defaultValue: new Date(),
  },
});

class EventInputForm extends React.Component {
  render() {
    let fRef = null;
    return (
      <Grid container centered>
        <Grid.Column>
          <Header as="h3" textAlign="center">
            Create Event
          </Header>
          <AutoForm
            ref={(ref) => {
              fRef = ref;
            }}
            schema={eventFormSchema}
            onSubmit={(data) => this.submit(data, fRef)}
          >
            <Segment>
              <TextField name="eventName" />
              <Calendar name="startDate" />
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

export default EventInputForm;
