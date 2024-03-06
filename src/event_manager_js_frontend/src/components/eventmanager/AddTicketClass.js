// imported dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// The Add Ticket Class construct taking a save function and eventId as prop's
const AddTicketClass = ({ save, eventId }) => {

  // A Ticket Class attributes state variable's
  const [title, setTitle] = useState("");
  const [badgeUrl, setBadgeUrl] = useState("");
  const [cost, setCost] = useState(0);
  const [eventid, setSetEventId] = useState(eventId);

  // form input vlidation
  const isFormFilled = () => title && badgeUrl && cost;

  // Add Ticket Class modal state
  const [show, setShow] = useState(false);

  // Add Ticket Class modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
      >
        Add Ticket
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Ticket</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body className="rounded-2 border-info shadow-lg" style={{ backgroundColor: "#041059" }}>
            <FloatingLabel
              controlId="inputTitle"
              label="ticket title"
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
              label="badge url"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Badge Url"
                onChange={(e) => {
                  setBadgeUrl(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPrice"
              label="price"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Price"
                onChange={(e) => {
                  if (Number(e.target.value) < 0) return;
                  setCost(e.target.value);
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
                badgeUrl,
                cost
              }, eventid);
              handleClose();
            }}
          >
            Add Ticket Class...
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddTicketClass.propTypes = {
  save: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired
};

export default AddTicketClass;
