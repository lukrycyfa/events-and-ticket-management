import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import TicketClass from "./TicketClass";

const Event = ({ event, buyticket }) => {
 
  const { id, title, description, eventLocation, bannerUrl, manager, ticketClasses, eventStart, eventEnd, soldOut } = event;
  const [ticketclasses, setTicketclasses] = useState([]);
  
  const start = new Date(eventStart).toDateString();
  const end = new Date(eventEnd).toDateString();

  const triggerBuy = (ticketclassId) => {
    buyticket(id, ticketclassId);
  };


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    try {
      setTicketclasses(ticketClasses)
    } catch (error) {
      console.log(error)
    }
  }, [ticketClasses])

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">{Principal.from(manager).toText()}</span>
            <Badge bg="secondary" className="ms-auto">
              {soldOut.toString()} Sold
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={bannerUrl} alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1 ">{description}</Card.Text>
          <Card.Text className="text-secondary">
            <span>{eventLocation}</span>
          </Card.Text>
          <Card.Text className="text-secondary">
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
              {ticketclasses.map((tic, idx)=>(
                <TicketClass
                  ticketclass={tic}
                  buyticket={triggerBuy}
                />
              ))}

              <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

Event.propTypes = {
  event: PropTypes.instanceOf(Object).isRequired,
  buyticket: PropTypes.func.isRequired,
};

export default Event;
