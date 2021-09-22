import {
  actionToPromise,
  instantly,
} from 'core';

/**
 * @typedef {import('interfaces').Action} Action
 */

describe('core methods', () => {
  /** @type {Action} */
  let action1;

  /** @type {jest.Mock} */
  let myFunc;

  beforeEach(() => {
    myFunc = jest.fn();
    action1 = instantly(myFunc);
  });

  describe('#actionToPromise', () => {
    it('runs an action that is passed to it', () => {
      actionToPromise(action1);
      expect(myFunc).toHaveBeenCalled();
    });

    it('throws a TypeError if action is not a function', () => {
      const notFunctionThing = 5;
      const runAction = () => {
        // @ts-ignore: Purposely passing arg of wrong type to test error
        actionToPromise(notFunctionThing);
      };
      expect(runAction).toThrow(TypeError);
    });
  });

  describe('#instantly', () => {
    describe('given a function', () => {
      it(
        `
          returns an action that runs the given function
          and the callback passed to it
        `,
        () => {
          const func1 = jest.fn();
          const func2 = jest.fn();
          const action = instantly(func1);
          action(func2);
          expect(func1).toHaveBeenCalled();
          expect(func2).toHaveBeenCalled();
        },
      );
    });
  });
});
