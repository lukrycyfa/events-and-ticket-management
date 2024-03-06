// imported dependencies
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack, Modal, Row } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import TicketClass from "./TicketClass";

// The Event construct taking an event instance and a buyticket function as --props
const Event = ({ event, buyticket }) => {
 
  // an event instance
  const { id, title, description, eventLocation, bannerUrl, manager, ticketClasses, eventStart, eventEnd, soldOut } = event;
  
  // an event ticketclasses state variable
  const [ticketclasses, setTicketclasses] = useState([]);
  
  // timstamps converted to milliseconds
  const start = new Date(Number(eventStart)/1000000).toUTCString();
  const end = new Date(Number(eventEnd)/1000000).toUTCString();

  // purchase aticket
  const triggerBuy = (ticketclassId) => {
    buyticket(id, ticketclassId);
  };


  // event tickets modal state 
  const [show, setShow] = useState(false);
  // event tickets modal state toggler
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
      <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278"}}>
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
          <span className="font-monospace text-white">{Principal.from(manager).toText().slice(0, 17)}...</span>
            <Badge bg="secondary" className="ms-auto">
              {soldOut.toString()} SoldOut Tickets
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={bannerUrl} alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title className="text-white">{title}</Card.Title>
          <Card.Text className="flex-grow-1 text-white "><i className="bi bi-info-circle-fill"></i>{description}</Card.Text>
          <Card.Text className="flex-grow-2 text-white">
          <i className="bi bi-geo-alt-fill text-white"></i><span>{eventLocation}</span>
          </Card.Text>
          <Card.Text className="flex-grow-2 text-white">
          <i className="bi bi-clock-fill"></i><span>{start}</span>
          </Card.Text>
          <Card.Text className="flex-grow-2 text-white">
          <i className="bi bi-clock-fill"></i><span>{end}</span>
          </Card.Text>
          <Card.Text className="flex-grow-2">
          <Button
            onClick={handleShow}
            variant="dark"
            className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
          >
           Purchase Event Tickets
          </Button>
          <Modal show={show} onHide={handleClose} size="xl" centered  scrollable={true} backdrop={true} >
              <Modal.Header closeButton >
                <Modal.Title>Ticket Classes</Modal.Title>
              </Modal.Header>
              <Modal.Body className="rounded-2 border-info shadow-lg" style={{ backgroundColor: "#010836"}}>
              <Row xs={1} sm={1} lg={3} className="g-3 flex flex-nowrap overflow-x-scroll mb-5 g-xl-4 g-xxl-5">  
              {ticketclasses.map((tic, idx)=>(
                <TicketClass
                  key={idx}
                  ticketclass={tic}
                  buyticket={triggerBuy}
                />
              ))}
              </Row>
              </Modal.Body>

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
