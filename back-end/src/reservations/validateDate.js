function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

function today() {
  return asDateString(new Date());
}

function validateDate(date) {
  date = new Date(date);
  currentDate = new Date(today());
  const inPast = currentDate - date > 0 ? 1 : 0;
  const day = date.getUTCDay();
  const errors = [];
  if (inPast) errors.push("Date must be for today or a future date.");
  if (day === 2) errors.push("Date must not be a Tuesday.");
  return errors.join("\n");
}

module.exports = validateDate;
