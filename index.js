const express = require("express");
const routes = require("./routes/index.js");
const app = express();
const PORT = 8080
app.use(express.json());

app.use("/api", routes);
app.listen(PORT, ()=> console.log("Server running on port: http://localhost:" + PORT));