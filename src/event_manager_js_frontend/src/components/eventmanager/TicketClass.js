// imported dependencies
import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";

// The TicketClass construct taking a ticketclass as instance and a buyticket function as --props
const TicketClass = ({ ticketclass, buyticket }) => {
  // a ticket class instance
  const { id, title, badgeUrl, cost } = ticketclass;
      

  return (
    <Col key={id}>
      <Card className="rounded-2 border-info shadow-lg h-100" style={{ backgroundColor: "#d14504"}}>
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Badge bg="secondary" className="ms-auto">
            Ticket Price {(Number(cost) / 10**8).toString()} ICP
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={badgeUrl} alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{title}</Card.Title>
          <Button
            variant="outline-dark"
            onClick={() => buyticket(id)}
            className="rounded-2 border-info shadow-lg w-100"
          >
            Buy for {(Number(cost) / 10**8).toString()} ICP
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

TicketClass.propTypes = {  
  ticketclass: PropTypes.instanceOf(Object).isRequired,
  buyticket: PropTypes.func.isRequired
};

export default TicketClass;
