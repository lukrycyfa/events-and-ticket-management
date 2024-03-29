// imported dependencies
import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";

// The PurchasedTicket construct taking a ticket as instance and a deleteticket function as --props
const PurchasedTicket = ({ ticket, deleteticket }) => {
  // instance of a purchased ticket
  
  const { id, eventTitle, description, eventLocation, ticketClassTitle, attendee, eventId, ticketClassId, eventStart, eventEnd, cost } = ticket;

    // timstamps converted to milliseconds
    const start = new Date(Number(eventStart) / 1000000).toUTCString();
    const end = new Date(Number(eventEnd) / 1000000).toUTCString();

  return (
    <Col key={id}>
      <Card className="rounded-2 border-info shadow-lg h-100" style={{ backgroundColor: "#021278" }}>
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-white">{Principal.from(attendee).toText().slice(0, 12)}...</span>
            <Badge bg="secondary" className="ms-auto">
              Ticket Price {(Number(cost) / 10 ** 8).toString()} ICP
            </Badge>
          </Stack>
        </Card.Header>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title className="font-monospace text-white">event: <span>{eventTitle}</span></Card.Title>
          <Card.Text className="font-monospace text-white">
            Ticket: <i className="bi bi-info-circle-fill"></i><span>{ticketClassTitle}</span>
          </Card.Text>
          <Card.Text className="font-monospace text-white">
            <i className="bi bi-geo-alt-fill"></i><span>{eventLocation}</span>
          </Card.Text>
          <Card.Text className="flex-grow-1 text-white"><i className="bi bi-info-circle-fill"></i>{description}</Card.Text>
          <Card.Text className="font-monospace text-white">
            eventStart: <span>{start}</span>
          </Card.Text>
          <Card.Text className="font-monospace text-white">
            eventEnd: <span>{end}</span>
          </Card.Text>
          <Card.Text className="text-secondary">
            <Button
              onClick={() => deleteticket(id)}
              variant="danger"
              className="rounded-pill px-0"
              style={{ width: "38px" }}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

PurchasedTicket.propTypes = {
  ticket: PropTypes.instanceOf(Object).isRequired,
  deleteticket: PropTypes.func.isRequired,
};

export default PurchasedTicket;
