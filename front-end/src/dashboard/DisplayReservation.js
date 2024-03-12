function DisplayReservation(props) {
  const { reservations, history } = props;
  const reservationsTable = reservations.map((reservation, index) => {
    if (reservation.status !== "finished") {
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
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button
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
        </tr>
      );
    }
    return null;
  });
  return reservationsTable;
}

export default DisplayReservation;
