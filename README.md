# Events and Ticket Management
- Events and ticket management is a platform with a canister written in TypeScript, libraries from the Azle framework CDK (Canister Development Kit), and a bundled react.js front-end. Having implemented functionalities and modules that interact with corresponding front-end and canister utilities to manage events and ticket purchases. Ideally developed to run on the ICP (Internet Computer Protocol).  


## Instructions on Deploying and Testing Canisters

- Deploy and test on GitHub Codespaces (recommended)

[![Test On GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/lukrycyfa/events-and-ticket-managment?quickstart=1)


- To deploy and test locally, you will need the following technologies:
- install [Docker](https://www.docker.com/get-started/) 
- [VS Code](https://code.visualstudio.com/) 
	
- On your Local Host and follow the link provided below

[![Test locally in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/lukrycyfa/events-and-ticket-management)

**NOTE**: You will need to wait for the container to install all dependencies and start `dfx`,


### Deploying Canisters

- Deploy the ledger canister, an icp test token canister for dev environments. 
```bash
bash deploy-local-ledger.sh
```

- Deploy the internet identity, a canister for authenticating and assigning identities to users in a dev environment accessing the canister front-end 
```bash
bash dfx deploy internet_identity
```

- Deploy the Event manager front and back ends, i.e the canister for creating and maintainig events and tickets.
```bash
bash dfx deploy event_manager_js_backend
```

```bash
bash dfx generate event_manager_js_backend
```

```bash
bash dfx deploy event_manager_js_frontend
```

**NOTE**: After deploying all canisters, run `python3 canister_urls.py` and follow the links provided.

### Testing the Event Manager via the Front-end

- Follow the link to the front-end provided from running the previous command, click on the connect button you will be redirected to the `internet identity` canister, create a new identity following the provided instructions.

- After creating an identity you will be redirected to the event manager where you will see a button `managed events`, click on the button to open the modal, below the modal is the `add event` component used to create events, and create an event. On the newly created event before the footer will be buttons to manage the event, create a new `ticket class` for the event, and `publish` the event. Close the modal and log out with the logout button provided on the drop-down from the balance icon.

- Now connect again but create a new identity to simulate an event attendee. After being redirected to the event manager copy the current Principal from the drop-down of the balance icon.

- Now go back to the terminal and run the following commands to get an account-id and mints ICP's to the attendee's account.

```bash
dfx ledger account-id --of-principal <COPIED PRINCIPAL>
```

- The above command returns the account-id to the provided principle, copy that down it will be needed for the icp minting.

- Mint ICPs to the returned Account-id

```bash
dfx ledger --network local transfer --amount 100 --fee 0 --memo nat64 <ACCOUNT-ID>
```

- Return to the app and refresh the page to update the balance. There should be an available published event in the events list, on the event there will be a button `Purchase Event Tickets` to pop open a modal with available tickets and purchase one. After purchase the ticket will be available in your `My Tickets` modal. 


### Test Canister via DFX

- Create a new identity for a manager
```bash
$ dfx identity new [OPTIONS] <IDENTITY>
```
- Select the identity
```bash
$ dfx identity use [OPTIONS] <IDENTITY>
```

- Add an event
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai addEvent '( record { 'title'= "event title"; 'description' = "event description"; 'eventLocation' = "event location"; 'bannerUrl' = "banner url"; 'eventStart' = 'date-timestamp-microseconds'; 'eventEnd' = 'date-timestamp-microseconds'; })'
``` 

- Update an event
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai updateEvent '( record { 'title'= "event title"; 'description' = "event description"; 'eventLocation' = "event location"; 'bannerUrl' = "banner url"; 'eventStart' = 'date-timestamp-microseconds'; 'eventEnd' = 'date-timestamp-microseconds'; }, 'eventId' )'
``` 

- Get Managed Events
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai getEventsByManagment '()'
``` 
- Add a Ticket Class
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai addTicketClass '( record { 'title'= "ticketclass title"; 'cost' = "nat64"; 'badgeUrl' = "badge url"; }, 'eventId' )'
``` 

- Update a Ticket Class
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai updateTicketClass '( record { 'title'= "ticketclass title"; 'cost' = "nat64"; 'badgeUrl' = "badge url"; }, 'eventId', ticketclassId)'
```
- Publish an Event
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai publishEvent '('eventId')'
``` 

- Create a new identity for an Attendee
```bash
$ dfx identity new [OPTIONS] <IDENTITY>
```
- Select the identity
```bash
$ dfx identity use [OPTIONS] <IDENTITY>
```
- Get newly created identity Principal
```bash
dfx identity get-principal --identity <IDENTITY>
```
- Get Account-ID to Principal
```bash
dfx ledger account-id --of-principal <PRINCIPAL>
```

- Now switch to the minter's identity with the command below and mint icp's to the attendee
```bash
$ dfx identity use minter
```
```bash
dfx ledger --network local transfer --amount 100 --fee 0 --memo nat64 <ATTENDEE ACCOUNT-ID>
```

- Now switch to the attendee's identity with the command below to purchase a ticket
```bash
$ dfx identity use <ATTENDEE IDENTITY>
```
- First, get the Manager account-id for ICP transfer.
```bash
dfx ledger account-id --of-principal <MANAGERS PRINCIPAL>
```

- Get All Events
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai getAllEvents '()'
```
- Transfer Ticket cost to the Event Manager
```bash
dfx ledger --network local transfer --amount <cost/10**8: nat64> --fee 0 --memo nat64 <EVENT MANAGER ACCOUNT-ID>
```
- the above command will return a block number, you will need that to get the purchased ticket

- Buy A ticket
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai makePayment '('eventId', 'ticketclassId')'
``` 
- Returns a payment object you will need the memo in the object for the next call. the `PAYMENT_RESERVATION_PERIOD` is 3 mins enough to complete the transaction.

- Complete Payment And get a Ticket with acquired information.

- Get the manager's Principal
```bash
dfx identity get-principal --identity <MANAGERS IDENTITY>
```
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai getTicket '('Managers Principal', 'Ticket Cost <cost: nat64>', 'Payment Block Number', 'memo')'
```

- Delete an Event, should be called by the Event creator
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai deleteEvent '("eventId")'
```

- Delete a TicketClass, which should be called by the TicketClass creator
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai deleteTicketClass '("eventId", "ticketclassId")'
```

- Delete a Ticket, should be called by the owner of the Ticket
```bash
$ dfx canister call be2us-64aaa-aaaaa-qaabq-cai deleteTicket '("ticketId")'
```