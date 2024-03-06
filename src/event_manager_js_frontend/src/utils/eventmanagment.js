import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

// get all events from the canisters
export async function getEvents() {
  try {
    // call the canister
    return await window.canister.eventmanager.getAllEvents();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// get all events related to a caller from the canisters
export async function getEventsByManagement() {
    try {
      // call the canister
      return await window.canister.eventmanager.getEventsByManagment();
    } catch (err) {
      if (err.name === "AgentHTTPResponseError") {
        const authClient = window.auth.client;
        await authClient.logout();
      }
      return [];
    }
}

// get all attendee's tickets related to the caller from the canisters
export async function getAttendeeTickets() {
    try {
      // call the canister
      return await window.canister.eventmanager.getAttendeeTickets();
    } catch (err) {
      if (err.name === "AgentHTTPResponseError") {
        const authClient = window.auth.client;
        await authClient.logout();
      }
      return [];
    }
}

// create an event
export async function createEvent(event) {
    // call the canister
    return window.canister.eventmanager.addEvent(event);
}

// update an event
export async function updateEvent(event, eventId) {
    // call the canister
    return window.canister.eventmanager.updateEvent(event, eventId);
}

// publish an event
export async function publishEvent(eventId) {
  // call the canister
  return window.canister.eventmanager.publishEvent(eventId);
}

// delete an event
export async function deleteEvent(eventId) {
    // call the canister
    return window.canister.eventmanager.deleteEvent(eventId);
}

// add a ticket class to an event
export async function addTicketClass(ticketclass, eventId) {
    // call the canister
    return window.canister.eventmanager.addTicketClass(ticketclass, eventId);
}

// update a ticket class
export async function updateTicketClass(ticketclass, eventId, ticketclassId) {
    // call the canister
    return window.canister.eventmanager.updateTicketClass(ticketclass, eventId, ticketclassId);
}

// delete a tiicket class
export async function deleteTicketClass(eventId, ticketclassId) {
    // call the canister
    return window.canister.eventmanager.deleteTicketClass(eventId, ticketclassId);
}

// purchase a ticket 
export async function buyTicket(eventId, ticketclassId) {
  // call the canister
  const eventmanagerCanister = window.canister.eventmanager;
  // create a pending payment
  const paymentResponse = await eventmanagerCanister.makePayment(eventId, ticketclassId);
  // get caller's principal
  const managerPrincipal = Principal.from(paymentResponse.Ok.eventManagerAddress);
  // get callers account-id
  const managerAddress = await eventmanagerCanister.getAddressFromPrincipal(managerPrincipal);
  // transfer icp's to manager
  const block = await transferICP(managerAddress, paymentResponse.Ok.cost, paymentResponse.Ok.memo);
  // complete payment and get ticket
  const getTicket = await eventmanagerCanister.getTicket(managerPrincipal, paymentResponse.Ok.cost, block, paymentResponse.Ok.memo);
  return getTicket;
}

// delete a ticket
export async function deleteTicket(ticketId) {
  return window.canister.eventmanager.deleteTicket(ticketId);
}