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

describe('operations on collections of actions', () => {
  let action1;
  let myFunc;
  let value;

  beforeEach(() => {
    myFunc = jest.fn();
    action1 = instantly(myFunc);
  });

  describe('#any', () => {
    let delay1;
    let delay2;

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
    it('handles one action', () => {
      let stringSequence;
      const appendString = (stringToAppend) => {
        return instantly(() => stringSequence += stringToAppend);
      };

      stringSequence = '';

      /* eslint-disable indent */
      actionToPromise(
        appendString('1'),
      ).then(() => expect(stringSequence).toEqual('1'));
      /* eslint-enable indent */
    });

    it('handles two actions', () => {
      let stringSequence;
      const appendString = (stringToAppend) => {
        return instantly(() => stringSequence += stringToAppend);
      };

      stringSequence = '';

      /* eslint-disable indent */
      actionToPromise(
        sequence(
          appendString('1'),
          appendString('2'),
        ),
      ).then(() => expect(stringSequence).toEqual('12'));
      /* eslint-enable indent */
    });

    it('handles three actions', () => {
      let stringSequence;
      const appendString = (stringToAppend) => {
        return instantly(() => stringSequence += stringToAppend);
      };

      stringSequence = '';

      /* eslint-disable indent */
      actionToPromise(
        sequence(
          appendString('1'),
          appendString('2'),
          appendString('3'),
        ),
      ).then(() => expect(stringSequence).toEqual('123'));
      /* eslint-enable indent */
    });

    it('throws a TypeError if one of the actions is not a function', () => {
      const runActionSerially = () => {
        actionToPromise(sequence(5));
      };
      expect(runActionSerially).toThrow();
    });
  });

  describe('#together', () => {
    it('handles one action', () => {
      const myFuncAndNothing = together(action1);
      run(myFuncAndNothing);
      expect(myFunc).toHaveBeenCalled();
    });

    it('handles two actions', () => {
      const mySecondFunc = jest.fn();
      const action2 = instantly(mySecondFunc);
      const putThemTogether = together(action1, action2);
      run(putThemTogether);
      expect(myFunc).toHaveBeenCalled();
      expect(mySecondFunc).toHaveBeenCalled();
    });

    it('handles three actions', () => {
      const mySecondFunc = jest.fn();
      const myThirdFunc = jest.fn();
      const action2 = instantly(mySecondFunc);
      const action3 = instantly(myThirdFunc);
      const putThemTogether = together(action1, action2, action3);
      run(putThemTogether);
      expect(myFunc).toHaveBeenCalled();
      expect(mySecondFunc).toHaveBeenCalled();
      expect(myThirdFunc).toHaveBeenCalled();
    });

    it('resolves when all actions have been resolved', () => {
      let container = 0;

      const myIncrementBy = (value) => {
        return instantly((() => container += value));
      };

      const myDecrementBy = (value) => {
        return instantly((() => container -= value));
      };

      /* eslint-disable indent */
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
      /* eslint-enable indent */

      const expectation = actionToPromise(togetherAction);

      return expectation.then(() => {
        /**
         * Since we sequentially run the actions to make 8, we can assume
         * that the end result is going to be 10, as we add 2 to container.
         */
        expect(container).toEqual(10);
      });
    });

    it('throws a TypeError if one of the actions is not a function', () => {
      const runActionTogether = () => {
        actionToPromise(together(5));
      };
      expect(runActionTogether).toThrow(TypeError);
    });
  });
});
