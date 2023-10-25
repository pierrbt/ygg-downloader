import React from "react";
import { useEffect, useState } from "react";
import { IconTrashX } from "@tabler/icons-react";
import { isEqual } from "lodash";

export default function Requests() {
  const [requests, setRequests] = useState<[]>([]);
  useEffect(() => {
    fetch("/api/manual")
      .then((res) => res.json())
      .then((data) => {
        if (!isEqual(data.results, requests)) setRequests(data.results);
      });
  });
  return (
    <main style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 10%" }}>
      <h1>Requests</h1>
      <ul>
        {requests.map((request) => (
          <li style={{ display: "flex", listStyle: "initial" }}>
            <p>{request}</p>
            <p
              onClick={() => {
                fetch(`/api/manual/${request}`, {
                  method: "DELETE",
                }).then(() => {
                  setRequests([]);
                });
              }}
            >
              &nbsp;
              <IconTrashX />
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
