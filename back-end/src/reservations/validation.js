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

function validateTime(date, time) {
  date = new Date(date);
  currentDate = new Date(today());
  const now = new Date();
  now.setUTCHours(now.getHours());
  const hours = Number(time.slice(0, 2));
  const minutes = Number(time.slice(3));
  let inPast = 0;
  if (currentDate - date === 0) {
    inPast = (now.getUTCHours() - hours > 0) || (now.getUTCHours() - hours === 0 && now.getMinutes() - minutes > 0) ? 1 : 0;
  }
  const errors = [];
  if (inPast) errors.push("Time must be in the future.");
  if (hours < 9 || (hours === 9 && minutes < 30)) errors.push("Reservations can only be made after 9:30 AM.");
  if (hours > 22 || (hours === 22 && minutes > 30)) errors.push("Reservations can only be made up to 10:30 PM.");
  return errors.join("\n");
}

module.exports = {
  validateDate,
  validateTime,
}
