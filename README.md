**Kanban Dashboard Features:**
- It is designed to have nine lanes. These lanes are titled: Ideas, Correction of Error Report, Short Note, Q&A Model, Pre-mortem, Full Note, Buy List, and Fail List.
- A primary objective was to implement a drag-and-drop functionality. This allows a card from one lane, such as "Ideas", to be moved to another lane. All changes must be tracked in the database.
- Every card that's created is also recorded in the database.

**Development Process:**
- **Research:** I began by researching how to create a drag-and-drop effect. I chose to use React along with the HTML5 attribute "draggable". This enables certain elements, like a `div`, to be dragged.
- **Frontend Design:** Starting from the top-level component, the app component was built to display the lanes and their titles. The state was initialized with column names and an array for the lanes, which had nine empty arrays. 
  - A child component, designed as the droppable zone, iterates through these arrays, setting cards accordingly.
  - For each card, a "handle drag start" function is set, allowing it to be dragged. The destination upon dropping determines its new location.
  - A draggable item component was used to make the cards draggable.
- **Backend Development:** The goal was to create an API that bridges the frontend and the database. This database would track card creations and modifications.
  - For the server, I used Express, and for the database, PostgreSQL was chosen.
  - Sequelize, an Object Relational Mapping (ORM) tool, was utilized to interact with the database. It allowed me to treat database records as objects, simplifying modifications.
  - Routes were set up for various API calls. A "get" call in the frontend fetched existing data from the database during the component's mounting process, using the React "useEffect" hook.
  - Drag-and-drop functionality was further enhanced with functions to handle the drop events, updating the database accordingly.

**Challenges Faced:**
- Understanding how cards are displayed was initially confusing.
- There was an issue where dragging an item into another card would create an extra card in the target column due to event propagation. This required a deeper understanding of how events like clicks or drags propagate through the DOM tree.
- On the backend, understanding Sequelize's ORM was an initial hurdle, but its utility in simplifying database operations was soon realized.

**Technologies and Libraries Used:**
- React for frontend development.
- Axios, a JavaScript library, for API calls.
- CORS, Middleware for Express to enable Cross-Origin Resource Sharing.
- Express for backend server setup.
- Sequelize as the ORM to facilitate database interactions.


I have also styled the application using "app.css" to enhance the user interface.

Overall, this project was immensely educational. It helped me understand React's state management, event propagation, and other intricacies of web development. On the backend, I got acquainted with Sequelize's ORM, appreciating its ease in database manipulations and treating records as objects.

---