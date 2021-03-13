import fetch from './fetch';
import { backOff } from './backOff';

const feedUrl = '/api/v1/feed';

export function startFeed() {
  let retryAttempt = 0;

  async function maybeRun(ok?: boolean) {
    if (ok) {
      retryAttempt = 0;
      run();
    } else {
      retryAttempt++;
      await backOff(() => run(), retryAttempt);
    }
  }

  async function run() {
    let res: Response | undefined;

    try {
      res = await fetch(feedUrl);
    } finally {
      maybeRun(res?.ok);
    }
  }
  run();
}
