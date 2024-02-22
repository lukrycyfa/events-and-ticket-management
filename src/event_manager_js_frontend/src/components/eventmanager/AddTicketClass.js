import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddTicketClass = ({ save, eventId }) => {

  const [title, setTitle] = useState("");
  const [badgeUrl, setBadgeUrl] = useState("");
  const [cost, setCost] = useState(0);
  const [eventid, setSetEventId] = useState(eventId);

  const isFormFilled = () => title && badgeUrl && cost;

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
          <Modal.Title>New Ticket</Modal.Title>
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
              label="Badge URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Badge URL"
                onChange={(e) => {
                    setBadgeUrl(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputCost"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="date"
                placeholder="Cost"
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
