// Module to parse form data.
const formidable = require('formidable');
const { endOfDay, startOfDay } = require('date-fns');
const pool = require('../models/database');
const { fieldValidator } = require('../utils/index');

// Middleware for creating expenses. 
exports.create = (req, res) => {
  // method for handling multiple types of data, like images, documents, text and numbers.
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields) => {
    const { title, price, category, essential, created_at } = fields;
    // Check for all fields. If It returns a value different than null, it means one of the 
    // field is empty. It will return an error.
    if (fieldValidator(fields)) {
      return res.status(400).json(fieldValidator(fields));
    }
    try {
      // Makes a query to the postgres database for insertion of the data.
      const newExpense = await pool.query(
        'INSERT INTO expenses (title, price, category, essential, created_at) VALUES ($1, $2, $3, $4, $5)',
        [title, price, category, essential, created_at]
      );
      return res.status(201).send(`User added: ${newExpense.rowCount}`);
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  });
};
// Middleware for updating expenses. 
exports.update = (req, res) => {
  const form = new formidable.IncomingForm();
  const id = Number(req.params.id);
  form.keepExtensions = true;
  form.parse(req, async (err, fields) => {
    // check for all fields
    const { title, price, category, essential, created_at } = fields;
    if (fieldValidator(fields)) {
      return res.status(400).json(fieldValidator(fields));
    }
    try {
      await pool.query(
        'UPDATE expenses SET title = $1, price = $2, category = $3, essential = $4, created_at = $5 WHERE expense_id = $6',
        [title, price, category, essential, created_at, id]
      );

      return res.status(200).send(`User modified with ID: ${id}`);
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  });
};
// Middleware for returning expenses by their ID
exports.expenseById = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const expense = await pool.query(
      'SELECT * FROM expenses WHERE expense_id = $1',
      [id]
    );
    req.expense = expense.rows;
    return next();
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};
// Middleware for returning expenses depending on the date given (through the date UI date picker).
exports.expenseByDate = async (req, res, next) => {
  const expenseDate = Number(req.params.expenseDate);
  try {
    const expenseQuery = await pool.query(
      'SELECT * FROM expenses WHERE created_at BETWEEN $1 AND $2',
      [
        startOfDay(new Date(expenseDate)).toISOString(),
        endOfDay(new Date(expenseDate)).toISOString(),
      ]
    );
    const expenseList = expenseQuery.rows;
    req.expense =
      expenseList.length > 0
        ? expenseList
        : `No expenses were found on this date.`;
    return next();
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
// Middleware for reading (displaying in the Front-End) expenses. 
exports.read = (req, res) => res.json(req.expense);
// Middleware for deleting an expense from the ID passed to the parameter.
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await pool.query('DELETE FROM expenses WHERE expense_id = $1', [id]);
    return res.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
