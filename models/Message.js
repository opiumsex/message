const { getDb } = require('../config/database');

class Message {
  static async create(messageData) {
    const db = getDb();
    const { text, user } = messageData;
    
    const result = await db.query(
      'INSERT INTO messages (text, user) VALUES ($1, $2) RETURNING *',
      [text, user]
    );
    
    return result.rows[0];
  }

  static async getAll() {
    const db = getDb();
    const result = await db.query(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50'
    );
    return result.rows;
  }
}

module.exports = Message;
