import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import setReservationSeat from "./SetReservationSeat";
import { listSingleReservation, listTables } from "../utils/api";
import DisplaySeatingOptions from "./DisplaySeatingOptions";

function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [formData, setformData] = useState({});
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const handleChange = ({ target }) => {
    setformData({
      ...formData,
      [target.name]: target.value,
    });
  };
  const [seatingError, setSeatingError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setReservationSeat(formData, setSeatingError, history);
  };

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
