const express = require('express');
const {
  handleContact,
  handleReplayMessage,
  AllGetMessage,
  handleDeleteMessageById,
} = require('../controllers/contactController');
const { validateContactMessage } = require('../validator/auth');
const { runValidaton } = require('../validator');
const contactRouter = express.Router();
contactRouter.post('/', validateContactMessage, runValidaton, handleContact);
contactRouter.post(
  '/replay-message',
  validateContactMessage,
  runValidaton,
  handleReplayMessage
);
contactRouter.get('/get-message', AllGetMessage);
contactRouter.delete('/delete-message/:id', handleDeleteMessageById);
module.exports = contactRouter;
