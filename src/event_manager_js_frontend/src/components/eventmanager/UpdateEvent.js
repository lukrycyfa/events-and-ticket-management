import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateEvent = ({ event, save }) => {

  const {id,  title, description, eventLocation, bannerUrl, eventStart, eventEnd} = event;  

  const [_title, setTitle] = useState(title);
  const [_description, setDescription] = useState(description);
  const [_eventLocation, setEventLocation] = useState(eventLocation);
  const [_bannerUrl, setBannerUrl] = useState(bannerUrl);
  const [_eventStart, setEventStart] = useState(eventStart);
  const [_eventEnd, setEventEnd] = useState(eventEnd);

  const isFormFilled = () => _title && _bannerUrl && _eventLocation && _description && _eventStart && _eventEnd;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i class="bi bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Product</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Event title"
              className="mb-3"
            >
              <Form.Control
                type="text"
                value={_title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Enter event title"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Banner URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Banner URL"
                value={_bannerUrl}
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
                value={_description}
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEventLocation"
              label="EventLoaction"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="eventlocation"
                value={_eventLocation}
                style={{ height: "80px" }}
                onChange={(e) => {
                  setEventLocation(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEventstart"
              label="Location"
              className="mb-3"
            >
              <Form.Control
                type="date"
                placeholder="Event Start"
                onChange={(e) => {
                  setEventStart(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEventend"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="date"
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
                _title,
                _bannerUrl,
                _description,
                _eventLocation,
                _eventStart,
                _eventEnd,
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
