(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '200px' });

  document.getElementById('submit-comment').addEventListener('click', function() {
    var commentText = document.getElementById('private-comment').value;
    if (commentText.length === 0) {
      client.invoke('notify', 'The comment cannot be empty.', 'error');
      return;
    }
    var ticketIdPromise = client.get('ticket.id');
    ticketIdPromise.then(function(ticketIdResponse) {
      var ticketId = ticketIdResponse['ticket.id'];
      var data = {
        ticket: {
          comment: {
            body: commentText,
            public: false
          }
        }
      };
      addPrivateComment(ticketId, data);
    });
  });

  function addPrivateComment(ticketId, data) {
    var settings = {
      url: '/api/v2/tickets/' + ticketId + '.json',
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
    };
    client.request(settings).then(
      function() {
        client.invoke('notify', 'Internal note added successfully.');
        document.getElementById('private-comment').value = ''; 
      },
      function(response) {
        client.invoke('notify', 'Failed to add internal note: ' + response.statusText, 'error');
      }
    );
  }
})();
