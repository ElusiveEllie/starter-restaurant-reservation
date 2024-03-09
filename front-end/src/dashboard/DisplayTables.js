function DisplayTables(tables) {
  const tablesTable = tables.map((table, index) => {
    return (
      <tr key={index}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </td>
      </tr>
    );
  });
  return tablesTable;
}

export default DisplayTables;
