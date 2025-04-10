const socket = io('http://localhost:3000'); // Adjust the URL as needed

document.addEventListener('DOMContentLoaded', () => {
  const roomSelect = document.getElementById('room');
  const joinRoomButton = document.getElementById('joinRoom');
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');
  const sendButton = document.getElementById('send');
  const messagesList = document.getElementById('messages');

  let currentRoom = null;

  joinRoomButton.addEventListener('click', () => {
    const selectedRoom = roomSelect.value;

    if (currentRoom) {
      socket.emit('leaveRoom', currentRoom); // Leave the current room
    }

    currentRoom = selectedRoom;
    socket.emit('joinRoom', currentRoom); // Join the new room
    console.log(`Joined room: ${currentRoom}`);

    // Fetch past messages for the selected room
    fetch(`http://localhost:3000/api/chat/${currentRoom}`)
      .then((response) => response.json())
      .then((messages) => {
        const messagesList = document.getElementById('messages');
        messagesList.innerHTML = ''; // Clear current messages
        messages.forEach((msg) => {
          const li = document.createElement('li');
          li.textContent = `${msg.username}: ${msg.message}`;
          messagesList.appendChild(li);
        });
      });
  });

  sendButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const message = messageInput.value;

    if (username && message && currentRoom) {
      socket.emit('sendMessage', { username, message, room: currentRoom });
      messageInput.value = '';
    }
  });

  socket.on('newMessage', (data) => {
    const li = document.createElement('li');
    li.textContent = `${data.username}: ${data.message}`;
    messagesList.appendChild(li);
  });
});