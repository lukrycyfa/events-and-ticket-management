// imported dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// The UpdateEvent construct taking an event instance and a save function as prop's
const UpdateEvent = ({ event, save }) => {

  // an instance of an event
  const {id,  title, description, eventLocation, bannerUrl, eventStart, eventEnd} = event;  

  // An event attributes state variable's
  const [_title, setTitle] = useState(title);
  const [_description, setDescription] = useState(description);
  const [_eventLocation, setEventLocation] = useState(eventLocation);
  const [_bannerUrl, setBannerUrl] = useState(bannerUrl);
  const [_eventStart, setEventStart] = useState(eventStart);
  const [_eventEnd, setEventEnd] = useState(eventEnd);

  // form input vlidation
  const isFormFilled = () => _title && _bannerUrl && _eventLocation && _description && _eventStart && _eventEnd;

  // Update event modal state 
  const [show, setShow] = useState(false);
  // Update event modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
      >
        Update Event
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Event</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body className="rounded-2 border-info shadow-lg" style={{ backgroundColor: "#f75002"}}>
            <FloatingLabel
              controlId="inputTitle"
              label="event title"
              className="mb-3"
            >
              <Form.Control
                type="text"
                value={_title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Event Title"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="banner url"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Banner Url"
                value={_bannerUrl}
                onChange={(e) => {
                  setBannerUrl(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Description"
                value={_description}
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEventLocation"
              label="event location"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Event Location"
                value={_eventLocation}
                style={{ height: "80px" }}
                onChange={(e) => {
                  setEventLocation(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEventstart"
              label="event start"
              className="mb-3"
            >
              <Form.Control
                type="datetime-local"
                placeholder="Event Start"
                onChange={(e) => {
                  setEventStart(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEventend"
              label="event end"
              className="mb-3"
            >
              <Form.Control
                type="datetime-local"
                placeholder="Event End"
                onChange={(e) => {
                  setEventEnd(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                title: _title,
                bannerUrl: _bannerUrl,
                description: _description,
                eventLocation: _eventLocation,
                eventStart: _eventStart,
                eventEnd: _eventEnd,
              }, id);
              handleClose();
            }}
          >
            Update Event...
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateEvent.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateEvent;
