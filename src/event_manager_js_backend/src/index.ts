//canister code goes here
import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister, nat8 } from "azle";
import {
    Ledger, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";


// A Construct holding attributes of a TicketClass of type Record
const TicketClass = Record({
    id: text,
    title: text,
    badgeUrl: text,
    cost: nat64, 
    createdAt: nat64,
    updatedAt: nat64
})

// A Construct holding attributes of a Ticket of type Record
const Ticket = Record({
    id: text,
    eventTitle: text,//
    description: text,
    eventLocation: text,
    ticketClassTitle: text,
    attendee: Principal,
    eventId: text,
    ticketClassId: text,
    eventStart: nat64,//
    eventEnd: nat64,//
    cost: nat64,
    paid: bool,
    createdAt: nat64,
    updatedAt: nat64   
});

// A Construct holding attributes of an Event of type Record
const Event = Record({
    id: text,
    title: text,
    description: text,
    bannerUrl: text,
    eventLocation: text,
    manager: Principal,
    tickets: Vec(Ticket),
    ticketClasses: Vec(TicketClass),
    eventStart: nat64,
    eventEnd: nat64,
    soldOut: nat64,
    published: bool,
    createdAt: nat64,
    updatedAt: nat64 
});

// A Construct holding attributes of an Event Manager of type Record
const EventManager = Record({
    id: text,
    manager: Principal,
    events: Vec(Event),
    createdAt: nat64,
    updatedAt: nat64, 
});

// A Construct holding attributes of an AttendeeTickets of type Record
const AttendeeTickets = Record({
    id: text,
    tickets: Vec(Ticket),
    createdAt: nat64,
    updatedAt: nat64, 
});


// A Construct holding attributes for a TicketClassPayload of type Record
const TicketClassPayload = Record({
    title: text,
    cost: nat64,
    badgeUrl: text
})

// A Construct holding attributes for an EventPayload of type Record
const EventPayload = Record({
    title: text,
    description: text,
    eventLocation: text,
    bannerUrl: text,
    eventStart: nat64,
    eventEnd: nat64
});

// A Construct holding attributes for a PaymentStatus of type Variant
const PaymentStatus = Variant({
    PaymentPending: text,
    Completed: text
});

// A Construct holding attributes for a Payment of type Record
const Payment = Record({
    eventId: text,
    ticketClassId: text,
    cost: nat64,
    status: PaymentStatus,
    eventManagerAddress: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
});

// A Construct holding attributes for a Message of type Variant
const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text,
    ApprovedAdvert: text
});

// Data storage locations and mappings for eventManager's, attendee's, event's, ticket's,
// ticketClasses, completedPayments and pendingPayments.
const eventManagerStorage = StableBTreeMap(0, Principal, EventManager);
const attendeeStorage = StableBTreeMap(1, Principal, AttendeeTickets);
const eventStorage = StableBTreeMap(2, text, Event);
const ticketStorage = StableBTreeMap(3, text, Ticket);
const ticketClassStorage = StableBTreeMap(4, text, TicketClass);
const completedPayments = StableBTreeMap(5, Principal, Payment);
const pendingPayments = StableBTreeMap(6, nat64, Payment);

// Create an instance of the ledger canister
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

const PAYMENT_RESERVATION_PERIOD = 180n; // reservation period in seconds

