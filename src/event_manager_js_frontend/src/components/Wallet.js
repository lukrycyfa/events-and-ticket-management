import React from "react";
import { Dropdown, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { NotificationSuccess, NotificationError } from "./utils/Notifications";

const Wallet = ({ principal, balance, symbol, isAuthenticated, destroy }) => {

  const copyAddress = async () => {
    
    try {
      await navigator.clipboard.writeText(principal);
      console.log('Address copied to clipboard');
      toast(<NotificationSuccess text="Address copied to clipboard." />);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast(<NotificationError text={`Failed to copy: ,${err}`} />);
    }
  }
  if (isAuthenticated) {
    return (
      <>
        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            align="end"
            id="dropdown-basic"
            className="d-flex align-items-center border rounded-pill py-1"
          >
            {balance} <span className="ms-1"> {symbol}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="shadow-lg border-0  position-relative">
            <Dropdown.Item
              as="button"
              className="d-flex align-items-center"
              onClick={() => {
                copyAddress();
              }}
              data-bs-toggle="tooltip" data-bs-placement="top" title="Copy Address"
            >
              <Stack direction="horizontal"  gap={1}>
                <i className="bi bi-person-circle fs-4" />  
                <span className="font-monospace">{principal.toString().slice(0, 10)}...
                <i className="bi bi-clipboard-fill fs-4">!</i></span>
                
                </Stack>
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              as="button"
              className="d-flex align-items-center"
              onClick={() => {
                destroy();
              }}
            >
              <i className="bi bi-box-arrow-right me-2 fs-4" />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }

  return null;
};

export default Wallet;
