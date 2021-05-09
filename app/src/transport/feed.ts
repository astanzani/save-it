export function startFeed() {
  let path;

  // Proxy does not work for web socket.
  if (window.location.protocol.startsWith('https')) {
    path = 'wss://save-it-v2.herokuapp.com/api/v1/feed';
  } else {
    // If running with local api, use local web socket server.
    path = 'ws://localhost:8080/api/v1/feed';
  }

  const ws = new WebSocket(path);

  ws.addEventListener('open', (e) => {
    console.log(e);
  });

  ws.addEventListener('message', (e) => {
    console.log(e.data);
  });

  ws.addEventListener('close', (e) => {
    console.log(e);
  });

  ws.addEventListener('error', (e) => {
    console.log(e);
  });
}
