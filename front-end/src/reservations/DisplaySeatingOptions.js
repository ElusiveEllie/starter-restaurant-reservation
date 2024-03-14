/**
 * Displays seating options based on available tables and the number of people.
 * @param {Array<Object>} tables - An array of table objects.
 * @param {number} people - The number of people for whom seating options are displayed.
 * @returns {JSX.Element[]} - An array of JSX elements representing seating options.
 */

function DisplaySeatingOptions(tables, people) {
  const tablesTable = tables.map((table, index) => {
    if (table.capacity >= people && !table.reservation_id) {
      // Enable the option if the table can accommodate the specified number of people and is not already reserved
      return (
        <option key={table.table_id} value={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    } else {
      return (
        // Disable the option if the table cannot accommodate the specified number of people or is already reserved
        <option key={table.table_id} value={table.table_id} disabled>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
  });
  return tablesTable;
}

export default DisplaySeatingOptions;
