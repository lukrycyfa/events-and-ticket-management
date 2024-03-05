import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";


export async function getEvents() {
  try {
    return await window.canister.eventmanager.getAllEvents();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getEventsByManagement() {
    try {
      return await window.canister.eventmanager.getEventsByManagment();
    } catch (err) {
      if (err.name === "AgentHTTPResponseError") {
        const authClient = window.auth.client;
        await authClient.logout();
      }
      return [];
    }
}

export async function getAttendeeTickets() {
    try {
      return await window.canister.eventmanager.getAttendeeTickets();
    } catch (err) {
      if (err.name === "AgentHTTPResponseError") {
        const authClient = window.auth.client;
        await authClient.logout();
      }
      return [];
    }
}

export async function createEvent(event) {
    return window.canister.eventmanager.addEvent(event);
}

export async function updateEvent(event, eventId) {
    return window.canister.eventmanager.updateEvent(event, eventId);
}

export async function deleteEvent(eventId) {
    return window.canister.eventmanager.deleteEvent(eventId);
}

export async function addTicketClass(ticketclass, eventId) {
    return window.canister.eventmanager.addTicketClass(ticketclass, eventId);
}

export async function updateTicketClass(ticketclass, eventId, ticketclassId) {
    return window.canister.eventmanager.updateTicketClass(ticketclass, eventId, ticketclassId);
}

export async function deleteTicketClass(eventId, ticketclassId) {
    return window.canister.eventmanager.deleteTicketClass(eventId, ticketclassId);
}


export async function buyTicket(eventId, ticketclassId) {
  const eventmanagerCanister = window.canister.eventmanager;
  const paymentResponse = await eventmanagerCanister.makePayment(eventId, ticketclassId);
  const managerPrincipal = Principal.from(paymentResponse.Ok.eventManagerAddress);
  const managerAddress = await eventmanagerCanister.getAddressFromPrincipal(managerPrincipal);
  const block = await transferICP(managerAddress, paymentResponse.Ok.cost, paymentResponse.Ok.memo);
  const getTicket = await eventmanagerCanister.getTicket(managerPrincipal, paymentResponse.Ok.cost, block, paymentResponse.Ok.memo);
  return getTicket;
}


export async function deleteTicket(ticketId) {
  return window.canister.eventmanager.deleteTicket(ticketId);
}