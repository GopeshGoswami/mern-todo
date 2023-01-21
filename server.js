const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
mongoose.set("strictQuery", true);

mongoose
  .connect(
    "mongodb+srv://gopu:guitar95@cluster0.ymnff1o.mongodb.net/mern-todo",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

//   Fetching Data
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

// Updating Data
app.post("/todo/new", async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
    });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deleting Data
app.delete("/todo/delete/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) res.status(404).json({ message: "Todo not found" });
    else res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// updating completed
app.put("/todo/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) res.status(404).json({ message: "Todo not found" });
    else {
      if (todo.complete !== null) todo.complete = !todo.complete;
      await todo.save();
      res.json(todo);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use(express.static(path.resolve(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(3001, () => console.log("SERVER IS LIVE AT PORT 3001"));
