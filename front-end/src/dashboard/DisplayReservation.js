function DisplayReservation(reservations) {
  const reservationsTable = reservations.map((reservation, index) => {
    return (
      <tr key={index}>
        <th scope="row">{reservation.reservation_time}</th>
        <td>{reservation.reservation_id}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.first_name}</td>
        <td>{reservation.people}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
      </tr>
    )
  })
  return reservationsTable;
}

export default DisplayReservation;