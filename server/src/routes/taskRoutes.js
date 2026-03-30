const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// all routes are protected
router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;