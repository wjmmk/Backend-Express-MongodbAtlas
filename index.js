const express = require("express");
const app = express();

require("dotenv").config();
const Note = require("./models/note");

const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

//**** MiddleWare Para Manejar Archivos Static.*/
var options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html"],
  index: false,
  maxAge: "1d",
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set("x-timestamp", Date.now());
  },
};

//**** MiddleWare */
app.use(express.static("build", options));
app.use(express.json());
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);
//**** MiddleWare */

// Inserta una nota en la DB.
app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then(savedNote => savedNote.toJSON())
  .then(savedAndFormattedNote => {
    response.json(savedAndFormattedNote)
  }).catch(error => next(error))
});

//**** MiddleWare */
const cors = require("cors");

app.use(cors());

app.get("/", (request, response) => {
  response.send("<h1>Welcome to Web Server !!!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
    console.log(result)
  })
  .catch(error => next(error))
});

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

//**** MiddleWare Para el Manejo de Errores*/
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
      return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
      return response.status(400).json({ error: error.message }); }
  next(error);
}
app.use(errorHandler);
//**** MiddleWare */

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
