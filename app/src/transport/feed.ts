export function startFeed() {
  let path;

  if (process.env.NODE_ENV === 'development') {
    // Proxy not working for websocket.
    path = 'ws://localhost:8080/api/v1/feed';
  } else {
    path = 'wss://save-it-v2/api/v1/feed';
  }

  const ws = new WebSocket(path);

  ws.addEventListener('open', (e) => {
    console.log(e);
  });

  ws.addEventListener('message', (e) => {
    console.log(e.data);
  });
}
