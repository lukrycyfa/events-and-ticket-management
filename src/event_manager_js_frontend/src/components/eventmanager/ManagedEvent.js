// imported dependencies
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack, Modal, Row } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import AddTicketClass from "./AddTicketClass";
import UpdateTicketClass from "./UpdateTicketClass";
import UpdateEvent from "./UpdateEvent";

// The ManageEvent construct taking an event instance, addticket, updateticket, publishevent, deleteticket, updateevent and deleteevent functions as --props
const ManagedEvent = ({ event, addticket, updateticket, deleteticket, updateevent, publishevent, deleteevent }) => {

  // an event instance
  const { id, title, description, eventLocation, bannerUrl, manager, tickets, ticketClasses, eventStart, eventEnd, soldOut, published } = event;

  // an event ticketclasses and purchased tickets state variable's
  const [_tickets, setTickets] = useState([]);
  const [ticketclasses, setTicketclasses] = useState([]);

  // timstamps converted to milliseconds
  const start = new Date(Number(eventStart) / 1000000).toUTCString();
  const end = new Date(Number(eventEnd) / 1000000).toUTCString();


  // an event purchased tickets and ticketclasses modal state 
  const [show, setShow] = useState(false);
  const [_show, _setShow] = useState(false);

  // an event purchased tickets and ticketclasses modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const _handleClose = () => _setShow(false);
  const _handleShow = () => _setShow(true);

  useEffect(() => {
    try {
      setTicketclasses(ticketClasses)
      setTickets(tickets);
    } catch (error) {
      console.log(error)
    }
  }, [ticketClasses, tickets])

  return (
    <Col key={id}>
      <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-white">{Principal.from(manager).toText().slice(0, 25)}...</span>
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
          <Card.Text className="flex-grow-1 text-white"><i className="bi bi-info-circle-fill"></i>{description}</Card.Text>
          <Card.Text className="flex-grow-2 text-white">
            <i className="bi bi-geo-alt-fill"></i><span>{eventLocation}</span>
          </Card.Text>
          <Card.Text className="flex-grow-2 text-white">
            <i className="bi bi-clock-fill"></i><span>{start}</span>
          </Card.Text>
          <Card.Text className="flex-grow-2 text-white">
            <i className="bi bi-clock-fill"></i><span>{end}</span>
          </Card.Text>
        </Card.Body>
        <Card.Footer >
          <Stack direction="horizontal" gap={3}>
            <Button
              onClick={() => deleteevent(id)}
              variant="danger"
              className="rounded-pill px-0"
              style={{ width: "38px" }}
            >
              <i className="bi bi-trash-fill"></i>
            </Button>
            <Button
              onClick={handleShow}
              variant="dark"
              className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            >
              Ticket Classes
            </Button>
            <Button
              onClick={_handleShow}
              variant="dark"
              className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            >
              Purchased Tickets
            </Button>
          </Stack>
        </Card.Footer>
        <Card.Footer >
          <Stack direction="horizontal" gap={2}>
            <AddTicketClass save={addticket} eventId={id} />
            {!published && (<><UpdateEvent event={event} save={updateevent} />
            <Button
              onClick={()=> publishevent(id)}
              variant="dark"
              className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            >
              Publish Event
            </Button></>)}
          </Stack>
        </Card.Footer>
        <Card.Footer className="text-secondary">
          -------
        </Card.Footer>
        <Modal show={show} onHide={handleClose} size="xl" centered scrollable={true} backdrop={true} >
          <Modal.Header closeButton>
            <Modal.Title>Ticket Classes</Modal.Title>
          </Modal.Header>
          <Modal.Body className="rounded-2 border-info shadow-lg" style={{ backgroundColor: "#010733" }}>

            <Row xs={1} sm={1} lg={3} className="g-3 flex flex-nowrap overflow-x-scroll mb-5 g-xl-4 g-xxl-5">
              {ticketclasses.map((tic, idx) => (

                <Col key={idx}>
                  <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
                    <Card.Header>
                      <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary"></span>
                        <Badge bg="secondary" className="ms-auto">
                          Ticket Price {(Number(tic.cost) / 10 ** 8).toString()} ICP
                        </Badge>
                      </Stack>
                    </Card.Header>
                    <div className=" ratio ratio-4x3">
                      <img src={tic.badgeUrl} alt={tic.title} style={{ objectFit: "cover" }} />
                    </div>
                    <Card.Body className="d-flex  flex-column text-center">
                      <Card.Title className="text-white">{tic.title}</Card.Title>
                    </Card.Body>
                    <Card.Footer>
                      <Stack direction="horizontal" gap={5}>
                        <Button
                          onClick={() => deleteticket(id, tic.id)}
                          variant="danger"
                          className="rounded-pill px-0"
                          style={{ width: "38px" }}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </Button>
                        <i></i>
                        <UpdateTicketClass ticketclass={tic} save={updateticket} eventId={id} />
                      </Stack>
                    </Card.Footer>
                  </Card>
                </Col>

              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={_show} onHide={_handleClose} size="xl" centered scrollable={true} backdrop={true}>
          <Modal.Header closeButton>
            <Modal.Title>Purchased Tickets</Modal.Title>
          </Modal.Header>
          <Modal.Body className="rounded-2 border-info shadow-lg" style={{ backgroundColor: "#010836" }}>
            <Row xs={1} sm={1} lg={3} className="g-3 flex flex-nowrap overflow-x-scroll mb-5 g-xl-4 g-xxl-5">
              {_tickets.map((tic, idx) => (

                <Col key={idx}>
                  <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
                    <Card.Header>
                      <Stack direction="horizontal" gap={2}>
                        <Badge bg="secondary" className="ms-auto">

                          Ticket Price {(Number(tic.cost) / 10 ** 8).toString()} ICP
                        </Badge>
                      </Stack>
                    </Card.Header>
                    <Card.Body className="d-flex  flex-column text-center">
                      <Card.Title className="text-white">{tic.title}</Card.Title>
                      <Card.Text className="text-white"><i className="bi bi-info-circle-fill"></i>{tic.ticketClassTitle}</Card.Text>
                      <Card.Text className="text-white"><i className="bi bi-info-circle-fill"></i>{tic.description}</Card.Text>
                      <Card.Text className="text-white"><i className="bi bi-geo-alt-fill"></i>{tic.eventLocation}</Card.Text>
                      <Card.Text className="text-white"><i className="bi bi-person-fill"></i>{Principal.from(tic.attendee).toText().slice(0, 15)}...</Card.Text>
                      <Card.Text className="text-white">
                        eventId: <span>{tic.eventId}</span>
                      </Card.Text>
                      <Card.Text className="text-white">
                        ticketClassId: <span>{tic.ticketClassId}</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

              ))}
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={_handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </Card>
    </Col>
  );
};

ManagedEvent.propTypes = {
  event: PropTypes.instanceOf(Object).isRequired,
  addticket: PropTypes.func.isRequired,
  updateticket: PropTypes.func.isRequired,
  deleteticket: PropTypes.func.isRequired,
  updateevent: PropTypes.func.isRequired,
  publishevent: PropTypes.func.isRequired,
  deleteevent: PropTypes.func.isRequired
};

export default ManagedEvent;
