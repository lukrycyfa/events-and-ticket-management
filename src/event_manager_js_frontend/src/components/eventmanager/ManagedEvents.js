import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import AddEvent from "./AddEvent";
import ManagedEvent from "./ManagedEvent";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { createEvent, updateEvent, 
   addTicketClass, updateTicketClass, deleteEvent, deleteTicketClass 
  } from "../../utils/eventmanagment";

const ManagedEvents = ({ managedevents, getmanagedevents }) => {

  const [_managedevents, setManagedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const addEvent = async (data) => {
    try {
      setLoading(true);
      const start = new Date(Date.parse(data.eventStart));
      const end = new Date(Date.parse(data.eventEnd));
      data.eventStart = start.getTime();
      data.eventEnd = end.getTime();
      createEvent(data).then((resp) => {
        console.log(resp)
        getmanagedevents();
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
        getmanagedevents();
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
    try {
      setLoading(true);
      deleteEvent(eventId).then((resp) => {
        console.log(resp)
        getmanagedevents();
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
        console.log(resp)
        getmanagedevents();
      });
      toast(<NotificationSuccess text="Ticket added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a Event." />);
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
        getmanagedevents();
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
    try {
      setLoading(true);
      const costStr = data.cost;
      data.cost = parseInt(costStr, 10) * 10**8;
      deleteTicketClass(eventId, ticketclassId).then((resp) => {
        console.log(resp)
        getmanagedevents();
      });
      toast(<NotificationSuccess text="Ticket added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a Event." />);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log(managedevents, "managed")
    // setManagedEvents(managedevents)
  }, [managedevents]);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i class="bi bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>All Managed Events</Modal.Title>
        </Modal.Header>
            {!loading ? (
            <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Get Ticket For Your Entertaiment</h1>
                <AddEvent save={addEvent} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                {_managedevents.map((_event) => (
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
                ))}
            </Row>
            </>
        ) : (
            <Loader />
        )}
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ManagedEvents.propTypes = {
  managedevents: PropTypes.instanceOf(Object).isRequired,
  getmanagedevents: PropTypes.func.isRequired
};

export default ManagedEvents;
