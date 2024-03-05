import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as eventManagmentIDL } from "../../../declarations/event_manager_js_backend/event_manager_js_backend.did.js";
import { idlFactory as ledgerIDL } from "../../../declarations/ledger_canister/ledger_canister.did.js";

const EVENTMENAGMENT_CANISTER_ID = "be2us-64aaa-aaaaa-qaabq-cai";
const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
const HOST = window.location.origin;

// get event managment canister
export async function getEventmanagementCanister() {
    return await getCanister(EVENTMENAGMENT_CANISTER_ID, eventManagmentIDL);
}

// get ledger canister
export async function getLedgerCanister() {
    return getCanister(LEDGER_CANISTER_ID, ledgerIDL);
}

// helper function to create canister instance from candid and auth.
async function getCanister(canisterId, idl) {
    const authClient = window.auth.client;
    const agent = new HttpAgent({
        host: HOST,
        identity: authClient.getIdentity()
    });
    await agent.fetchRootKey(); // this line is needed for the local env only
    return Actor.createActor(idl, {
        agent,
        canisterId,
    });
}
