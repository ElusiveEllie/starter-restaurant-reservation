import { putSeatingAssignment } from "../utils/api";

function setReservationSeat(formData, setSeatingError, history) {
  const abortController = new AbortController();
  setSeatingError(null);
  formData.status = "seated";
  putSeatingAssignment(formData, abortController.signal)
    .then(() => history.push(`/dashboard`))
    .catch(setSeatingError);
  return () => abortController.abort();
}

export default setReservationSeat;
