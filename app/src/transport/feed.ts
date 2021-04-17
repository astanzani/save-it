import fetch from './fetch';
import { backOff } from './backOff';

const feedUrl = '/api/v1/feed';
let retryAttempt = 0;

export function startFeed() {
  run();
}

export async function maybeRun(ok?: boolean) {
  if (ok) {
    retryAttempt = 0;
    run();
  } else {
    retryAttempt++;
    await backOff(run, retryAttempt);
  }
}

export async function run() {
  let res: Response | undefined;

  try {
    res = await fetch(feedUrl);
  } finally {
    maybeRun(res?.ok);
  }
}
