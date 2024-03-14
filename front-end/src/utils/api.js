/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Creates a new reservation.
 * @param {Object} reservation - The reservation data to be created.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise} - A promise indicating the completion of the operation.
 */

export async function postReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  reservation.data.people = Number(reservation.data.people);
  return await fetchJson(
    url,
    { headers, signal, method: "POST", body: JSON.stringify(reservation) },
    []
  );
}

/**
 * Updates an existing reservation.
 * @param {Object} reservation - The reservation data to be updated.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise} - A promise indicating the completion of the operation.
 */

export async function putReservation(reservation, signal) {
  const url = new URL(
    `${API_BASE_URL}/reservations/${reservation.data.reservation_id}`
  );
  reservation.data.people = Number(reservation.data.people);
  return await fetchJson(
    url,
    { headers, signal, method: "PUT", body: JSON.stringify(reservation) },
    []
  );
}

/**
 * Retrieves a list of tables.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise<Array<Object>>} - A promise resolving to an array of tables.
 */

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Creates a new table.
 * @param {Object} table - The table data to be created.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise<void>} - A promise indicating the completion of the operation.
 */

export async function postTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  table.data.capacity = Number(table.data.capacity);
  return await fetchJson(
    url,
    { headers, signal, method: "POST", body: JSON.stringify(table) },
    []
  );
}

/**
 * Retrieves a single reservation by its ID.
 * @param {string} reservation_id - The ID of the reservation to retrieve.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise<Object>} - A promise resolving to the retrieved reservation.
 */

export async function listSingleReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Updates the seating assignment of a table.
 * @param {Object} params - The parameters for updating seating assignment.
 * @param {string} params.reservation_id - The ID of the reservation to assign to the table.
 * @param {string} params.table_id - The ID of the table to update.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise} - A promise indicating the completion of the operation.
 */

export async function putSeatingAssignment(params, signal) {
  const { reservation_id, table_id } = params;
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await fetchJson(
    url,
    {
      headers,
      signal,
      method: "PUT",
      body: JSON.stringify({ data: { reservation_id: reservation_id } }),
    },
    []
  );
}

/**
 * Updates the seating status of a reservation.
 * @param {Object} params - The parameters for updating seating status.
 * @param {string} params.reservation_id - The ID of the reservation to update.
 * @param {string} params.status - The new status to set for the reservation.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise} - A promise indicating the completion of the operation.
 */

export async function putSeatingStatus(params, signal) {
  const { reservation_id, status } = params;
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  return await fetchJson(url, {
    headers,
    signal,
    method: "PUT",
    body: JSON.stringify({ data: { status: status } }),
  });
}

/**
 * Deletes seating assignment for a table.
 * @param {Object} params - The parameters for deleting seating assignment.
 * @param {string} params.table_id - The ID of the table for which seating assignment will be deleted.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise} - A promise indicating the completion of the operation.
 */

export async function deleteSeating(params, signal) {
  const { table_id } = params;
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await fetchJson(url, { headers, signal, method: "DELETE" }, []);
}

/**
 * Searches for reservations based on provided parameters.
 * @param {Object} params - The search parameters.
 * @param {string} params.mobile_number - The mobile number used for searching reservations.
 * @param {AbortSignal} signal - An optional AbortSignal to abort the request.
 * @returns {Promise<Array<Object>>} - A promise resolving to an array of reservations.
 */

export async function searchForReservation(params, signal) {
  const { mobile_number } = params;
  const url = new URL(
    `${API_BASE_URL}/reservations?mobile_number=${mobile_number}`
  );
  return await fetchJson(
    url,
    {
      headers,
      signal,
      method: "GET",
    },
    []
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}
