import fetch from './fetch';

const feedUrl = '/api/v1/feed';

export function startFeed() {
  async function run() {
    try {
      const res = await fetch(feedUrl);
      if (res.status !== 401) {
        run();
      }
    } catch (e) {
      run();
    }
  }
  run();
}
