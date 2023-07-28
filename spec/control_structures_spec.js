import {
  actionToPromise as run,
  instantly,
} from 'core';

import {
  branch,
  repeatUntil,
  repeatWhile,
  unless,
  when,
} from 'control_structures';

/** @typedef {import('interfaces').Action} Action */
/** @typedef {import('interfaces').Predicate} Predicate */

describe('control structures', () => {
  /** @type {jest.Mock} */
  let alternateSpy;

  /** @type {Action} */
  let alternate;

  /** @type {Action} */
  let consequent;

  /** @type {jest.Mock} */
  let consequentSpy;

  /** @type {Action} */
  let myBranch;

  /** @type {Predicate} */
  let predicate;

  /** @type {number} */
  let value;

  beforeEach(() => {
    consequentSpy = jest.fn();
    consequent = instantly(consequentSpy);
    alternateSpy = jest.fn();
    alternate = instantly(alternateSpy);
    predicate = () => {
      return (value % 2 === 0);
    };
    myBranch = branch(predicate, consequent, alternate);
  });

  describe('#branch', () => {
    it('does the consequent if the predicate is true', () => {
      value = 0;
      run(myBranch);
      expect(consequentSpy).toHaveBeenCalled();
      expect(alternateSpy).not.toHaveBeenCalled();
    });

    it('does the alternate if the predicate is false', () => {
      value = 1;
      run(myBranch);
      expect(consequentSpy).not.toHaveBeenCalled();
      expect(alternateSpy).toHaveBeenCalled();
    });
  });

  describe('#unless', () => {
    it('does the consequent when the predicate is true', () => {
      value = 0;
      run(unless(predicate, consequent));
      expect(consequentSpy).not.toHaveBeenCalled();
    });

    it('does nothing if the predicate is false', () => {
      value = 1;
      run(unless(predicate, consequent));
      expect(consequentSpy).toHaveBeenCalled();
    });
  });

  describe('#when', () => {
    it('does the consequent when the predicate is true', () => {
      value = 0;
      run(when(predicate, consequent));
      expect(consequentSpy).toHaveBeenCalled();
    });

    it('does nothing if the predicate is false', () => {
      value = 1;
      run(when(predicate, consequent));
      expect(consequentSpy).not.toHaveBeenCalled();
    });
  });

  describe('For looping', () => {
    /** @type {Action} */
    let action;

    /**
     * @param {number} addend - number to add to value
     * @return {Action} action that adds addend to value
     */
    function addValue(addend) {
      return instantly(() => {
        value += addend;
      });
    }

    beforeEach(() => {
      value = 1;
      action = addValue(1);
    });

    describe('#repeatWhile', () => {
      it('terminates when predicate is false, returning expected value', () => {
        predicate = () => {
          return value % 3 !== 0;
        };
        run(repeatWhile(predicate, action));
        expect(value).toEqual(3);
      });
    });

    describe('#repeatUntil', () => {
      it('terminates when predicate is true, returning expected value', () => {
        predicate = () => {
          return value % 3 === 0;
        };
        run(repeatUntil(predicate, action));
        expect(value).toEqual(3);
      });
    });
  });
});
