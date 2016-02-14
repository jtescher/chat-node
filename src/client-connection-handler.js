function clientConnectionHandler(io, socket, chatHistory, moment) {

  // Handle when client joins channel
  socket.on('join_channel', socket.join);

  // Handle when client requests channel history
  socket.on('get_channel_history', channelName => {
    chatHistory.getMessagesByChannelName(channelName, chatMessages => {
      io.to(socket.id).emit('chat_history', chatMessages);
    });
  });

  // Handle new message from client
  socket.on('new_message', message => {
    message.createdTime = moment();
    chatHistory.saveMessage(message);
    io.to(message.channelName).emit('new_message', message);
  });

};

module.exports = clientConnectionHandler
