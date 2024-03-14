import { putSeatingStatus } from "../utils/api";

/**
 * Cancels a reservation.
 * @param {string} reservation_id - The ID of the reservation to cancel.
 * @param {object} history - The history object to navigate after cancellation.
 * @returns {Function} - A cleanup function to abort any pending requests.
 */

async function cancelReservation(reservation_id, history) {
  // Confirm with the user before canceling the reservation
  if (
    window.confirm(
      `Do you want to cancel this reservation? This cannot be undone.`
    )
  ) {
    const abortController = new AbortController();
    await putSeatingStatus(
      { reservation_id, status: "cancelled" },
      abortController.signal
    );
    history.go(0);
    return () => abortController.abort();
  }
}

/**
 * Displays reservations in a table format.
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.reservations - An array of reservations to be displayed.
 * @param {Object} props.history - The history object from React Router for navigation.
 * @returns {JSX.Element} - The JSX element representing the reservations table.
 */

function DisplayReservation(props) {
  const { reservations, history } = props;

  // Mapping reservations to table rows
  const reservationsTable = reservations.map((reservation, index) => {
    if (
      reservation.status !== "finished" &&
      reservation.status !== "cancelled"
    ) {
      return (
        // Table row representing a single reservation
        <tr key={reservation.reservation_id}>
          <th scope="row">{reservation.reservation_time}</th>
          <td>{reservation.reservation_id}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.first_name}</td>
          <td>{reservation.people}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </td>
          {reservation.status === "booked" ? (
            <td>
              <a href={`/reservations/${reservation.reservation_id}/edit`}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    history.push(
                      `/reservations/${reservation.reservation_id}/edit`
                    )
                  }
                >
                  Edit
                </button>
              </a>
            </td>
          ) : null}
          {reservation.status === "booked" ? (
            <td>
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    history.push(
                      `/reservations/${reservation.reservation_id}/seat`
                    )
                  }
                >
                  Seat
                </button>
              </a>
            </td>
          ) : null}
          {reservation.status === "booked" ? (
            <td>
              <button
                type="button"
                className="btn btn-danger"
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={async () => {
                  await cancelReservation(reservation.reservation_id, history);
                }}
              >
                Cancel
              </button>
            </td>
          ) : null}
        </tr>
      );
    }
    return null;
  });
  return reservationsTable;
}

export default DisplayReservation;
