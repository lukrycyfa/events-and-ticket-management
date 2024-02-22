import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateTicketClass = ({ ticketclass, save, eventId }) => {
  const { id, title, badgeUrl, cost } = ticketclass; 

  const [_title, setTitle] = useState(title);
  const [_badgeUrl, setBadgeUrl] = useState(badgeUrl);
  const [_cost, setCost] = useState(cost);
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
          <Modal.Title>Update Ticket</Modal.Title>
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
              label="Badge URL"
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
              controlId="inputCost"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Cost"
                value={Number(_cost)}
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
                _title,
                _badgeUrl,
                _cost
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