// The Event Manager Construct.
export default Canister({

    // Query and retrive all events created on the canister
    getAllEvents: query([], Vec(Event), () => {
        var events = eventStorage.values();
        var _events = new Array()
        // Ommit purchased tickets and return events
        for (let i = 0; i < events.length; i++){
            if (events[i].published){
                events[i].tickets = [];
                _events.push(events[i])
            }
        }
        return _events;
    }),

    // Query and retrive all events realated to an Event Manager on the canister
    getEventsByManagment: query([], Result(EventManager, Message), () => {
        // query for an event manager and retrive, events associated
        const eventmanagerOpt = eventManagerStorage.get(ic.caller());
        if ("None" in eventmanagerOpt) {
            return Err({ NotFound: `event manager with id=${ic.caller()} not found` });
        }
        const eventmanager = eventmanagerOpt.Some;
        return Ok(eventmanager);
    }),

    // Query and retrive all Tickets realated to an Attendee on the canister
    getAttendeeTickets: query([], Result(AttendeeTickets, Message), () => {
        // query for an Attendee and retrive, Tickets associated
        const attendeeOpt = attendeeStorage.get(ic.caller());
        if ("None" in attendeeOpt) {
            return Err({ NotFound: `attendee with id=${ic.caller()} not found` });
        }
        return Ok(attendeeOpt.Some);
    }),

    // Create and Add an Event to the Canister
    addEvent: update([EventPayload], Result(Event, Message), (payload: EventPayload) => {
        // make assertions on the payload, Create a new Event Manager from the caller if non exist's, create a new Event, 
        // associate it with the caller i.e the event manager and make updates.
        if (typeof payload !== "object" || Object.keys(payload).length === 0
        || payload.title.length <= 0 || payload.description.length <= 0 || payload.eventLocation.length <= 0 || payload.bannerUrl.length <= 0 || payload.eventStart < ic.time() || payload.eventEnd <= payload.eventStart)  {
            return Err({ NotFound: "Invalid Payload" })
        }
        const eventMgm = eventManagerStorage.get(ic.caller()); 
        const newEvent = { id: uuidv4(), manager: ic.caller(), tickets: new Array(), ticketClasses: new Array(), soldOut: 0n, published: false, ...payload, createdAt: ic.time(), updatedAt: ic.time()};     
        eventStorage.insert(newEvent.id, newEvent); 
        if ("None" in eventMgm) {
            const _eventMgm = { id: uuidv4(), manager: ic.caller(), events: new Array(), createdAt: ic.time(), updatedAt: ic.time()};
            _eventMgm.events.push(newEvent);
            eventManagerStorage.insert(ic.caller(), _eventMgm);
            return Ok(newEvent);
        }
        const updateeventMgm = eventMgm.Some;
        updateeventMgm.events.push(newEvent);
        eventManagerStorage.insert(ic.caller(), updateeventMgm);
        return Ok(newEvent);
    }),

    // Update an Event created on the Canister  
    updateEvent: update([EventPayload, text], Result(Event, Message), (payload: EventPayload, eventId: text) => {
        // make assertions on the payload, get Event Manager instance associated with the caller if any exist's, 
        // make assertions on the eventId and make updates to Event and Event Manager.
        if (typeof payload !== "object" || Object.keys(payload).length === 0 ||
        payload.title.length <= 0 || payload.description.length <= 0 || payload.eventLocation.length <= 0 || payload.bannerUrl.length <= 0 || payload.eventStart < ic.time() || payload.eventEnd <= payload.eventStart) {
            return Err({ NotFound: "Invalid Payload" })
        }
        const eventMgm = eventManagerStorage.get(ic.caller());       
        if ("None" in eventMgm) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const updateeventMgm = eventMgm.Some;
        const event = eventStorage.get(eventId);       
        if ("None" in event || updateeventMgm.events.findIndex((eid)=> eid.id === eventId) < 0) {
            return Err({ NotFound: `event with: id=${eventId} not found or part of management events` });
        }
        const _event = event.Some;
        if (_event.published) {
            return Err({ NotFound: `event with: id=${eventId} Has been published`});
        }
        const updateEvent = {..._event, ...payload, updatedAt: ic.time()};
        updateeventMgm.events[updateeventMgm.events.findIndex((eid)=> eid.id === eventId)] = updateEvent;
        eventStorage.insert(_event.id, updateEvent);
        eventManagerStorage.insert(ic.caller(), updateeventMgm);

        return Ok(updateEvent);
    }),

    // Publish an Event created on the Canister  
    publishEvent: update([text], Result(Event, Message), (eventId: text) => {
        // get Event Manager instance associated with the caller if any exist's, 
        // make assertions on the `eventId` and event then update the published state of Event and 
        // event on the Event Manager.
        const eventMgm = eventManagerStorage.get(ic.caller());       
        if ("None" in eventMgm) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const updateeventMgm = eventMgm.Some;
        const event = eventStorage.get(eventId);       
        if ("None" in event || updateeventMgm.events.findIndex((eid)=> eid.id === eventId) < 0) {
            return Err({ NotFound: `event with: id=${eventId} not found or part of management events` });
        }
        const _event = event.Some;
        if (_event.published && _event.eventEnd < ic.time()) {
            return Err({ NotFound: `event with: id=${eventId} Has been published or Ended`});
        }
        _event.published = true;
        updateeventMgm.events[updateeventMgm.events.findIndex((eid)=> eid.id === eventId)].published = true;
        eventStorage.insert(_event.id, _event);
        eventManagerStorage.insert(ic.caller(), updateeventMgm);

        return Ok(_event);
    }),

    // Delete an Event created on the Canister
    deleteEvent: update([text], Result(text, Message), (eventId: text) => {
        // get Event Manager instance associated with the caller if any exist's, 
        // make assertions on the eventId, Event for validity and Delete Event from Event's storage and Event Manager.
        const eventMgm = eventManagerStorage.get(ic.caller());       
        if ("None" in eventMgm) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const updateeventMgm = eventMgm.Some;
        const deleteEventOpt = eventStorage.get(eventId);    
        if ("None" in deleteEventOpt || updateeventMgm.events.findIndex((eid)=> eid.id === eventId) < 0) {
            return Err({ NotFound: `event with: id=${eventId} not found or part of managements events` });
        }
        const deleteEvent = deleteEventOpt.Some;
        if (deleteEvent.tickets.length > 0 && deleteEvent.eventEnd > ic.time()) {
            return Err({ NotFound: `event with: id=${eventId} is still a valid event with attendee's` });
        }
        let idx = updateeventMgm.events.findIndex((eid)=> eid.id === eventId);
        deleteEntry(updateeventMgm.events, idx);
        eventManagerStorage.insert(ic.caller(), updateeventMgm);
        eventStorage.remove(eventId);
        return Ok(deleteEvent.id);
    }),

    // Add a Ticket Class to an Event on the Canister
    addTicketClass: update([TicketClassPayload, text], Result(TicketClass, Message), (payload: TicketClassPayload, eventId: text) => {
        // make assertions on the payload, Event Manager instance from the caller if any exist's and eventId for a valid Event. 
        // create a new ticket class and associate it with the event with `eventId` and the caller i.e the event manager and make updates.
        if (typeof payload !== "object" || Object.keys(payload).length === 0 || payload.title.length <= 0 || payload.badgeUrl.length <= 0 || payload.cost <= 0) {
            return Err({ NotFound: "invalid payload" })
        }
        const eventMgm = eventManagerStorage.get(ic.caller());       
        if ("None" in eventMgm) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const updateeventMgm = eventMgm.Some;
        const event = eventStorage.get(eventId);       
        if ("None" in event || updateeventMgm.events.findIndex((eid)=> eid.id === eventId) < 0) {
            return Err({ NotFound: `event with: id=${eventId} not found or part of managment events` });
        }
        const _event = event.Some;
        if (_event.eventEnd < ic.time()) return Err({ NotFound: `event with: id=${eventId} has ended` });
        const ticketclass = { id: uuidv4(), ...payload, createdAt: ic.time(), updatedAt: ic.time()}
        const updateEvent = {..._event, ticketClasses: [..._event.ticketClasses, ticketclass], updatedAt: ic.time()}
        const eidx = updateeventMgm.events.findIndex((eid)=> eid.id === eventId);
        updateeventMgm.events[eidx].ticketClasses.push(ticketclass);
        ticketClassStorage.insert(ticketclass.id, ticketclass);
        eventStorage.insert(_event.id, updateEvent);
        eventManagerStorage.insert(ic.caller(), updateeventMgm);
        return Ok(ticketclass);
    }),

    // Update a Ticket Class to an Event created on the Canister
    updateTicketClass: update([TicketClassPayload, text, text], Result(TicketClass, Message), (payload: TicketClassPayload, eventId: text, ticketclassId: text) => {
        // make assertions on the payload, get Event Manager instance associated with the caller if any exist's, 
        // make assertions on the `eventId` and Event associated, the `ticketclassId` and ticket associated
        // and make updates to the Ticketclass, Event and Event Manager.
        if (typeof payload !== "object" || Object.keys(payload).length === 0 || payload.title.length <= 0 || payload.badgeUrl.length <= 0 || payload.cost <= 0) {
            return Err({ NotFound: "invalid payload" })
        }
        const eventMgm = eventManagerStorage.get(ic.caller());       
        if ("None" in eventMgm) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const updateeventMgm = eventMgm.Some;
        const event = eventStorage.get(eventId);       
        if ("None" in event || updateeventMgm.events.findIndex((eid)=> eid.id === eventId) < 0) {
            return Err({ NotFound: `event with: id=${eventId} not found or part of management events` });
        }
        const _event = event.Some;
        if (_event.eventEnd < ic.time()) return Err({ NotFound: `event with: id=${eventId} has ended` });
        const ticketclass = ticketClassStorage.get(ticketclassId);       
        if ("None" in ticketclass || _event.ticketClasses.findIndex((tid)=> tid.id === ticketclassId) < 0) {
            return Err({ NotFound: `ticketclass with: id=${ticketclassId} not found or part of management ticket classes` });
        }
        const _ticketclass = ticketclass.Some;
        const updateTicketClass = {..._ticketclass, ...payload, updatedAt: ic.time()}
        _event.ticketClasses[_event.ticketClasses.findIndex((tid)=> tid.id === ticketclassId)] = updateTicketClass;
        const eidx = updateeventMgm.events.findIndex((eid)=> eid.id === eventId);
        const tidx = updateeventMgm.events[eidx].ticketClasses.findIndex((tid)=> tid.id === ticketclassId);
        updateeventMgm.events[eidx].ticketClasses[tidx] = updateTicketClass; 
        ticketClassStorage.insert(_ticketclass.id, updateTicketClass);
        eventManagerStorage.insert(ic.caller(), updateeventMgm);
        eventStorage.insert(_event.id, _event);
        return Ok(updateTicketClass);
    }),

    // Delete a Ticket Class from an Event on the Canister 
    deleteTicketClass: update([text, text], Result(text, Message), (eventId: text, ticketclassId: text) => {
        // get Event Manager instance associated with the caller if any exist's, 
        // make assertions on the `eventId` and Event associated, the `ticketclassId` and ticket associated
        // and delete the ticket from the Event, Event Manager and storage.
        const eventMgm = eventManagerStorage.get(ic.caller());       
        if ("None" in eventMgm) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const updateeventMgm = eventMgm.Some;
        const event = eventStorage.get(eventId);       
        if ("None" in event || updateeventMgm.events.findIndex((eid)=> eid.id === eventId) < 0) {
            return Err({ NotFound: `event with: id=${eventId} not found or part of management's events` });
        }
        const _event = event.Some;
        if (_event.eventEnd > ic.time() && _event.tickets.findIndex((t)=> t.ticketClassId === ticketclassId ) >= 0) return Err({ NotFound: `event with: id=${eventId} has valid purchased ticket`});
        const ticketclass = ticketClassStorage.get(ticketclassId);       
        if ("None" in ticketclass || _event.ticketClasses.findIndex((tid)=> tid.id === ticketclassId) < 0) {
            return Err({ NotFound: `ticketclass with: id=${ticketclassId} not found or part of event management` });
        }
        let idx = _event.ticketClasses.findIndex((tid)=> tid.id === ticketclassId);
        let eidx = updateeventMgm.events.findIndex((eid)=> eid.id === eventId);
        let tidx = updateeventMgm.events[eidx].ticketClasses.findIndex((tid)=> tid.id === ticketclassId);
        deleteEntry(_event.ticketClasses, idx);
        deleteEntry(updateeventMgm.events[eidx].ticketClasses, tidx);
        eventStorage.insert(eventId, _event);
        ticketClassStorage.remove(ticketclassId);
        eventManagerStorage.insert(ic.caller(), updateeventMgm); 
        return Ok(ticketclass.Some.id);
    }),

    // Make Payments for Tickets Associated with Events on the Canister
    makePayment: update([text, text], Result(Payment, Message), (eventId: text, ticketclassId: text) => {
        // make assertions on the `eventId` and Event associated, the `ticketclassId` and ticket associated
        // create a payment instance with a pending status, place it in the pendingPayments storage,
        // and set a `discardByTimeout` to the payment to discard the proccess after a period of time.
        // completed or not.
        const eventOpt = eventStorage.get(eventId);
        if ("None" in eventOpt) {
            return Err({ NotFound: `cannot make payment for: event=${eventId} not found` });
        }
        const _event = eventOpt.Some;
        if (_event.eventEnd < ic.time() && _event.published) return Err({ NotFound: `event with: id=${eventId} has ended or not published`});
        const ticketclassOpt = ticketClassStorage.get(ticketclassId);
        if ("None" in ticketclassOpt || _event.ticketClasses.findIndex((tid)=> tid.id === ticketclassId) < 0) {
            return Err({ NotFound: `ticketclass with: ticketclass=${ticketclassId} not found or not part of event` });
        }
        const _ticketclass = ticketclassOpt.Some; 
        const payment = {
            eventId: _event.id,
            ticketClassId: _ticketclass.id,
            cost: _ticketclass.cost,
            status: { PaymentPending: "PAYMENT_PENDING" },
            eventManagerAddress: _event.manager,
            paid_at_block: None,
            memo: generateCorrelationId(eventId)
        };
        pendingPayments.insert(payment.memo, payment);
        discardByTimeout(payment.memo, PAYMENT_RESERVATION_PERIOD);
        return Ok(payment);
    }),

    // Get Ticket's associated with a pending payments to an Event Ticket.
    getTicket: update([Principal, nat64, nat64, nat64], Result(Ticket, Message), async (manager: Principal, price: nat64, 
        block: nat64, memo: nat64) => {
        // Make verifications on tickets payment with manager, price, block and memo as --args   
        const paymentVerified = await verifyPaymentInternal(manager, price, block, memo);
        if (!paymentVerified) {
            return Err({ NotFound: `payment for event with, memo=${memo} could not be verified` });
        }
        // Get pending payment from storage with memo if it exist's, update payment, get event and ticket class 
        // associted with payment if they exist, update event, create and add a new ticket into storage, complete payment status,
        // update the Event Manager, created a new Attendee instance for the caler if non exist and associate the ticket with the 
        // Attendee
        const pendingpaymentOpt = pendingPayments.get(memo);
        if ("None" in pendingpaymentOpt) {
            return Err({ NotFound: `could not complete transaction: there is no pending payment with id=${memo}` });
        }
        const payment = pendingpaymentOpt.Some;
        const updatedPayment = { ...payment, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };
        const eventOpt = eventStorage.get(payment.eventId);
        if ("None" in eventOpt) {
            return Err({ NotFound: `event with id=${payment.eventId} not found` });
        }
        const _event = eventOpt.Some;
        const _mgm = eventManagerStorage.get(manager);
        const ticketclass = ticketClassStorage.get(payment.ticketClassId);       
        if ("None" in ticketclass || _event.ticketClasses.findIndex((eid)=> eid.id === payment.ticketClassId) < 0) {
            return Err({ NotFound: `ticketClass for Event with: id=${payment.ticketClassId} not found` });
        }
        const _ticketclass = ticketclass.Some;  
        const newTicket = { id: uuidv4(), eventTitle: _event.title, description: _event.description, eventLocation: _event.eventLocation,
                    ticketClassTitle: _ticketclass.title, attendee: ic.caller(), eventId: _event.id, ticketClassId: _ticketclass.id, eventStart: _event.eventStart,
                    eventEnd: _event.eventEnd, cost: _ticketclass.cost, paid: true, createdAt: ic.time(), updatedAt: ic.time()};
        _event.tickets.push(newTicket);
        _mgm.Some.events[_mgm.Some.events.findIndex((eve)=> eve.id = _event.id)].tickets.push(newTicket);
        _mgm.Some.events[_mgm.Some.events.findIndex((eve)=> eve.id = _event.id)].soldOut += 1n;
        _event.soldOut += 1n;
        _event.updatedAt = ic.time();
        eventStorage.insert(_event.id, _event);
        ticketStorage.insert(newTicket.id, newTicket);
        completedPayments.insert(ic.caller(), updatedPayment);
        eventManagerStorage.insert(manager, _mgm.Some);
        pendingPayments.remove(memo);      
        const attendee = attendeeStorage.get(ic.caller()); 
        if ("None" in attendee) {
            const newAttendee = { id: uuidv4(), tickets: new Array(), createdAt: ic.time(), updatedAt: ic.time() };
            newAttendee.tickets.push(newTicket);
            attendeeStorage.insert(ic.caller(), newAttendee);
            return Ok(newTicket);
        }
        const _attendee = attendee.Some;
        _attendee.tickets.push(newTicket);
        _attendee.updatedAt = ic.time()
        attendeeStorage.insert(ic.caller(), _attendee);
        return Ok(newTicket);
    }),

    // Delete a ticket associated with an Attendee from The Canister
    deleteTicket: update([text], Result(text, Message), (ticketId: text) => {
        // get Attendee instance associated with the caller if any exist's, 
        // make assertions on the `ticketId` and Attendee's ticket's
        // and delete the ticket from the attendee's tickets and storage.
        const attendDee = attendeeStorage.get(ic.caller());       
        if ("None" in attendDee) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const attendDeeOpt = attendDee.Some;
        const ticketOpt = ticketStorage.get(ticketId);       
        if ("None" in ticketOpt || attendDeeOpt.tickets.findIndex((tid)=> tid.id === ticketId) < 0) {
            return Err({ NotFound: `ticket with: id=${ticketId} not found or part of attendee's tickets` });
        }    
        let idx = attendDeeOpt.tickets.findIndex((tid)=> tid.id === ticketId);
        deleteEntry(attendDeeOpt.tickets, idx);
        attendeeStorage.insert(ic.caller(), attendDeeOpt); 
        ticketStorage.remove(ticketId);
        return Ok(ticketId);
    }),

    /*
        another example of a canister-to-canister communication
        here we call the `query_blocks` function on the ledger canister
        to get a single block with the given number `start`.
        The `length` parameter is set to 1 to limit the return amount of blocks.
        In this function we verify all the details about the transaction to make sure that we can mark the order as completed
    */
    verifyPayment: query([Principal, nat64, nat64, nat64], bool, async (receiver: Principal, amount: nat64, block: nat64, memo: nat64) => {
        return await verifyPaymentInternal(receiver, amount, block, memo);
    }),

    /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
    getAddressFromPrincipal: query([Principal], text, (principal: Principal) => {
        return hexAddressFromPrincipal(principal, 0);
    }),

})

