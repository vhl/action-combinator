import {
  actionToPromise,
} from 'core';

/** Create an action that runs several actions at once and resolves as soon
 * as any one of the actions resolves.
 *
 * NOTE: once its actions have started, this action is not responsible for
 * stopping them. For example, if you've started playing several audio
 * files at once and you want them all to stop when the first one stops,
 * this action doesn't provide for that. Caveat programmator!
 *
 * @param {action} action An action.
 *                        The #any action accepts an arbitrary number of
 *                        action arguments.
 *
 * @return {action}      An action.
 *                        The action runs all of the actions passed in as
 *                        arguments and resolves with the first action
 *                        that resolves.
 */
function any(...actions) {
  return (resolve) => {
    const promiseableActions = actions.map((action) => actionToPromise(action));

    /* eslint-disable indent */
    Promise.race(promiseableActions).then(
      (maybeResolve) => resolve(maybeResolve),
    );
    /* eslint-enable indent */
  };
}

/** Run several actions serially. It waits for the previous action to be
 * resolved before running the next one.
 *
 * @param {action} arguments - Any of _n_ actions to be run in sequence.
 *
 * @return {action}         - An action.
 */
function sequence(...args) {
  /* Run two actions serially, then resolve. */
  const inOrder = (actionA, actionB) => {
    return (resolve) => {
      actionToPromise(actionA).then(() => {
        actionToPromise(actionB).then(resolve);
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
 * @param {action} arguments - Any of _n_ actions to be run concurrently.
 *
 *
 * @return {action}         - An action.
 */
function together(...args) {
  const anyNonFunction = (element) => typeof element !== 'function';

  if (args.some(anyNonFunction)) {
    throw new TypeError('One of the supplied actions is not a function.');
  }

  return (resolve) => {
    const promiseableActions = args.map((action) => actionToPromise(action));

    /* eslint-disable indent */
    Promise.allSettled(promiseableActions).then(
      (maybeResolve) => resolve(maybeResolve),
    );
    /* eslint-enable indent */
  };
}

export {
  any,
  sequence,
  together,
};
