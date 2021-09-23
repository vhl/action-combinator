import {
  addHandler,
  removeHandler,
} from 'handlers';

import {
  actionToPromise as run,
} from 'core';

import $ from 'jquery';

describe('handlers', function() {
  /** @type {jest.Mock} */
  let myHandler;

  beforeEach(function() {
    myHandler = jest.fn();
    document.body.innerHTML = '<div class="foo"></div>';
  });

  describe('#addHandler', function() {
    it(
      `
      adds a given handler for a given event to an element matching a given
      selector
      `,
      function() {
        run(addHandler('.foo', 'bar', myHandler));
        $('.foo').trigger('bar');
        expect(myHandler).toHaveBeenCalled();
      },
    );
  });

  describe('#removeHandler', function() {
    it(
      `
      removes the handler for a given event from an element matching a given
      selector
      `,
      function() {
        $('.foo').on('bar', myHandler);
        run(removeHandler('.foo', 'bar'));
        $('.foo').trigger('bar');
        expect(myHandler).not.toHaveBeenCalled();
      },
    );
  });
});
