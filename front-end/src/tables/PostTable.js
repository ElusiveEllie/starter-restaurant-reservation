import { postTable as post } from "../utils/api";

function postTable(formData, setTablesError, history) {
  const abortController = new AbortController();
  setTablesError(null);
  post({ data: formData }, abortController.signal)
    .then(() => history.push(`/dashboard`))
    .catch(setTablesError);
  return () => abortController.abort();
}

export default postTable;
