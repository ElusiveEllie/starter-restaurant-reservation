import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DisplayReservation from "./DisplayReservation";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import DisplayTable from "./DisplayTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const query = useQuery();
  const dateParam = query.get("date");
  if (dateParam) date = dateParam;
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  function changeDate(direction) {
    const newDate = new Date(date);
    if (direction === "back") {
      newDate.setUTCDate(newDate.getUTCDate() - 1);
      date = newDate.toISOString().slice(0, 10);
      history.push(`/dashboard?date=${date}`);
    } else if (direction === "today") {
      date = today();
      history.push(`/dashboard?date=${date}`);
    } else if (direction === "forward") {
      newDate.setUTCDate(newDate.getUTCDate() + 1);
      date = newDate.toISOString().slice(0, 10);
      history.push(`/dashboard?date=${date}`);
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <button className="btn btn-secondary" onClick={() => changeDate("back")}>
        Previous
      </button>
      <button className="btn btn-primary" onClick={() => changeDate("today")}>
        Today
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => changeDate("forward")}
      >
        Next
      </button>
      <ErrorAlert error={reservationsError} />
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Time</th>
            <th scope="col">ID</th>
            <th scope="col">Last Name</th>
            <th scope="col">First Name</th>
            <th scope="col"># Guests</th>
            <th scope="col">Contact Number</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <DisplayReservation reservations={reservations} history={history} loadDashboard={loadDashboard} />
        </tbody>
      </table>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Table Name</th>
            <th scope="col">Table Capacity</th>
            <th scope="col">Occupied</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <DisplayTable loadDashboard={loadDashboard} tables={tables} />
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
