$(function() {
  var socket = io();
      $messages = $('.messages'),
      $chatForm = $('.chat-form'),
      channel = $chatForm.data('channel');

  // Hack to get chat scroll working temporarily
  $messages.height($(window).height() - 280);

  // Join whatever channel the user went to
  socket.emit('join_channel', channel);

  // For now, just add a li with the message
  socket.on('new_message', function(message) {
    var formattedMessage = message.createdTime + " => " + message.body
    $messages.append($('<li>').text(formattedMessage));
    $messages.scrollTop($('.messages').prop("scrollHeight"));
  });

  // Emit 'new_message' event and reset form
  $chatForm.submit(function() {
    var $messageInput = $('#m');

    socket.emit('new_message', { channel: channel, body: $messageInput.val() });
    $messageInput.val('');

    return false;
  });
});
