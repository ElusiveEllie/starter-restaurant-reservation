import { postTable as post } from "../utils/api";

/**
 * Posts a new table.
 * @param {Object} formData - The table data to be posted.
 * @param {Function} setTablesError - A function to set errors related to tables.
 * @param {Object} history - The history object to navigate after posting the table.
 * @returns {Function} - A cleanup function to abort any pending requests.
 */

function postTable(formData, setTablesError, history) {
  const abortController = new AbortController();
  setTablesError(null);
  post({ data: formData }, abortController.signal)
    .then(() => history.push(`/dashboard`))
    .catch(setTablesError);
  return () => abortController.abort();
}

export default postTable;
