// imported dependencies
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Event from "./Event";
import PurchasedTicket from "./PurchasedTicket";
import Loader from "../utils/Loader";
import { Row, Card, Stack, Modal, Button, Nav, Navbar, Container } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getEvents as getEventList, getAttendeeTickets, deleteTicket,
  buyTicket as getTicket
} from "../../utils/eventmanagment";
import ManagedEvents from "./ManagedEvents";

// The All Events Construct
const Events = () => {

  // all events, purchased tickets and loading state variabled
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);


  // purchased tickets modal state 
  const [show, setShow] = useState(false);
  // purchased tickets modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  // function to get the list of products
  const getEvents = useCallback(async () => {
    try {
      setLoading(true);
      setEvents(await getEventList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);


  const getMyTickets = useCallback(async () => {
    try {
      setLoading(true);
      const _tickets = await getAttendeeTickets();
      if (_tickets.Err) return;
      setTickets(_tickets.Ok.tickets);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  //  function to initiate transaction
  const buyTicket = async (eid, tid) => {
    try {
      setLoading(true);
      const _getticket = await getTicket(eid, tid);
      if (_getticket.Err) {
        toast(<NotificationError text={`${_getticket.Err.NotFound}`} />);
        return;
      }
      getEvents();
      getMyTickets();
      toast(<NotificationSuccess text="Purchased Ticket Successfully" />);
    } catch (error) {
      console.log(error)
      toast(<NotificationError text="Failed to purchase ticket." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to initiate transaction
  const deleteMyTicket = async (id) => {
    setLoading(true);
    try {
      const _delete = await deleteTicket(id);
      if (_delete.Err) {
        toast(<NotificationError text={`${_delete.Err.NotFound}`} />);
        return;
      }
      getMyTickets();
      toast(<NotificationSuccess text="Ticket Deleted successfully" />);
    } catch (error) {
      toast(<NotificationError text="Failed to delete ticket." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
    getMyTickets();
  }, [getEvents, getMyTickets]);

  return (
    <>
      {!loading ? (
        <>

          <Navbar collapseOnSelect sticky="top" expand="lg" className="bg-body-tertiary" style={{ backgroundColor: "#01041c" }}>
            <Container>
              <Navbar.Brand className="text-white" >Get Ticket For Your Entertaiment</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">

                <Nav className="me-auto">
                  <Stack direction="horizontal" gap={2}>
                    <Nav.Item>
                      <ManagedEvents getevents={getEvents} />
                    </Nav.Item>
                    <Nav.Item>
                      <Button
                        onClick={handleShow}
                        variant="dark"
                        className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"

                      >
                        My Tickets
                      </Button>
                    </Nav.Item>
                  </Stack>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Card className="text-center rounded-2 border-info shadow-lg" style={{ backgroundColor: "#c42f02" }}>
            <Card.Header className="text-white display-5">Featured Events</Card.Header>
            <Card.Body>
              <Row xs={1} sm={1} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">

                {events.map((_event, idx) => (
                  <Event
                    key={idx}
                    event={{
                      ..._event,
                    }}
                    buyticket={buyTicket}
                  />
                ))}
              </Row>
            </Card.Body>
            <Card.Footer className="text-muted">..........</Card.Footer>
          </Card>



          <Modal show={show} onHide={handleClose} size="xl" centered scrollable={true} backdrop={true}>
            <Modal.Header closeButton>
              <Modal.Title>Purchased Tickets</Modal.Title>
            </Modal.Header>
            <Modal.Body className="rounded-2 border-info shadow-lg" style={{ backgroundColor: "#010733" }}>
              <Row xs={1} sm={1} lg={3} className="g-3 flex flex-nowrap overflow-x-scroll  mb-5 g-xl-4 g-xxl-5">
                {tickets.map((_ticket, idx) => (
                  <PurchasedTicket
                    key={idx}
                    ticket={{
                      ..._ticket,
                    }}
                    deleteticket={deleteMyTicket}
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
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Events;
