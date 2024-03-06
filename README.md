# Events and Ticket Managment
- Events and ticket managment is a platform with a canister written in TypeScript, libraries from the Azle framework CDK (Canister Development Kit) and a boundled react.js front-end. Having implemented functionalities and modules that interact with coresponding front-end and canister utilities to manage events and tickets purchase. Idealy developed to run on the ICP (Internet Computer Protocol).   


## Instructions on Deploying and Testing Canisters

- Deploy and test on GitHub Codespaces (recommended)

[![Test On GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/lukrycyfa/events-and-ticket-managment?quickstart=1)


- To deploy and test locally, you will be needing the following technologies:
- install [Docker](https://www.docker.com/get-started/) 
- [VS Code](https://code.visualstudio.com/) 
	
- On your Local Host and follow the link provided below

[![Test locally in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/lukrycyfa/events-and-ticket-managment)

**NOTE**: You will need to wait for the container to install all dependencies and start `dfx`,


### Deploying Canisters

- Deploy the ledger canister, an icp test token canister for dev environments. 
```bash
bash deploy-local-ledger.sh
```

- Deploy the internet identity, a canister for authenticating and assigning identities to user's in a dev environment accessing the caniters front-end 
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

**NOTE**: After deploying all canisters, run `./canister_urls.py` and follow the links provided.

### Testing the Event Manager via the Front-end

- Follow the link to the front-end provided from running the previous command, click on the connect button you will be redirected to the `internet identity` canister, create a new identity following the provided instructions.

- After creating an identity you will be redirected to the event manager where you would see a button `managed events`, click on the button to open a the modal, below the modal is the `add event` component used to create events, create an event. On the newly craated event before the footer will be buttons to manage the event, create a new `ticket class` for the event and `publish` the event. Close the modal and logout with the logout button provided on the drop down from the balance icon.

- Now connect again but create a new identity to simulate an event attendee. After beign redirected to the event manager copy the currnet Principal from the drop down of the balance icon.

- Now go back to the terminal and run the following command's to get an account-id and mint icp's to th attendees account.

```bash
dfx ledger account-id --of-principal <COPIED PRINCIPAL>
```

- The above command returns the account-id to the provided principle, copy that down it will be needed for the icp minting.

- Mint ICP's to the returned Account-id

```bash
dfx ledger --network local transfer --amount 100 --fee 0 --memo nat64 <ACCOUNT-ID>
```

- Return to the app refresh the page to update the balance. There should be an available published event in the events list, on the event there will be a button `Purchase Event Tickets` to pop open a modal with available ticket, purchase one. After purcahse the ticket would be available in your `My Tickets` modal. 


### Test Canister via DFX

- Create a new identity for a Manger
```bash
$ dfx identity new [OPTIONS] <IDENTITY>
```
- Select the identity
```bash
$ dfx identity use [OPTIONS] <IDENTITY>
```

- Add an event
```bash
$ dfx canister call event-manager_js_backend addEvent '( record { 'title'= "event title"; 'description' = "event description"; 'eventLocation' = "event location"; 'bannerUrl' = "banner url"; 'eventStart' = 'date-timestamp-microseconds'; 'eventEnd' = 'date-timestamp-microseconds'; })'
``` 

- Update an event
```bash
$ dfx canister call event-manager_js_backend updateEvent '( record { 'title'= "event title"; 'description' = "event description"; 'eventLocation' = "event location"; 'bannerUrl' = "banner url"; 'eventStart' = 'date-timestamp-microseconds'; 'eventEnd' = 'date-timestamp-microseconds'; }, 'eventId' )'
``` 

- Get Managed Events
```bash
$ dfx canister call event-manager_js_backend getEventsByManagment '()'
``` 
- Add a Ticket Class
```bash
$ dfx canister call event-manager_js_backend addTicketClass '( record { 'title'= "ticketclass title"; 'cost' = "nat64"; 'badgeUrl' = "badge url"; }, 'eventId' )'
``` 

- Update a Ticket Class
```bash
$ dfx canister call event-manager_js_backend updateTicketClass '( record { 'title'= "ticketclass title"; 'cost' = "nat64"; 'badgeUrl' = "badge url"; }, 'eventId', ticketclassId)'
```
- Publish an Event
```bash
$ dfx canister call event-manager_js_backend publishEvent '('eventId')'
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

- Now switch to the minters identity with the command below and mint icp's to the attendee
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
- First get the Managers account-id for icp transfer.
```bash
dfx ledger account-id --of-principal <MANAGERS PRINCIPAL>
```

- Get All Events
```bash
$ dfx canister call event-manager_js_backend getAllEvents '()'
```
- Transfer Ticket cost to the Event Manager
```bash
dfx ledger --network local transfer --amount <cost/10**8: nat64> --fee 0 --memo nat64 <EVENT MANAGER ACCOUNT-ID>
```
- the above command will return a block number, you will be needing that to get the purchased ticket

- Buy A ticket
```bash
$ dfx canister call event-manager_js_backend makePayment '('eventId', 'ticketclassId')'
``` 
- Returns a payment information you will be needing the memo in the information for the next call. the `PAYMENT_RESERVATION_PERIOD` is 3 mins enough to complete the transaction.

- Complete Payment And get Ticket with aquired information.

- Get the managers Principal
```bash
dfx identity get-principal --identity <MANAGERS IDENTITY>
```
```bash
$ dfx canister call event-manager_js_backend getTicket '('Managers Principal', 'Ticket Cost <cost: nat64>', 'Payment Block Number', 'memo')'
```

- Delete an Event, should be called by the Event creator
```bash
$ dfx canister call event-manager_js_backend deleteEvent '("eventId")'
```

- Delete an TicketClass, should be called by the TicketClass creator
```bash
$ dfx canister call event-manager_js_backend deleteTicketClass '("eventId", "ticketclassId")'
```

- Delete an Ticket, should be called by the owner of the Ticket
```bash
$ dfx canister call event-manager_js_backend deleteTicket '("ticketId")'
```