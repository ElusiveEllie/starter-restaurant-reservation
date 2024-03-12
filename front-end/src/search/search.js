import { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import searchForReservation from "./searchForReservation";
import { useHistory } from "react-router-dom";
import DisplayReservation from "../dashboard/DisplayReservation";

function SearchReservation() {
  const history = useHistory();
  const [formData, setformData] = useState({ mobile_number: "" });
  const handleChange = ({ target }) => {
    setformData({
      ...formData,
      [target.name]: target.value,
    });
  };
  const [reservations, setReservations] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await searchForReservation(formData, setReservationsError, setReservations);
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <div className="row">
        <label htmlFor="mobile_number" className="col">
          <input
            type="text"
            id="mobile_number"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            value={formData.mobile_number}
            className="form-control"
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </div>
      <div className="row">
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
            </tr>
          </thead>
          <tbody>
            <DisplayReservation
              reservations={reservations ? reservations : []}
              history={history}
            />
          </tbody>
        </table>
        {(Array.isArray(reservations) && reservations.length === 0) ? <div className="alert alert-danger m-2">No reservations found.</div> : null}
        <ErrorAlert error={reservationsError} />
      </div>
    </form>
  );
}

export default SearchReservation;
