//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-ashok:ashok1980@cluster0.q3sv9.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Home Cleaning",
});

const item2 = new Item({
  name: "Cooking",
});

const item3 = new Item({
  name: "Coding",
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (err) => {
//   if (err) console.log(err);
//   else console.log("Documents added successfully to the todolistDB.");
// });

app.get("/", function (req, res) {
  const day = date.getDate();

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) console.log(err);
        else console.log("Documents added successfully to the todolistDB.");
      });
      res.redirect("/");
    } else res.render("list", { listTitle: day, newListItems: foundItems });
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });

  item.save();

  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkeddItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkeddItemId, (err) => {
    if (err) console.log(err);
    else console.log("Item removed successfully from the DB.");
  });
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
