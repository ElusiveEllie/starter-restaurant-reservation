function DisplaySeatingOptions(tables, people) {
  const tablesTable = tables.map((table, index) => {
    if (table.capacity >= people && !table.reservation_id) {
      return (
        <option key={index} value={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    } else {
      return (
        <option key={index} value={table.table_id} disabled>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
  });
  return tablesTable;
}

export default DisplaySeatingOptions;
