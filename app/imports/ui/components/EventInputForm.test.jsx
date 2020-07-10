import { Meteor } from 'meteor/meteor';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import EventInputForm from './EventInputForm';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('EventInputForm', function testSuite() {
        it('should render correctly', function testDefaultFormLoading() {
            const wrapper = mount(<EventInputForm />);
        })
    });
}