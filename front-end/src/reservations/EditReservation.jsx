import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import initialFormState from "./initialFormState";
import putReservation from "./putReservation";
import { listSingleReservation } from "../utils/api";

/**
 * Displays a form for editing a reservation.
 * @returns {JSX.Element} - The JSX element representing the reservation editing form.
 */

function EditReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();

  // State for form data and error handling
  const [formData, setformData] = useState({ ...initialFormState });
  const [reservationsError, setReservationsError] = useState(null);

  // Function to handle form input changes
  const handleChange = ({ target }) => {
    setformData({
      ...formData,
      [target.name]: target.value,
    });
  };

  // Effect to load reservation data on page load
  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setReservationsError(null);
    listSingleReservation(reservation_id, abortController.signal)
      .then(setformData)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    putReservation(formData, setReservationsError, history);
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <div className="row">
        <label htmlFor="first_name" className="col">
          First name:
          <input
            type="text"
            id="first_name"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            className="form-control"
          />
        </label>
        <label htmlFor="last_name" className="col">
          Last name:
          <input
            type="text"
            id="last_name"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            className="form-control"
          />
        </label>
      </div>
      <div className="row">
        <label htmlFor="reservation_date" className="col">
          Date:
          <input
            type="date"
            id="reservation_date"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            className="form-control"
          />
        </label>
        <label htmlFor="reservation_time" className="col">
          Time:
          <input
            type="time"
            id="reservation_time"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            className="form-control"
          />
        </label>
      </div>
      <div className="row">
        <label htmlFor="people" className="col">
          Number of people:
          <input
            type="number"
            id="people"
            name="people"
            min="1"
            onChange={handleChange}
            value={formData.people}
            className="form-control"
          />
        </label>
        <label htmlFor="mobile_number" className="col">
          Mobile number:
          <input
            type="text"
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            className="form-control"
          />
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <button
        type="button"
        onClick={() => history.goBack()}
        className="btn btn-danger"
      >
        Cancel
      </button>
      <div className="row">
        <ErrorAlert error={reservationsError} />
      </div>
    </form>
  );
}

export default EditReservation;
