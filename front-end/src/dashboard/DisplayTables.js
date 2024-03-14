import { deleteSeating } from "../utils/api";

/**
 * Marks a table as finished and deletes its seating record.
 * @param {string} table_id - The ID of the table to mark as finished.
 * @param {string} reservation_id - The ID of the reservation associated with the table.
 */

async function finishTable(table_id, reservation_id) {
  // Confirm with the user before marking table as finished
  if (
    window.confirm(
      `Is this table ready to seat new guests? This cannot be undone.`
    )
  ) {
    const abortController = new AbortController();
    await deleteSeating(
      { table_id, reservation_id, status: "finished" },
      abortController.signal
    );
  }
}

/**
 * Displays tables and their status.
 * @param {Object} props - The properties passed to the component.
 * @param {Array<Object>} props.tables - An array of table objects.
 * @param {Function} props.loadDashboard - A function to reload the dashboard after finishing a table.
 * @returns {JSX.Element[]} - An array of JSX elements representing tables and their status.
 */

function DisplayTables(props) {
  const { tables, loadDashboard } = props;

  // Mapping restaurant tables to UI table rows
  const tablesTable = tables.map((table, index) => {
    return (
      //  UI table row representing a single restaurant table
      <tr key={table.table_id}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </td>
        <td>
          {table.reservation_id ? (
            <button
              type="button"
              onClick={async () => {
                await finishTable(table.table_id, table.reservation_id);
                await loadDashboard();
              }}
              className="btn btn-secondary"
              data-table-id-finish={table.table_id}
            >
              Finish
            </button>
          ) : null}
        </td>
      </tr>
    );
  });
  return tablesTable;
}

export default DisplayTables;
