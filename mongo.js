const mongoose = require('mongoose')

const url = `mongodb+srv://FullStack:Willis_85@cluster0.sjyjb.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// Se define el Schema de la Coleccion.
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

// Se crea el Modelo de la coleccion.
const Note = mongoose.model('Note', noteSchema)

// Se instacia un documento de la coleccion.
/* const note = new Note({
  content: 'Gracias Señor',
  date: new Date(),
  important: false,
}) */

// Guardo en MondoDB-Atlas un documento.
/* note.save().then(response => {
  console.log('note saved!')
  mongoose.connection.close()
}) */

// Consulto todos los Ducumentos en la Coleccion.
/* Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  }) */

  // Filtro la consulta para que Muestre solo las notas Importantes.
  Note.find({ important: true }).then(result => {
    result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
  })