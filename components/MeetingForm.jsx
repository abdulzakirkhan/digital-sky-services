import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MeetingForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  
  // Validation Schema using Yup
  const validationSchema = Yup.object({
    meeting: Yup.boolean(),
    turnitinReport: Yup.boolean(),
    proofreadingReport: Yup.boolean(),
    cv: Yup.boolean(),
    meetingDate: Yup.date().required('Meeting date is required'),
    meetingTime: Yup.string().required('Meeting time is required'),
    meetingDuration: Yup.string().required('Meeting duration is required'),
  });

  return (
    <div className="mx-auto p-4 py-14">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add-Ons  <span className="font-normal fs-18">(You can also get)</span> </h2>

      <Formik
        initialValues={{
          meeting: false,
          turnitinReport: false,
          proofreadingReport: false,
          cv: false,
          meetingDate: '',
          meetingTime: '',
          meetingDuration: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Form data:', values);
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            {/* Checkboxes Row */}
            <div className="flex flex-wrap gap-6 mb-4">
              <div className="flex items-center">
                <Field type="checkbox" name="meeting" className="mr-2" />
                <label>Meeting</label>
              </div>
              <div className="flex items-center">
                <Field type="checkbox" name="turnitinReport" className="mr-2" />
                <label>Turnitin Report</label>
              </div>
              <div className="flex items-center">
                <Field type="checkbox" name="proofreadingReport" className="mr-2" />
                <label>Proofreading Report</label>
              </div>
              <div className="flex items-center">
                <Field type="checkbox" name="cv" className="mr-2" />
                <label>CV</label>
              </div>
            </div>


            <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 lg:gap-12">

            {/* Meeting Date */}
            <div className="w-full lg:w-1/3 flex flex-col">
              <label className="block text-sm font-medium mb-2">Scheduled Meeting Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setFieldValue('meetingDate', date);
                }}
                className="w-full p-2 block border mx-0 border-gray-300 rounded-md"
                dateFormat="yyyy/MM/dd"
                placeholderText="Select a date"
              />
              <ErrorMessage name="meetingDate" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Time Input */}
            <div className="w-full lg:w-1/3">
              <label className="block text-sm font-medium mb-2">Select Time</label>
              <input
                type="time"
                name="meetingTime"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  setFieldValue('meetingTime', e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="meetingTime" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Meeting Duration Dropdown */}
            <div className="w-full lg:w-1/3">
              <label className="block text-sm font-medium mb-2">Meeting Duration</label>
              <Field as="select" name="meetingDuration" className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Select Duration</option>
                <option value="30min">30 Minutes</option>
                <option value="1hr">1 Hour</option>
                <option value="90min">1 Hour 30 Minutes</option>
                <option value="2hr">2 Hours</option>
              </Field>
              <ErrorMessage name="meetingDuration" component="div" className="text-red-500 text-sm" />
            </div>
            </div>

            <p className="lg:mt-16">Meeting  scheduled 29/09/2023 from 9:00 AM to 09:30 AM</p>
            {/* Submit Button */}


            <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-primary w-[159] h-[40] text-white py-2 px-4 rounded-md"
            >
              Submit
            </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MeetingForm;
