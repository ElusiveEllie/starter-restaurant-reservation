import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import setReservationSeat from "./SetReservationSeat";
import { listSingleReservation, listTables } from "../utils/api";
import DisplaySeatingOptions from "./DisplaySeatingOptions";

/**
 * Displays a form for seating a reservation at a table.
 * @returns {JSX.Element} - The JSX element representing the reservation seating form.
 */

function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  // State for form data, tables, reservation, and error handling
  const [formData, setformData] = useState({});
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [seatingError, setSeatingError] = useState(null);

  // Function to handle form input changes
  const handleChange = ({ target }) => {
    setformData({
      ...formData,
      [target.name]: target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setReservationSeat(formData, setSeatingError, history);
  };

  // Effect to load tables and reservation data on page load
  useEffect(() => {
    loadTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables);
    listSingleReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .then(
        setformData({
          ...formData,
          reservation_id: reservation_id,
        })
      );
    return () => abortController.abort();
  }

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <div className="row">
        <label htmlFor="table_id" className="col">
          Seating Assignment:
          <div>
            <select
              id="table_id"
              name="table_id"
              onChange={handleChange}
              value={formData.table_id}
              defaultValue=""
              required
            >
              <option disabled value="">
                -- Select an Option --
              </option>
              {DisplaySeatingOptions(tables, reservation.people)}
            </select>
          </div>
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
        <ErrorAlert error={seatingError} />
      </div>
    </form>
  );
}

export default SeatReservation;
