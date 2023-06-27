import {
  actionToPromise,
  actionToPromise as run,
  instantly,
} from 'core';

import {
  delay,
} from 'timing';

import {
  any,
  sequence,
  together,
} from 'collections';

/**
 * @typedef {import('interfaces').Action} Action
 */

describe('operations on collections of actions', () => {
  /** @type {Action} */
  let action1;

  /** @type {jest.Mock} */
  let myFunc;

  /** @type {string} */
  let value;

  beforeEach(() => {
    myFunc = jest.fn();
    action1 = instantly(myFunc);
  });

  describe('#any', () => {
    /** @type {Action} */
    let delay1;

    /** @type {Action} */
    let delay2;

    /**
     * Return an action, suitable for chaining, that assigns the given arg to
     * `value`.
     * @param {string} arg - The string value to assign to `value`
     * @return {Action} An action that assigns the given string to `value`.
     */
    function setValue(arg) {
      return instantly(() => {
        value = arg;
      });
    }

    beforeEach(() => {
      delay1 = delay(setValue('I got here first'), 1000);
      delay2 = delay(setValue('I got here second'), 2000);
    });

    describe('when it is called with two args', () => {
      it('resolves with the first action to finish', () => {
        actionToPromise(any(delay1, delay2)).then(() => {
          expect(value).toEqual('I got here first');
        });
      });
    });

    it('works with one action', () => {
      run(any(action1));
      expect(myFunc).toHaveBeenCalled();
    });

    it('works with three actions', () => {
      run(any(action1, action1, action1));
      expect(myFunc).toHaveBeenCalled();
    });

    it('works for two actions where the latter ends first', () => {
      value = '';

      actionToPromise(any(delay2, delay1)).then(() => {
        expect(value).toEqual('I got here first');
      });
    });
  });

  describe('#sequence', () => {
    /** @type {string} */
    let stringSequence;

    /**
     * Append a string to stringSequence.
     * @param {string} stringToAppend
     * @return {Action} an action that appends the string
     */
    function appendString(stringToAppend) {
      return instantly(() => stringSequence += stringToAppend);
    };

    beforeEach(() => {
      stringSequence = '';
    });

    it('handles one action', () => {
      actionToPromise(
        appendString('1'),
      ).then(() => expect(stringSequence).toEqual('1'));
    });

    it('handles two actions', () => {
      actionToPromise(
        sequence(
          appendString('1'),
          appendString('2'),
        ),
      ).then(() => expect(stringSequence).toEqual('12'));
    });

    it('handles three actions', () => {
      actionToPromise(
        sequence(
          appendString('1'),
          appendString('2'),
          appendString('3'),
        ),
      ).then(() => expect(stringSequence).toEqual('123'));
    });

    it('throws a TypeError if one of the actions is not a function', () => {
      const runActionSerially = () => {
        // @ts-ignore: Purposely passing arg of wrong type to test error
        actionToPromise(sequence(5));
      };
      expect(runActionSerially).toThrow();
    });
  });

  describe('#together', () => {
    it('handles one action', () => {
      /** @type {Action} */
      const myFuncAndNothing = together(action1);

      run(myFuncAndNothing);
      expect(myFunc).toHaveBeenCalled();
    });

    it('handles two actions', () => {
      /** @type {jest.Mock} */
      const mySecondFunc = jest.fn();

      /** @type {Action} */
      const action2 = instantly(mySecondFunc);

      /** @type {Action} */
      const putThemTogether = together(action1, action2);

      run(putThemTogether);
      expect(myFunc).toHaveBeenCalled();
      expect(mySecondFunc).toHaveBeenCalled();
    });

    it('handles three actions', () => {
      /** @type {jest.Mock} */
      const mySecondFunc = jest.fn();

      /** @type {jest.Mock} */
      const myThirdFunc = jest.fn();

      /** @type {Action} */
      const action2 = instantly(mySecondFunc);

      /** @type {Action} */
      const action3 = instantly(myThirdFunc);

      /** @type {Action} */
      const putThemTogether = together(action1, action2, action3);

      run(putThemTogether);
      expect(myFunc).toHaveBeenCalled();
      expect(mySecondFunc).toHaveBeenCalled();
      expect(myThirdFunc).toHaveBeenCalled();
    });

    it('resolves when all actions have been resolved', async () => {
      let container = 0;

      /**
       * @param {number} value - Value to add to container
       * @return {Action} action that adds value to container
       */
      function myIncrementBy(value) {
        return instantly((() => container += value));
      };

      /**
       * @param {number} value - Value to subtract from container
       * @return {Action} action that subtracts value from container
       */
      function myDecrementBy(value) {
        return instantly((() => container -= value));
      };

      /** @type {Action} */
      const togetherAction = together(
        sequence(
          myIncrementBy(2), // 0 + 2
          myIncrementBy(6), // 2 + 6
          myDecrementBy(4), // 8 - 4
          delay(myIncrementBy(4), 100), // wait 100 ms, then 4 + 4
        ),
        myIncrementBy(0), // Noop
        myDecrementBy(0), // Another noop
        delay(myIncrementBy(2), 500), // wait 100, then container + 2
      );

      await actionToPromise(togetherAction);

      /**
       * Since we sequentially run the actions to make 8, we can assume
       * that the end result is going to be 10, as we add 2 to container.
       */
      expect(container).toEqual(10);
    });

    it('throws a TypeError if one of the actions is not a function', () => {
      const runActionTogether = () => {
        // @ts-ignore: Purposely passing arg of wrong type to test error
        actionToPromise(together(5));
      };
      expect(runActionTogether).toThrow(TypeError);
    });
  });
});
