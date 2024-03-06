// imported dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// The UpdateTicketClass construct taking an instance of a ticketclass, a save function and eventId as prop's
const UpdateTicketClass = ({ ticketclass, save, eventId }) => {
  // a ticket class instance
  const { id, title, badgeUrl, cost } = ticketclass;

  // A Ticket Class attributes state variable's
  const [_title, setTitle] = useState(title);
  const [_badgeUrl, setBadgeUrl] = useState(badgeUrl);
  const [_cost, setCost] = useState(Number(cost) / 10 ** 8);
  const [eventid, setSetEventId] = useState(eventId);

  // form input vlidation
  const isFormFilled = () => _title && _badgeUrl && _cost;

  // Update Ticket Class modal state
  const [show, setShow] = useState(false);

  // Update Ticket Class modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
      >
        Update Ticket Class
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Ticket</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body className="rounded-2 border-info shadow-lg" style={{ backgroundColor: "#041059" }}>
            <FloatingLabel
              controlId="inputName"
              label="ticket title"
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
              label="badge url"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Badge URL"
                value={_badgeUrl}
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
                value={_cost}
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
                title: _title,
                badgeUrl: _badgeUrl,
                cost: _cost
              }, eventid, id);
              handleClose();
            }}
          >
            Update Ticket Class...
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateTicketClass.propTypes = {
  ticketclass: PropTypes.instanceOf(Object).isRequired,
  save: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired
};

export default UpdateTicketClass;
