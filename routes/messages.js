const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Message.getAll();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { text, user } = req.body;
    
    if (!text || !user) {
      return res.status(400).json({ error: 'Текст и пользователь обязательны' });
    }

    const message = await Message.create({ text, user });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
