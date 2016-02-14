class ChatHistory {

  // Initial chat history config
  constructor(dbConnection) {
    this.channelHistoryMaxLength = 100 // Only store last n messages per channel
    this.dbConnection = dbConnection;  // DB connection, redis supported currently
  }

  // Persist client messages
  saveMessage(message) {
    this.dbConnection.lpush(`channel:${message.channelName}`, JSON.stringify(message));
    this.dbConnection.ltrim(`channel:${message.channelName}`, 0, this.channelHistoryMaxLength);
  }

  // Retrieve channel history for client
  getMessagesByChannelName(channelName, callback) {
    this.dbConnection.lrange(`channel:${channelName}`, 0, this.channelHistoryMaxLength, (err, reply) => {
      callback(reply.reverse().map(JSON.parse));
    });
  }

}

module.exports = {
  ChatHistory: (dbConnection) => new ChatHistory(dbConnection)
}
