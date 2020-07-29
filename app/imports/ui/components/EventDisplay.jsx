import React from 'react';
import { Container, Segment, Table } from 'semantic-ui-react';
import EventInputForm from './EventInputForm';

class EventDisplay extends React.Component {

  render() {
    return (
      <Container>
        <Segment>
          <h3>Events (CURRENTLY DOES NOT WORK)</h3>
          { EventInputForm.getEvents().length === 0 ? (
            <h4>There are currently no events added.</h4>
          ) : (
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Start Date
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    End Date
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Priority
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    Classification
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
          )}
        </Segment>
      </Container>
    );
  }
}

export default EventDisplay;
