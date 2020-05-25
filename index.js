const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms - :body'
  )
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app
  .get('/api/persons', (req, res) => {
    res.json(persons);
  })
  .post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
      res
        .status(400)
        .json({ error: "Name and number can't be missing or blank" });
    } else if (persons.some((person) => person.name === name)) {
      res.status(400).json({ error: 'Person with this name already exists' });
    } else {
      const id = Math.floor(Math.random() * 1000);
      const newPerson = { name, number, id };
      persons = [...persons, newPerson];
      res.status(201).json(newPerson);
    }
  });

app
  .get('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    const person = persons.find((person) => person.id == id);
    res.json(person);
  })
  .delete('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    persons = persons.filter((person) => person.id != id);
    res.status(204).end();
  });

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has information for ${
      persons.length
    } people</p><p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
