import {
  sequence,
} from './collections';

/**
 * @typedef {import('interfaces').Action} Action
 */

/**
 * Create an action that waits for given amount of time, then runs the action.
 * This is simply a composition of #wait and another action.
 *
 * @param {Action} action - An action to be run after the given duration.
 * @param {number} duration - The amount of time, in milliseconds, to wait
 *                            before proceeding to the action.
 * @return {Action} An action.
 */
function delay(action, duration) {
  return sequence(wait(duration), action);
}

/**
 * Create an action that waits for given amount of time,
 * then calls the continuation.
 *
 * @param {number} duration - The amount of time, in milliseconds, to wait
 *                            before resolving.
 * @return {Action} An action.
 */
function wait(duration) {
  return (resolve) => {
    setTimeout(resolve, duration);
  };
}

export {
  delay,
  wait,
};
