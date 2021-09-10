/** Convert an action to a promise.
 *
 * Here, we decorate an action, associating it with a promise that allows
 * it to let us know when it has finished running. An action therefore can
 * be asynchronous.
 *
 * Once an action or combination of actions is defined, an
 * `actionToPromise` call is the "prime mover" that causes it to be
 * executed.
 *
 * @param {function} action  - A function that accepts a continuation and an
 *                             initial value.
 *                             The action must call resolve(),
 *                             optionally passing it a value that will be
 *                             returned when the promise resolves.
 *
 *                             The function must first be converted into an
 *                             action through the instantly method defined
 *                             here.
 *
 * @return {Promise}        - A promise object to be resolved on completion
 *                             of the action.
 */
function actionToPromise(action) {
  if (typeof action !== 'function') {
    throw new TypeError('Action argument is not a function');
  }

  return new Promise((resolve) => action(() => resolve()));
}

/** Convert a function into an ActionCombnator action that runs
 * and then immediately calls the continuation.
 *
 * @param {function} func - A JS function that optionally accepts a parameter.
 *
 * @return {action}      -  An action.
 */
function instantly(func, ...args) {
  return (resolve) => {
    func(...args);
    resolve();
  };
}

export {actionToPromise, instantly};
