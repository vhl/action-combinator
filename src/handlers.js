import $ from 'jquery';

/**
 * @typedef {import('interfaces').Action} Action
 */

/** Create an action that adds a given handler for a given event to
 * elements matching a given selector. AddHandler is not resolved until the
 * event occurs.
 *
 * @param {string} selector  A selector for the element(s) to add an event
 *                           listener to.
 * @param {string} event     The event name for the event listener.
 * @param {Function} handler The "handler" for the event: actually, it will be
 *                           wrapped by the function that is returned by
 *                           addHandler.
 * @return {Action}        An action that binds the event to an anonymous
 *                           function. The anonymous function calls `handler`,
 *                           then resolves.
 */
function addHandler(selector, event, handler) {
  return (resolve) => {
    // We need jQuery here, because it handles pretty well the cases where the
    // event is not an standard one.
    $(selector).on(event, (e) => {
      /* The handler can access the event object. */
      handler(e);
      resolve();
    });
  };
}


/** Create an action that removes handlers for a given event from elements
 * matching a given selector.
 *
 * @param {string} selector  A selector for the element(s) from which to remove
 *                           the event listener.
 * @param {string} event     The event name for the event listener.
 * @return {Action}        An action that removes handlers for the event
 *                           from elements matching the selector, then
 *                           resolves.
 */
function removeHandler(selector, event) {
  return (resolve) => {
    // Because we add events with jQuery, we need to remove it with jQuery too.
    $(selector).off(event);
    resolve();
  };
}

/** Create an action that adds a given click handler to elements matching
 * a given selector.
 * @param {string} selector  A selector for the element(s) to add the 'click'
 *                           event listener to.
 * @param {Function} handler The "handler" for the event: actually, it will be
 *                           wrapped by the function that is returned by
 *                           clickHandler.
 * @return {Action}          An action that binds the event to an anonymous
 *                           function. The anonymous function calls `handler`,
 *                           then resolves.
 */
function clickHandler(selector, handler) {
  return addHandler(selector, 'click', handler);
}

export {
  addHandler,
  clickHandler,
  removeHandler,
};
