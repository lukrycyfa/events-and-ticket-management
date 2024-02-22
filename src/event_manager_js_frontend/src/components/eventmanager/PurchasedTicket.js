import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";


const PurchasedTicket = ({ ticket, deleteticket }) => {
 
  const { id, title, description, eventLocation, ticketClassTitle, attendee, eventId, ticketClassId, cost, paid, createdAt } = ticket;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">{Principal.from(attendee).toText()}</span>
            <Badge bg="secondary" className="ms-auto">
              {cost.toString()} Ticket Price
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src="" alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1 ">{description}</Card.Text>
          <Card.Text className="text-secondary">
            <span>{ticketClassTitle}</span>
          </Card.Text>
          <Card.Text className="text-secondary">
          <Button
            onClick={() => deleteticket(id)}
            variant="dark"
            className="rounded-pill px-0"
            style={{ width: "38px" }}
          >
            <i class="bi bi-plus"></i>
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
