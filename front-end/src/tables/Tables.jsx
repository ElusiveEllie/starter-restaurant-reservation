import { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import initialFormState from "./initialFormState";
import postTable from "./PostTable";

/**
 * Displays a form for creating a new table.
 * @returns {JSX.Element} - The JSX element representing the table creation form.
 */

function NewTable() {
  const history = useHistory();

  // State for form data and error handling
  const [formData, setformData] = useState({ ...initialFormState });
  const [tablesError, setTablesError] = useState(null);

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
    postTable(formData, setTablesError, history);
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <div className="row">
        <label htmlFor="table_name" className="col">
          Table Name:
          <input
            type="text"
            id="table_name"
            name="table_name"
            minLength="2"
            onChange={handleChange}
            value={formData.table_name}
            className="form-control"
          />
        </label>
        <label htmlFor="capacity" className="col">
          Capacity:
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            onChange={handleChange}
            value={formData.capacity}
            className="form-control"
          />
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
        <ErrorAlert error={tablesError} />
      </div>
    </form>
  );
}

export default NewTable;
