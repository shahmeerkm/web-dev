//department file(models folder)
const mongoose = require('mongoose');

const DepSchema = new mongoose.Schema({
    depid: Number,
    jobname: String,
    jobid: { type: Number, ref: 'Employees' },
    employee: { type: mongoose.SchemaTypes.ObjectId, ref: 'Employees' } // Assuming this is another reference field
});

const Departments = mongoose.model('Departments', DepSchema);
module.exports = Departments;
