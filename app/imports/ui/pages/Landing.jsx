import React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import Calendar from 'react-calendar';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={4}>
            <Image size='small' circular src="/images/meteor-logo.png"/>
          </Grid.Column>

          <Grid.Column width={6}>
            <Calendar/>
          </Grid.Column>

        </Grid>
    );
  }
}

export default Landing;
