import {
  actionToPromise,
} from './core';

/**
 * @typedef {import('interfaces').Action} Action
 */

/**
 * @typedef {import('interfaces').Predicate} Predicate
 */

/** Create an action that runs several actions at once and resolves as soon
 * as any one of the actions resolves.
 *
 * NOTE: once its actions have started, this action is not responsible for
 * stopping them. For example, if you've started playing several audio
 * files at once and you want them all to stop when the first one stops,
 * this action doesn't provide for that. Caveat programmator!
 *
 * @param {...Action} actions - An action.
 *                              The #any action accepts an arbitrary number of
 *                              action arguments.
 *
 * @return {Action} An action.
 *                  The action runs all of the actions passed in as
 *                  arguments and resolves with the first action
 *                  that resolves.
 */
function any(...actions) {
  return (resolve) => {
    const promiseableActions = actions.map((action) => actionToPromise(action));

    Promise.race(promiseableActions).then(
      (maybeResolve) => resolve(maybeResolve),
    );
  };
}

/** Run several actions serially. It waits for the previous action to be
 * resolved before running the next one.
 *
 * @param {...Action} args - Any of _n_ actions to be run in sequence.
 *
 * @return {Action} An action.
 */
function sequence(...args) {
  /**
   * Run two actions serially, then resolve.
   * @param {Action} actionA - first action to run
   * @param {Action} actionB - second action to run
   * @return {Action} Action that runs the two actions serially.
   */
  function inOrder(actionA, actionB) {
    return (resolve) => {
      actionToPromise(actionA).then(() => {
        actionToPromise(actionB).then(
          () => {
            resolve();
          },
        );
      });
    };
  };

  /* Do a fold on the arguments so that we return one action. */
  return args.reduce(inOrder);
}

/** Run several actions concurrently.
 * Resolve when all actions have been resolved regardless of the order
 * in which the actions are resolved.
 *
 * @param {...Action} args - Any of _n_ actions to be run concurrently.
 *
 *
 * @return {Action}         - An action.
 */
function together(...args) {
  /**
   * @param {Action} element - item to be type-checked as function
   * @return {boolean} true if element is a function, else false
   */
  function anyNonFunction(element) {
    return typeof element !== 'function';
  }

  if (args.some(anyNonFunction)) {
    throw new TypeError('One of the supplied actions is not a function.');
  }

  return (resolve) => {
    const promiseableActions = args.map((action) => actionToPromise(action));

    Promise.allSettled(promiseableActions).then(
      (maybeResolve) => resolve(maybeResolve),
    );
  };
}

export {
  any,
  sequence,
  together,
};
