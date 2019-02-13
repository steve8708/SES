import test from 'tape';
import { SES } from '../src/index';

test('SES environment lacks require by default', t => {
  const s = SES.makeSESRootRealm();
  t.equal(typeof s.global.require, 'undefined');
  t.end();
});

test('SES environment can have require(nat)', t => {
  const s = SES.makeSESRootRealm({requireMode: 'allow', errorStackMode: 'allow', consoleMode: 'allow'});
  t.notEqual(typeof s.global.require, 'undefined');
  function check() {
    const Nat = require('nat');
    //console.log(`Nat is ${typeof Nat}`);
    const n = x => Nat(x); // eslint-disable-line no-undef
    return { n, Nat };
  }
  //console.log(`REQ src is ${check}`);
  const { n, Nat: n2 } = s.evaluate(`(${check})()`);
  //console.log(`Nat is ${typeof n2}`);
  t.equal(typeof n2, 'function');
  t.equal(n(0), 0);
  t.equal(n(1), 1);
  t.equal(n(999), 999);
  t.equal(n((2**53)-1), (2**53)-1);
  t.throws(() => n('not a number'), s.global.RangeError);
  t.throws(() => n(-1), s.global.RangeError);
  t.throws(() => n(0.5), s.global.RangeError);
  t.throws(() => n(2 ** 53), s.global.RangeError);
  t.throws(() => n(2 ** 60), s.global.RangeError);
  t.throws(() => n(NaN), s.global.RangeError);
  t.end();
});
