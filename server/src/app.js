const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LoomX Backend Running");
});

const loanRoutes = require("./routes/loan.routes");
app.use("/api/loan", loanRoutes);


module.exports = app;
