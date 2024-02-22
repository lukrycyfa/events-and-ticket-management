import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddEvent = ({ save }) => {
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  const isFormFilled = () => title && bannerUrl && description && eventLocation && eventStart && eventEnd;

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
              label="Event Loacation"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="event location"
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
