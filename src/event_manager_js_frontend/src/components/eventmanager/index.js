import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Event from "./Event";
import PurchasedTicket from "./PurchasedTicket";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { getEvents as getEventList, getAttendeeTickets, deleteTicket,
  buyTicket as getTicket } from "../../utils/eventmanagment";
import ManagedEvents from "./ManagedEvents";


const Events = () => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

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
  });

  const getMyTickets = useCallback(async () => {
    try {
      setLoading(true);
      setTickets(await getAttendeeTickets());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  //  function to initiate transaction
  const buyTicket = async (id, tid) => {
    try {
      setLoading(true);
      await getTicket({
        id, tid
      }).then((resp) => {
        getEvents();
        getMyTickets();
        toast(<NotificationSuccess text="Product bought successfully" />);
      });
    } catch (error) {
      toast(<NotificationError text="Failed to purchase product." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to initiate transaction
  const deleteMyTicket = async (id, tid) => {
    try {
      setLoading(true);
      await deleteTicket({
        id
      }).then((resp) => {
        getMyTickets();
        toast(<NotificationSuccess text="Ticket Deleted successfully" />);
      });
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Get Ticket For Your Entertaiment</h1>
            <ManagedEvents />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {events.map((_event) => (
              <Event
                event={{
                  ..._event,
                }}
                buyticket={buyTicket}
              />
            ))}
          </Row>

          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {tickets.map((_ticket) => (
              <PurchasedTicket
                ticket={{
                  ..._ticket,
                }}
                deleteticket={deleteMyTicket}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Events;
