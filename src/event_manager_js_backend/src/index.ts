//canister code goes here
import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister, nat8 } from "azle";
import {
    Ledger, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";



const TicketClass = Record({
    id: text,
    title: text,
    badgeUrl: text,
    cost: nat64, 
    createdAt: nat64,
    updatedAt: nat64
})

const Ticket = Record({
    id: text,
    title: text,
    description: text,
    eventLocation: text,
    ticketClassTitle: text,
    attendee: Principal,
    eventId: text,
    ticketClassId: text,
    cost: nat64,
    paid: bool,
    createdAt: nat64,
    updatedAt: nat64   
});

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
    createdAt: nat64,
    updatedAt: nat64 
});

const EventManager = Record({
    id: text,
    manager: Principal,
    events: Vec(Event),
    createdAt: nat64,
    updatedAt: nat64, 
});

const AttendeeTickets = Record({
    id: text,
    tickets: Vec(Ticket),
    createdAt: nat64,
    updatedAt: nat64, 
});


const TicketClassPayload = Record({
    title: text,
    cost: nat64,
    badgeUrl: text
})


const EventPayload = Record({
    title: text,
    description: text,
    eventLocation: text,
    bannerUrl: text,
    eventStart: nat64,
    eventEnd: nat64
});


const PaymentStatus = Variant({
    PaymentPending: text,
    Completed: text
});

const Payment = Record({
    eventId: text,
    ticketClassId: text,
    cost: nat64,
    status: PaymentStatus,
    eventManagerAddress: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text,
    ApprovedAdvert: text
});


const eventManagerStorage = StableBTreeMap(0, Principal, EventManager);
const attendeeStorage = StableBTreeMap(1, Principal, AttendeeTickets);
const eventStorage = StableBTreeMap(2, text, Event);
const ticketStorage = StableBTreeMap(3, text, Ticket);
const ticketClassStorage = StableBTreeMap(4, text, TicketClass);
const completedPayments = StableBTreeMap(5, Principal, Payment);
const pendingPayments = StableBTreeMap(6, nat64, Payment);

const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

const PAYMENT_RESERVATION_PERIOD = 120n; // reservation period in seconds


