$(function() {

  var socket = io(),
      $messages = $('.messages'),
      $messageInput = $('#m'),
      $chatForm = $('.chat-form'),
      channelName = $chatForm.data('channelName'),
      showMessage;

  // Hacky js templating >:(
  showMessage = function(message) {
    var formattedMessage = moment(message.createdTime).format('h:mm:ss') + " => " + message.body;
    $messages.append($('<li>').text(formattedMessage));
    $messages.scrollTop($('.messages').prop("scrollHeight"));
  }

  // Hack to get chat scroll working temporarily :/
  $messages.height($(window).height() - 280);

  // Join whatever channel the user went to
  socket.emit('join_channel', channelName);
  socket.emit('get_channel_history', channelName);

  // Add chat history
  socket.on('chat_history', function(messages) {
    $.each(messages, (inex, message) => showMessage(message));
  });

  // For now, just add a `li` with the message
  socket.on('new_message', showMessage);

  // Emit proper event and reset form
  $chatForm.submit(function() {
    socket.emit('new_message', { channelName: channelName, body: $messageInput.val() });
    $messageInput.val('');
    return false;
  });

});
