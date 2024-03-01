import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import coverImg from "../../assets/img/sandwich.jpg";

const TicketClass = ({ ticketclass, buyticket }) => {
 
  const { id, title, badgeUrl, cost, createdAt } = ticketclass;
      

  return (
    <Col key={id}>
      <Card className="rounded-2 border-info shadow-lg h-100" style={{ backgroundColor: "#d14504"}}>
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
          {/* <span className="font-monospace text-dark">{Principal.from(seller).toText()}</span> */}
            <span className="font-monospace text-dark">manager</span>
            <Badge bg="secondary" className="ms-auto">
            Ticket Price {(cost / Number(BigInt(10**8))).toString()} 
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          {/* <img src={badgeUrl} alt={title} style={{ objectFit: "cover" }} /> */}
          <img src={coverImg} alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{title}</Card.Title>
          <Button
            variant="outline-dark"
            onClick={() => buyticket(id)}
            className="rounded-2 border-info shadow-lg w-100"
          >
            Buy for {(cost / Number(BigInt(10**8))).toString()} ICP
          </Button>
          {console.log(cost * Number(BigInt(10**8)).toString())}
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
