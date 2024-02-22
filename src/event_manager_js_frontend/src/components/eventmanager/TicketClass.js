import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";

const TicketClass = ({ ticketclass, buyticket }) => {
 
  const { id, title, description, badgeUrl, cost, createdAt } = ticketclass;
      

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">{Principal.from(seller).toText()}</span>
            <Badge bg="secondary" className="ms-auto">
              {soldOut.toString()} Sold
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={badgeUrl} alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1 ">{description}</Card.Text>
          <Card.Text className="text-secondary">
            <span>{location}</span>
          </Card.Text>
          <Card.Text className="text-secondary">
            
          </Card.Text>
          <Button
            variant="outline-dark"
            onClick={() => buyticket(id)}
            className="w-100 py-3"
          >
            Buy for {(cost / BigInt(10**8)).toString()} ICP
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
