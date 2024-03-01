import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal, Stack, Carousel, Container, Col, Row } from "react-bootstrap";
import AddEvent from "./AddEvent";
import ManagedEvent from "./ManagedEvent";
import Loader from "../utils/Loader";


import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { createEvent, updateEvent, getEventsByManagement,
   addTicketClass, updateTicketClass, deleteEvent, deleteTicketClass 
  } from "../../utils/eventmanagment";


const ManagedEvents = ({ }) => {

  const [_managedevents, setManagedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);


  const _tickets = [{ id: "text1", title: "text", description: "text", eventLocation: "text", ticketClassTitle: "text",
  attendee: "Principal", eventId: "text", ticketClassId: "text", cost: 4500000000, paid: true, createdAt: 1709162351995, updatedAt: 1709162351995},
  { id: "text2", title: "text", description: "text", eventLocation: "text", ticketClassTitle: "text",attendee: "Principal", 
  eventId: "text", ticketClassId: "text", cost: 4500000000, paid: true, createdAt: 1709162351995, updatedAt: 1709162351995},
  { id: "text2", title: "text", description: "text", eventLocation: "text", ticketClassTitle: "text",attendee: "Principal", 
  eventId: "text", ticketClassId: "text", cost: 4500000000, paid: true, createdAt: 1709162351995, updatedAt: 1709162351995},
  { id: "text2", title: "text", description: "text", eventLocation: "text", ticketClassTitle: "text",attendee: "Principal", 
  eventId: "text", ticketClassId: "text", cost: 4500000000, paid: true, createdAt: 1709162351995, updatedAt: 1709162351995}
]


const _ticketclass  = [{ id: "text1", title: "text", badgeUrl: "text", cost: 4500000000, createdAt: 1709162351995, updatedAt: 1709162351995},
            { id: "text2", title: "text", badgeUrl: "text", cost: 4500000000, createdAt: 1709162351995, updatedAt: 1709162351995},
            { id: "text2", title: "text", badgeUrl: "text", cost: 4500000000, createdAt: 1709162351995, updatedAt: 1709162351995}]

const _event = [{ id: "text1", title: "text", description: "text", bannerUrl: "text", eventLocation: "text", manager: "Principal",
  tickets: _tickets, ticketClasses: _ticketclass, eventStart: 1709162351995, eventEnd: 1709167351995, soldOut: 5, createdAt: 1709162351995,
  updatedAt: 1709162351995 }, { id: "text2", title: "text", description: "On this celo marketplace front-end project, developed for the Celo marketplace contract I have made a couple of improvements to the", bannerUrl: "text", eventLocation: "text", manager: "Principal",
  tickets: _tickets, ticketClasses: _ticketclass, eventStart: 1709162351995, eventEnd: 1709167351995, soldOut: 5, createdAt: 1709162351995,
  updatedAt: 1709162351995 }, { id: "text2", title: "text", description: "On this celo marketplace front-end project, developed for the Celo marketplace contract I have made a couple of improvements to the UI/UX, and added new features and utilities as part of these improvements. Some of the key improvements made are", bannerUrl: "text", eventLocation: "text", manager: "Principal",
  tickets: _tickets, ticketClasses: _ticketclass, eventStart: 1709162351995, eventEnd: 1709167351995, soldOut: 5, createdAt: 1709162351995,
  updatedAt: 1709162351995 },{ id: "text2", title: "text", description: "On this celo marketplace front-end project, developed for the Celo marketplace contract I have made a couple of improvements to the", bannerUrl: "text", eventLocation: "text", manager: "Principal",
  tickets: _tickets, ticketClasses: _ticketclass, eventStart: 1709162351995, eventEnd: 1709167351995, soldOut: 5, createdAt: 1709162351995,
  updatedAt: 1709162351995 },{ id: "text2", title: "text", description: "On this celo marketplace front-end project, developed for the Celo marketplace contract I have made a couple of improvements to the UI/UX, and added new features and utilities as", bannerUrl: "text", eventLocation: "text", manager: "Principal",
  tickets: _tickets, ticketClasses: _ticketclass, eventStart: 1709162351995, eventEnd: 1709167351995, soldOut: 5, createdAt: 1709162351995,
  updatedAt: 1709162351995 },{ id: "text2", title: "text", description: "On this celo marketplace front-end project, developed for the Celo marketplace contract I have made a couple of improvements to the UI/UX, and added new features and utilities as part of these improvements. Some of the key improvements made are the comment section,", bannerUrl: "text", eventLocation: "text", manager: "Principal",
  tickets: _tickets, ticketClasses: _ticketclass, eventStart: 1709162351995, eventEnd: 1709167351995, soldOut: 5, createdAt: 1709162351995,
  updatedAt: 1709162351995 },
]

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const getManagedEvents = async () => {
    try {
      setLoading(true);
      var mgmevents = await getEventsByManagement();
      console.log(mgmevents, "managed")
      setManagedEvents(_event);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (data) => {
    try {
      setLoading(true);
      const start = new Date(Date.parse(data.eventStart));
      const end = new Date(Date.parse(data.eventEnd));
      data.eventStart = start.getTime();
      data.eventEnd = end.getTime();
      createEvent(data).then((resp) => {
        console.log(resp)
        getManagedEvents();
      });
      toast(<NotificationSuccess text="Event added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a Event." />);
    } finally {
      setLoading(false);
    }
  };


  const updateMyEvent = async (data, eventId) => {
    try {
      setLoading(true);
      const start = new Date(Date.parse(data.eventStart));
      const end = new Date(Date.parse(data.eventEnd));
      data.eventStart = start.getTime();
      data.eventEnd = end.getTime();
      updateEvent(data, eventId).then((resp) => {
        console.log(resp)
        getManagedEvents();
      });
      toast(<NotificationSuccess text="Event Updated successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Update Event." />);
    } finally {
      setLoading(false);
    }
  };

  const deletMyEvent = async (eventId) => {
    setLoading(true);
    try {
      deleteEvent(eventId).then((resp) => {
        console.log(resp)
        getManagedEvents();
      });
      toast(<NotificationSuccess text="Event Delete successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Delete Event." />);
    } finally {
      setLoading(false);
    }
  };


  const addTicket = async (data, eventId) => {
    try {
      setLoading(true);
      const costStr = data.cost;
      data.cost = parseInt(costStr, 10) * 10**8;
      addTicketClass(data, eventId).then((resp) => {
        console.log(resp);
        getManagedEvents();
      });
      toast(<NotificationSuccess text="Ticket added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add Ticket." />);
    } finally {
      setLoading(false);
    }
  };


  const updateTicket = async (data, eventId, ticketclassId) => {
    try {
      setLoading(true);
      const costStr = data.cost;
      data.cost = parseInt(costStr, 10) * 10**8;
      updateTicketClass(data, eventId, ticketclassId).then((resp) => {
        console.log(resp)
        getManagedEvents();
      });
      toast(<NotificationSuccess text="Event Updated successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Update Event." />);
    } finally {
      setLoading(false);
    }
  };


  const deleteTicket = async (eventId, ticketclassId) => {
    setLoading(true);
    try {

      deleteTicketClass(eventId, ticketclassId).then((resp) => {
        console.log(resp)
        getManagedEvents();
      });
      toast(<NotificationSuccess text="Ticket deleted successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to delete a Event." />);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Button
        onClick={() => {
          getManagedEvents()
          handleShow()}}
        variant="dark"
        className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
      >
        Managed Events
      </Button>
      <Modal show={show} onHide={handleClose} size="lg" centered  scrollable={true} backdrop={true} >
        <Modal.Header closeButton>
        <Stack direction="horizontal" gap={3}>
          <Modal.Title>Your Managed Events </Modal.Title>
        </Stack>  
        </Modal.Header>
          <Modal.Body className="rounded-2 border-info shadow-lg" style={{ backgroundColor: "#662d12"}}>
          {!loading ? (
            <>
          <Container>  
              <Carousel slide  variant="dark" pause interval={null}
              prevIcon={<Button variant="primary"><i className="bi bi-arrow-left me-2 fs-2" /></Button>}
              nextIcon={<Button variant="primary"><i className="bi bi-arrow-right me-2 fs-2" /></Button>}
              >
                {_managedevents.map((_event, idx) => (
                <Carousel.Item key={idx}>  
                      <Row >
            <Col xs={6} md={2} bg="info">
            </Col>
            <Col xs={12} md={8}>    
                <ManagedEvent
                    event={{
                    ..._event,
                    }}
                    addticket={addTicket}
                    updateticket={updateTicket}
                    deleteticket={deleteTicket}
                    updateevent={updateMyEvent}
                    deleteevent={deletMyEvent}
                />
            </Col>
            <Col xs={6} md={2}>
            </Col>
          </Row>
                </Carousel.Item>
                ))}                    
              </Carousel>

          </Container>
          </>
        ) : (
            <Loader />
        )}
          </Modal.Body>  


        <Modal.Footer>
        <AddEvent save={addEvent} />
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};



export default ManagedEvents;
