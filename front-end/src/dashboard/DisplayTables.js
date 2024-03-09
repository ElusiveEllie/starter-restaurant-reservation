import { deleteSeating } from "../utils/api";

async function finishTable(table_id) {
  if (
    window.confirm(
      `Is this table (Table ${table_id}) ready to seat new guests? This cannot be undone.`
    )
  ) {
    const abortController = new AbortController();
    await deleteSeating(table_id, abortController.signal);
  }
}

function DisplayTables(props) {
  const { tables, loadDashboard } = props;
  const tablesTable = tables.map((table, index) => {
    return (
      <tr key={index}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </td>
        <td>
          {table.reservation_id ? (
            <button
              onClick={async () => {
                await finishTable(table.table_id);
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
