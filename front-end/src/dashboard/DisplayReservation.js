import { putSeatingStatus } from "../utils/api";

async function cancelReservation(reservation_id) {
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
    return () => abortController.abort();
  }
}

function DisplayReservation(props) {
  const { reservations, history } = props;
  const reservationsTable = reservations.map((reservation, index) => {
    if (
      reservation.status !== "finished" &&
      reservation.status !== "cancelled"
    ) {
      return (
        <tr key={index}>
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
                  await cancelReservation(reservation.reservation_id);
                  history.goBack();
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