export default Canister({
    getAllEvents: query([], Vec(Event), () => {
        var events = eventStorage.values();
        for (let i = 0; i < events.length; i++){
            events[i].tickets = [];
        }
        return events;
    }),

    getEventsByManagment: query([], Result(EventManager, Message), () => {
        const eventmanagerOpt = eventManagerStorage.get(ic.caller());

        if ("None" in eventmanagerOpt) {
            return Err({ NotFound: `eventmanger with id=${ic.caller()} not found` });
        }
        
        const eventmanager = eventmanagerOpt.Some;
        return Ok(eventmanager);
    }),

    getAttendeeTickets: query([], Result(AttendeeTickets, Message), () => {
        const attendeeOpt = attendeeStorage.get(ic.caller());
        if ("None" in attendeeOpt) {
            return Err({ NotFound: `attendee with id=${ic.caller()} not found` });
        }
        return Ok(attendeeOpt.Some);
    }),

    addEvent: update([EventPayload], Result(Event, Message), (payload: EventPayload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0
        || payload.title.length <= 0 || payload.description.length <= 0 || payload.eventLocation.length <= 0 || payload.bannerUrl.length <= 0 || payload.eventStart < ic.time() || payload.eventEnd <= payload.eventStart)  {
            
            return Err({ NotFound: "invalid payload" })
        }
        const eventMgm = eventManagerStorage.get(ic.caller()); 
        const newEvent = { id: uuidv4(), manager: ic.caller(), tickets: new Array(), ticketClasses: new Array(), soldOut: 0n, ...payload, createdAt: ic.time(), updatedAt: ic.time()};     
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

    updateEvent: update([EventPayload, text], Result(Event, Message), (payload: EventPayload, eventId: text) => {
          if (typeof payload !== "object" || Object.keys(payload).length === 0 ||
        payload.title.length <= 0 || payload.description.length <= 0 || payload.eventLocation.length <= 0 || payload.bannerUrl.length <= 0 || payload.eventStart < ic.time() || payload.eventEnd <= payload.eventStart) {
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
        const updateEvent = {..._event, ...payload, updatedAt: ic.time()};
        updateeventMgm.events[updateeventMgm.events.findIndex((eid)=> eid.id === eventId)] = updateEvent;
        eventStorage.insert(_event.id, updateEvent);
        eventManagerStorage.insert(ic.caller(), updateeventMgm);

        return Ok(updateEvent);
    }),

    deleteEvent: update([text], Result(text, Message), (eventId: text) => {
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


    addTicketClass: update([TicketClassPayload, text], Result(TicketClass, Message), (payload: TicketClassPayload, eventId: text) => {
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

    updateTicketClass: update([TicketClassPayload, text, text], Result(TicketClass, Message), (payload: TicketClassPayload, eventId: text, ticketclassId: text) => {
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

    deleteTicketClass: update([text, text], Result(text, Message), (eventId: text, ticketclassId: text) => {
        const eventMgm = eventManagerStorage.get(ic.caller());       
        if ("None" in eventMgm) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const updateeventMgm = eventMgm.Some;
        const event = eventStorage.get(eventId);       
        if ("None" in event || updateeventMgm.events.findIndex((eid)=> eid.id === eventId) < 0) {
            return Err({ NotFound: `event with: id=${eventId} not found or in event management` });
        }
        const _event = event.Some;
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

 
    makePayment: update([text, text], Result(Payment, Message), (eventId: text, ticketclassId: text) => {
        const eventOpt = eventStorage.get(eventId);
        if ("None" in eventOpt) {
            return Err({ NotFound: `cannot make payment for: event=${eventId} not found` });
        }
        const _event = eventOpt.Some;
        if (_event.eventEnd < ic.time()) return Err({ NotFound: `event with: id=${eventId} has ended` });
        const ticketclassOpt = ticketClassStorage.get(ticketclassId);
        if ("None" in ticketclassOpt || _event.ticketClasses.findIndex((tid)=> tid.id === _ticketclass.id) < 0) {
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


    getTicket: update([Principal, nat64, nat64, nat64], Result(Ticket, Message), async (manager: Principal, price: nat64, 
        block: nat64, memo: nat64) => {
        const paymentVerified = await verifyPaymentInternal(manager, price, block, memo);
        if (!paymentVerified) {
            return Err({ NotFound: `payment for event with, memo=${memo} could not be verified` });
        }
        const pendingpaymentOpt = pendingPayments.remove(memo);
        if ("None" in pendingpaymentOpt) {
            return Err({ NotFound: `could not complete transaction: there is no pending payment with id=${memo}` });
        }
        const payment = pendingpaymentOpt.Some;
        const updatedPayment = { ...payment, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };
        const eventOpt = eventStorage.get(payment.eventId);
        if ("None" in eventOpt) {
            throw Error(`event with id=${payment.eventId} not found`);
        }
        const _event = eventOpt.Some;
        const _mgm = eventManagerStorage.get(_event.manger);
        const ticketclass = ticketClassStorage.get(payment.ticketClassId);       
        if ("None" in ticketclass || _event.ticketClasses.findIndex((eid)=> eid.id === payment.ticketClassId) < 0) {
            return Err({ NotFound: `ticketClass for Event with: id=${payment.ticketClassId} not found` });
        }
        const _ticketclass = ticketclass.Some;
        const newTicket = { id: uuidv4(), title: _event.title, description: _event.description, eventLocation: _event.eventLocation,
                    ticketClassTitle: _ticketclass.title, attendee: ic.caller(), eventId: _event.id, ticketClassId: _ticketclass.id, 
                    cost: _ticketclass.cost, paid: true, createdAt: ic.time(), updatedAt: ic.time()};
        _event.tickets.push(newTicket);
        _mgm.Some.events[_mgm.Some.events.findIndex((eve)=> eve.id = _event.id)].tickets.push(newTicket);
        _event.soldOut += 1n;
        _event.updatedAt = ic.time();
        eventStorage.insert(_event.id, _event);
        ticketStorage.insert(newTicket.id, newTicket);
        completedPayments.insert(ic.caller(), updatedPayment);
        eventManagerStorage.insert(_event.manger, _mgm);      
        const attendee = attendeeStorage.get(ic.caller()); 
        if ("None" in attendee) {
            const newAttendee = { id: uuidv4(), tickets: new Array(), createdAt: ic.time(), updatedAt: ic.time() };
            newAttendee.tickets.push(newTicket);
            attendeeStorage.insert(newAttendee.id, newAttendee);
            return Ok(newTicket);
        }
        const _attendee = attendee.Some;
        _attendee.tickets.push(newTicket);
        _attendee.updatedAt = ic.time()
        attendeeStorage.insert(_attendee.id, _attendee);
        return Ok(newTicket);
    }),

    deleteTicket: update([text], Result(text, Message), (ticketId: text) => {
        const attendDee = attendeeStorage.get(ic.caller());       
        if ("None" in attendDee) {
            return Err({ NotFound: `event manager with: address=${ic.caller()} not found` });
        }
        const attendDeeOpt = attendDee.Some;
        const ticketOpt = ticketStorage.get(ticketId);       
        if ("None" in ticketOpt || attendDeeOpt.tickets.findIndex((tid: Ticket)=> tid.id === ticketId) < 0) {
            return Err({ NotFound: `ticket with: id=${ticketId} not found or part of attendee's tickets` });
        }    
        let idx = attendDeeOpt.tickets.findIndex((tid: Ticket)=> tid.id === ticketId);
        deleteEntry(attendDeeOpt.tickets, idx);
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

function deleteEntry(elements: [], idx: nat8) {
    for(let i = idx; i < elements.length; i++){
        if(i+1 == elements.length) break;
        elements[i] = elements[i+1]
    }
    elements.pop()
};

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
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