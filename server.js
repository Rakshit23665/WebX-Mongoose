const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/school')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Mongoose Schema & Model
const studentSchema = new mongoose.Schema({
  studentId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  grade: { 
    type: String, 
    required: true, 
    enum: ["A+", "A", "B", "C", "D"], // Enum Validation
    uppercase: true // Ensures input is uppercase
  }
});

const Student = mongoose.model('Student', studentSchema);

// Routes
// Retrieve all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve student by studentId
app.get('/students/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: parseInt(req.params.studentId) });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new student
app.post('/students', async (req, res) => {
  try {
    const { studentId, name, age, grade } = req.body;
    const student = new Student({ studentId, name, age, grade });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student by studentId
app.put('/students/:studentId', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { studentId: parseInt(req.params.studentId) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student by studentId
app.delete('/students/:studentId', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: parseInt(req.params.studentId) });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
