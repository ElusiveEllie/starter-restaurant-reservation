function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

function today() {
  return asDateString(new Date());
}

/**
 * Validates the provided date.
 * @param {string} date - The date to be validated (in string format).
 * @returns {string} - A string containing any validation errors, separated by newline characters.
 */

function validateDate(date) {
  date = new Date(date);
  currentDate = new Date(today());
  const inPast = currentDate - date > 0 ? 1 : 0;
  const day = date.getUTCDay();
  const errors = [];
  if (inPast) errors.push("Date must be for today or a future date.");
  if (day === 2) errors.push("Periodic Tables is closed on Tuesdays.");
  return errors.join("\n");
}

/**
 * Validates the provided time based on the given date.
 * @param {string} date - The date associated with the time (in string format).
 * @param {string} time - The time to be validated (in string format).
 * @returns {string} - A string containing any validation errors, separated by newline characters.
 */

function validateTime(date, time) {
  date = new Date(date);
  currentDate = new Date(today());
  const now = new Date();
  now.setUTCHours(now.getHours());
  const hours = Number(time.slice(0, 2));
  const minutes = Number(time.slice(3));
  let inPast = 0;
  if (currentDate - date === 0) {
    inPast =
      now.getUTCHours() - hours > 0 ||
      (now.getUTCHours() - hours === 0 && now.getMinutes() - minutes > 0)
        ? 1
        : 0;
  }
  const errors = [];
  if (inPast) errors.push("Time must be in the future.");
  if (hours < 10 || (hours === 10 && minutes < 30))
    errors.push("Reservations can only be made after 10:30 AM.");
  if (hours > 21 || (hours === 21 && minutes > 30))
    errors.push("Reservations can only be made up to 9:30 PM.");
  return errors.join("\n");
}

/**
 * Validates the provided mobile number's form factor.
 * @param {string} mobile_number - The mobile_number associated with the reservation.
 * @returns {string} - A string containing any validation errors, separated by newline characters.
 */

function validateMobileNumber(mobile_number) {
  // Return 400 with invalid mobile_number message if mobile_number doesn't match proper format
  if (/^([\d\d\d\d\d\d\d\d\d\d]{10,10})$/.test(mobile_number)) {
    mobile_number = mobile_number.substring(0, 3) + "-" + mobile_number.substring(3, 6) + "-" + mobile_number.substring(6);
  }
  const errors = [];
  if (!/^([\d\d\d-\d\d\d-\d\d\d\d]{12,12})$/.test(mobile_number)) {
    errors.push(`mobile_number field must be in format of XXX-XXX-XXXX. Received ${mobile_number}.`);
  }
  return errors.join("\n");
}

module.exports = {
  validateDate,
  validateTime,
  validateMobileNumber
};
