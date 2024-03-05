import React, { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Button, Modal, Stack, Carousel, Container, Col, Row } from "react-bootstrap";
import AddEvent from "./AddEvent";
import ManagedEvent from "./ManagedEvent";
import Loader from "../utils/Loader";


import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { createEvent, updateEvent, getEventsByManagement,
   addTicketClass, updateTicketClass, deleteEvent, deleteTicketClass 
  } from "../../utils/eventmanagment";


const ManagedEvents = ({ getevents }) => {

  const [_managedevents, setManagedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const getManagedEvents = async () => {
    try {
      setLoading(true);
      const _mgmevents = await getEventsByManagement();
      console.log(_mgmevents, "managed")
      if (_mgmevents.Err) return;
      setManagedEvents(_mgmevents.Ok.events);
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
      data.eventStart = start.getTime()*1000000;
      data.eventEnd = end.getTime()*1000000;
      const _create =  await createEvent(data);
      if (_create.Err) {
        toast(<NotificationError text={`${_create.Err}`} />);
        return;
      }
      console.log(_create)
      getManagedEvents();
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
      data.eventStart = start.getTime()*1000000;
      data.eventEnd = end.getTime()*1000000;
      const _update =  await updateEvent(data, eventId);
      if (_update.Err) {
        toast(<NotificationError text={`${_update.Err}`} />);
        return;
      }
      console.log(_update);
      getManagedEvents();
      toast(<NotificationSuccess text="Event Updated successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Update Event." />);
    } finally {
      setLoading(false);
    }
  };

  const deleteMyEvent = async (eventId) => {
    setLoading(true);
    try {
      const _delete =  await deleteEvent(eventId);
      if (_delete.Err) {
        toast(<NotificationError text={`${_delete.Err}`} />);
        return;
      }
      console.log(_delete);
      getManagedEvents();
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
      const _add =  await addTicketClass(data, eventId);
      console.log(_add)
      if (_add.Err) {
        toast(<NotificationError text={`${_add.Err}`} />);
        return;
      }
      console.log(_add);
      getManagedEvents();
      toast(<NotificationSuccess text="TicketClass added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add TicketClass." />);
    } finally {
      setLoading(false);
    }
  };


  const updateTicket = async (data, eventId, ticketclassId) => {
    try {
      setLoading(true);
      const costStr = data.cost;
      data.cost = parseInt(costStr, 10) * 10**8;
      const _update =  await updateTicketClass(data, eventId, ticketclassId);
      if (_update.Err) {
        toast(<NotificationError text={`${_update.Err}`} />);
        return;
      }
      console.log(_update);
      getManagedEvents();
      toast(<NotificationSuccess text="TicketClass Updated successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Update TicketClass." />);
    } finally {
      setLoading(false);
    }
  };


  const deleteTicket = async (eventId, ticketclassId) => {
    setLoading(true);
    try {
      const _delete =  await deleteTicketClass(eventId, ticketclassId);
      if (_delete.Err) {
        toast(<NotificationError text={`${_delete.Err}`} />);
        return;
      }
      console.log(_delete);
      getManagedEvents();
      toast(<NotificationSuccess text="TicketClass deleted successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to delete a TicketClass." />);
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
        <Modal.Header >
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
                    deleteevent={deleteMyEvent}
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
          <Button variant="outline-secondary" onClick={() => {handleClose();
          getevents();}
          }>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ManagedEvents.propTypes = {
  getevents: PropTypes.func.isRequired 
};

export default ManagedEvents;
