const express = require("express");
const logger = require ("./Middlewares/looger");
const { notFound, errorHandler } = require("./Middlewares/errors");
const { connectToDb} = require("./Config/db");
const dotenv = require("dotenv").config();

// Connettion to database
connectToDb();

// Init App
const app = express();

// Apply Middlewears
app.use(express.json());

app.use(logger);

// Routes
app.use("/api/books", require("./Routes/books"));
app.use("/api/authors", require("./Routes/Authors"));
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/users", require("./Routes/users"));


// Error Handler
app.use(notFound);
app.use(errorHandler);

// Running the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server in running in ${process.env.NODE_ENV} mode port ${PORT}`));
