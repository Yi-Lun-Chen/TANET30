const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");

const re = /(\d{4})\/([0-1]\d{1})\/([0-3]\d{1})/;
const today = () => {
  const d = new Date();
  const dtf = dt = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const [{ value: mm },,{ value: dd },,{ value: yy }] = dtf.formatToParts(d);
  return `${yy}/${mm}/${dd}`;
}

router.post("/give", (req, res) => {
  if(!req.isLogin || req.user.group !== "root") {
    res.status(401).send("Not authorized");
    return;
  }
  const {owner, type, date } = req.body;
  if(!owner || !type || !date) {
    res.status(400).send("Missing field");
    return;
  }
  if(date.length !== 10 || !re.test(date)) {
    res.status(400).send("Invalid Date");
    return;
  }
  const newTicket = new Ticket({owner, type, date, usedTime: 0});
  newTicket.save((err) => {
    if(err) return errHandler(err, res);
    else res.status(200).send("Success");
  })
})

router.post("/use", async (req, res) => {
  if(!req.isLogin || req.user.group !== "foodStaff") {
    res.status(401).send("Not authorized");
    return;
  }
  const {owner, type} = req.body;
  if(!owner || !type) {
    res.status(400).send("Missing field");
  }
  const date = today();
  let tickets = await Ticket.find({owner, type, date})
  .then(ticket => ticket)
  .catch(err => errHandler(err));
  if(!tickets) {
    res.status(401).send("No Ticket Found");
    return;
  }
  let ticket = tickets.find(ticket => ticket.usedTime === 0);
  if(!ticket) {
    res.status(401).send("Ticket is used");
  }
  ticket.usedTime = Date.now();
  await ticket.save();
  res.status(200).send("Success");
  return;
})

const errHandler = (err, res) => {
  console.error(err);
  res.status(500).send("Server error");
}

module.exports = router;