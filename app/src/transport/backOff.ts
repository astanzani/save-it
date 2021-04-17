export async function backOff<T>(fn: () => Promise<T>, depth = 0) {
  await wait(getCurrentTimeout(depth));
  return await fn();
}

function getCurrentTimeout(depth: number) {
  return 2 ** depth * 1000;
}

function wait(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
