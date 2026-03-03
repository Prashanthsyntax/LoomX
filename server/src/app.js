const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LoomX Backend Running");
});

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/loan", require("./routes/loan.routes"));



module.exports = app;
