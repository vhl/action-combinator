import {
  actionToPromise,
  instantly,
} from 'core';

import {
  delay,
} from 'timing';

describe('adding timeouts to actions', () => {
  describe('#delay', () => {
    it('does something', () => {
      jest.useFakeTimers('legacy');

      const delayFunction = jest.fn();
      const anAction = instantly(delayFunction);

      const timeNow = Date.now();
      const delayPromise = actionToPromise(delay(anAction, 1000));

      /* eslint-disable indent */
      expect(setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        1000,
      );
      /* eslint-enable indent */

      delayPromise.then(() => {
        expect(Date.now() - timeNow).toBeGreaterThan(900);
        expect(delayFunction).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });
  });
});
