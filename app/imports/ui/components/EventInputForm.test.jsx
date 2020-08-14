import { Meteor } from 'meteor/meteor';
import React, { createFactory } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import EventInputForm from './EventInputForm';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('EventInputForm', function testSuite() {
        it('should render form properties correctly', function testDefaultFormLoading() {
            const wrapper = mount(<EventInputForm />);
            // Create test event for validity
            expect(wrapper.find('select')).to.have.lengthOf(1);
        })
    });
}