// a helper function to remove entries from array's taking the array and index to remove as --args
function deleteEntry(elements: [], idx: nat8) {
    for(let i = idx; i < elements.length; i++){
        if(i+1 == elements.length) break;
        elements[i] = elements[i+1]
    }
    elements.pop()
};

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the user has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};

// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};

function generateCorrelationId(productId: text): nat64 {
    const correlationId = `${productId}_${ic.caller().toText()}_${ic.time()}`;
    return hash(correlationId);
};

/*
    after the order is created, we give the `delay` amount of minutes to pay for the order.
    if it's not paid during this timeframe, the order is automatically removed from the pending orders.
*/
function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const order = pendingPayments.remove(memo);
        console.log(`Order discarded ${order}`);
    });
};

async function verifyPaymentInternal(receiver: Principal, amount: nat64, block: nat64, memo: nat64): Promise<bool> {
    const blockData = await ic.call(icpCanister.query_blocks, { args: [{ start: block, length: 1n }] });
    const tx = blockData.blocks.find((block) => {
        if ("None" in block.transaction.operation) {
            return false;
        }
        const operation = block.transaction.operation.Some;
        const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
        const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
        return block.transaction.memo === memo &&
            hash(senderAddress) === hash(operation.Transfer?.from) &&
            hash(receiverAddress) === hash(operation.Transfer?.to) &&
            amount === operation.Transfer?.amount.e8s;
    });
    return tx ? true : false;
};