// imported dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// The create event construct taking a save function as prop
const AddEvent = ({ save }) => {

  // An event attributes state variable's
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  // form input vlidation
  const isFormFilled = () => title && bannerUrl && description && eventLocation && eventStart && eventEnd;

  // Add event modal state 
  const [show, setShow] = useState(false);
  // Add event modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
      >
        Add Event
      </Button>
      <Modal show={show} onHide={handleClose} centered className="text-center rounded-2 border-info shadow-lg">
        <Modal.Header closeButton>
          <Modal.Title>New Event</Modal.Title>
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
                placeholder="Banner URL"
                onChange={(e) => {
                  setBannerUrl(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
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
                style={{ height: "80px" }}
                onChange={(e) => {
                  setEventLocation(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEventStart"
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
                title,
                bannerUrl,
                description,
                eventLocation,
                eventStart,
                eventEnd,
              });
              handleClose();
            }}
          >
            Add Event...
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddEvent.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddEvent;
