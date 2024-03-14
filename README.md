# Restaurant Reservation System

This application is a functional reservation system for a fictional restaurant named Periodic Tables. You can view a deployed version at by following [this link for the front-end,](https://periodic-tables-frontend-9myx.onrender.com) and [this link for the back-end](https://periodic-tables-backend-ygk4.onrender.com/).

The application allows restaurant staff to manage reservations and table assignments in a quick, easy-to-use user interface. The dashboard displays reservations by date and all available tables and their current status and capacity, allowing staff to view upcoming reservations and manage them per day. There is functionality for searching for reservations by mobile number, creating and editing reservations, canceling reservations, seating reservations and subsequently finishing them, and creating new tables inside the restaurant.

## Screenshots

1. The main page is the Dashboard, with the top section for displaying reservations in a data table, while the bottom section shows restaurant table status and capacity. Buttons below the current date allow the user to move back and forth in the calendar, and return to the current day at any time.
<kbd>
<img width="1080" alt="Dashboard for reservation system" src="https://i.imgur.com/CgtUBjx.png">
</kbd>

<hr>

2. Clicking the button to edit a reservation brings up a form with fields for the necessary information for the reservation. It auto-populates with the information from the database when it loads.
<kbd>
<img width="1080" alt="Form for reservation editing" src="https://i.imgur.com/3VNos0v.png">
</kbd>

<hr>

3. Clicking the button to seat a reservation brings up a page with a drop-down to assign a table to the reservation. The drop-down populates with every available table and greys out any tables that do not have enough capacity for the reservation.
<kbd>
<img width="1080" alt="Form for table seating" src="https://i.imgur.com/TJVX6Y6.png">
</kbd>

<hr>

4. The Search page allows you to enter in a mobile number, partial or complete, and find all reservations that match. The same form factor as the Dashboard is shown.
<kbd>
<img width="1080" alt="Search page" src="https://i.imgur.com/XLe4P1E.png">
</kbd>

<hr>

5. The New Reservation page utilizes the same form factor as the Edit Reservation page, allowing you to input a new reservation. For the sake of demonstration, Periodic Tables is closed on Tuesdays and does not allow reservations before 10:30 AM or after 9:30 PM, and the form does not allow reservations to be made outside of these constraints.
<kbd>
<img width="1080" alt="New Reservation page" src="https://i.imgur.com/Kj8eMZY.png">
</kbd>

<hr>

6. The New Table page allows the user to add another table to the list of tables that reservations can be assigned to.
<kbd>
<img width="1080" alt="New Table page" src="https://i.imgur.com/HxpISTv.png">
</kbd>

<hr>

7. The website is responsive and will look good on any size device used.
<kbd>
<img width="412" alt="New Reservation page on mobile" src="https://i.imgur.com/2OICAqf.png">
</kbd>

## Back-end

The back-end utilizes a RESTful API approach to respond to requests. The back-end API is split into `/reservations` and `/tables` folders. Each folder implements the same strategy for organization:

### Router

Receives HTTP requests to specified routes and calls the appropriate `controller` method for each call, or blocks the request if it is invalid.

### Controller

Contains functions for the requests that the `router` receives, validating the information contained in requests, responding with any errors that occur, and using the appropriate `service` to respond with the requested information or action.

### Service

Contains functions that use Knex to query the appropriate database using CRUD operations.

## Technology Used:

This application uses `React.js` and `CSS` for the front-end, and `Node.js`, `Express`, and `PostgreSQL` for the back-end.

## Installation Instructions:

1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env` to create a `.env` file for your back-end.
3. Fill in the `./back-end/.env` file with the URL to your PostgreSQL database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env` to create a `.env` file for your front-end.
5. Unless you are hosting your back-end in a location other than `http://localhost:5001`, you can leave the `./front-end/.env` file alone.
6. Run `npm install` to install project dependencies.
7. Run `cd back-end/` and then `npx knex migrate:latest` to set up the database. If you wish to use the example seed data, run `npx knex seed:run`.
8. Run `cd ..` and then `npm run start:dev` to start your server in development mode.
