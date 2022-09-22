
const express = require("express"),
      cors = require("cors");
const routes = require("./routes/v2");
const app = express();
const PORT = 8080
app.use(cors());
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    return next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(require('./utils/morgan'));

app.use("/", [routes]);
app.listen(PORT, ()=> console.log("Server running on port: http://localhost:" + PORT));