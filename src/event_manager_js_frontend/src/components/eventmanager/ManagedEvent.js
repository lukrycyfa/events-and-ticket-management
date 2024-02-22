import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import AddTicketClass from "./AddTicketClass";
import UpdateTicketClass from "./UpdateTicketClass";
import UpdateEvent from "./UpdateEvent";

const ManagedEvent = ({ event, addticket, updateticket, deleteticket, updateevent, deleteevent }) => {
 
  const { id, title, description, eventLocation, bannerUrl, manager, tickets, ticketClasses, eventStart, eventEnd, soldOut } = event;

  const [_tickets, setTickets] = useState([]);
  const [ticketclasses, setTicketclasses] = useState([]);       

  const start = new Date(eventStart).toDateString();
  const end = new Date(eventEnd).toDateString();

  const [show, setShow] = useState(false);
  const [_show, _setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const _handleClose = () => _setShow(false);
  const _handleShow = () => _setShow(true);

  useEffect(()=>{
    try {
      setTicketclasses(ticketClasses)
      setTickets(tickets);
    } catch (error) {
      console.log(error)
    }
  }, [ticketClasses, tickets])

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
        <AddTicketClass save={addticket} />
        <UpdateEvent event={event} save={updateevent} />
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
          <Card.Text className="flex-grow-1 ">{eventLocation}</Card.Text>
          <Card.Text className="text-secondary">
            {/* <span>{location}</span> */}
          </Card.Text>
          <Card.Text className="text-secondary">
          <Button
            onClick={()=> deleteevent(id)}
            variant="danger"
            className="rounded-pill px-0"
            style={{ width: "38px" }}
          >
            Delete Event
          </Button>  
          <Button
            onClick={handleShow}
            variant="dark"
            className="rounded-pill px-0"
            style={{ width: "38px" }}
          >
            <i class="bi bi-plus"></i>
          </Button>
          <Button
            onClick={_handleShow}
            variant="dark"
            className="rounded-pill px-0"
            style={{ width: "38px" }}
          >
            <i class="bi bi-minus"></i>
          </Button>
            <Modal show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Ticket Classes</Modal.Title>
              </Modal.Header>
              {ticketclasses.map((tic, idx)=>(
                <>
                    <Col key={tic.id}>
                      <Card className=" h-100">
                        <Card.Header>
                          <Stack direction="horizontal" gap={2}>
                            <span className="font-monospace text-secondary"></span>
                            <Badge bg="secondary" className="ms-auto">
                            {tic.cost.toString()} Ticket Price
                            </Badge>
                          </Stack>
                        </Card.Header>
                        <div className=" ratio ratio-4x3">
                          <img src={tic.badgeUrl} alt={tic.title} style={{ objectFit: "cover" }} />
                        </div>
                        <Card.Body className="d-flex  flex-column text-center">
                          <Card.Title>{tic.title}</Card.Title>
                          <Card.Text className="text-secondary">
                            
                          </Card.Text>
                          <Button
                            variant="outline-dark"
                            onClick={() => deleteticket(id, tic.id)}
                            className="w-100 py-3"
                          >
                            Delete
                          </Button>
                          <UpdateTicketClass ticketclass={tic} save={updateticket} eventId={id} />
                        </Card.Body>
                      </Card>
                    </Col>
                </>
              ))}
              <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={_show} onHide={_handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Purchased Tickets</Modal.Title>
              </Modal.Header>
              {_tickets.map((tic, idx)=>(
                <>
                    <Col key={tic.id}>
                      <Card className=" h-100">
                        <Card.Header>
                          <Stack direction="horizontal" gap={2}>
                            <span className="font-monospace text-secondary"></span>
                            <Badge bg="secondary" className="ms-auto">
                            {tic.cost.toString()} Ticket Price
                            </Badge>
                          </Stack>
                        </Card.Header>
                        <div className=" ratio ratio-4x3">
                          <img src={tic.badgeUrl} alt={tic.title} style={{ objectFit: "cover" }} />
                        </div>
                        <Card.Body className="d-flex  flex-column text-center">
                          <Card.Title>{tic.title}</Card.Title>
                          <Card.Text className="text-secondary">
                            
                          </Card.Text>
                          <Button
                            variant="outline-dark"
                            onClick={() => deleteticket(id, tic.id)}
                            className="w-100 py-3"
                          >
                            Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                </>
              ))}

              <Modal.Footer>
                <Button variant="outline-secondary" onClick={_handleClose}>
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

ManagedEvent.propTypes = {
  event: PropTypes.instanceOf(Object).isRequired,
  buyticket: PropTypes.func.isRequired,
  updateticket: PropTypes.func.isRequired,
  deleteticket: PropTypes.func.isRequired,
  updateevent: PropTypes.func.isRequired,
  deleteevent: PropTypes.func.isRequired 
};

export default ManagedEvent;
