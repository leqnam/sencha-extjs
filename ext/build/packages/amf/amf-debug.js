var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = false;
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || typeof Object.defineProperties == 'function' ? Object.defineProperty : function(target, property, descriptor) {
  descriptor = descriptor;
  if (target == Array.prototype || target == Object.prototype) {
    return;
  }
  target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
  return typeof window != 'undefined' && window === maybeGlobal ? maybeGlobal : typeof global != 'undefined' && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  if (!polyfill) {
    return;
  }
  var obj = $jscomp.global;
  var split = target.split('.');
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  var property = split[split.length - 1];
  var orig = obj[property];
  var impl = polyfill(orig);
  if (impl == orig || impl == null) {
    return;
  }
  $jscomp.defineProperty(obj, property, {configurable:true, writable:true, value:impl});
};
$jscomp.polyfill('Array.prototype.copyWithin', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, start, opt_end) {
    var len = this.length;
    target = Number(target);
    start = Number(start);
    opt_end = Number(opt_end != null ? opt_end : len);
    if (target < start) {
      opt_end = Math.min(opt_end, len);
      while (start < opt_end) {
        if (start in this) {
          this[target++] = this[start++];
        } else {
          delete this[target++];
          start++;
        }
      }
    } else {
      opt_end = Math.min(opt_end, len + start - target);
      target += opt_end - start;
      while (opt_end > start) {
        if (--opt_end in this) {
          this[--target] = this[opt_end];
        } else {
          delete this[target];
        }
      }
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  if (!$jscomp.global['Symbol']) {
    $jscomp.global['Symbol'] = $jscomp.Symbol;
  }
};
$jscomp.Symbol = function() {
  var counter = 0;
  function Symbol(opt_description) {
    return $jscomp.SYMBOL_PREFIX + (opt_description || '') + counter++;
  }
  return Symbol;
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global['Symbol'].iterator;
  if (!symbolIterator) {
    symbolIterator = $jscomp.global['Symbol'].iterator = $jscomp.global['Symbol']('iterator');
  }
  if (typeof Array.prototype[symbolIterator] != 'function') {
    $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:true, writable:true, value:function() {
      return $jscomp.arrayIterator(this);
    }});
  }
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    if (index < array.length) {
      return {done:false, value:array[index++]};
    } else {
      return {done:true};
    }
  });
};
$jscomp.iteratorPrototype = function(next) {
  $jscomp.initSymbolIterator();
  var iterator = {next:next};
  iterator[$jscomp.global['Symbol'].iterator] = function() {
    return this;
  };
  return iterator;
};
$jscomp.iteratorFromArray = function(array, transform) {
  $jscomp.initSymbolIterator();
  if (array instanceof String) {
    array = array + '';
  }
  var i = 0;
  var iter = {next:function() {
    if (i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:false};
    }
    iter.next = function() {
      return {done:true, value:void 0};
    };
    return iter.next();
  }};
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill('Array.prototype.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i, v) {
      return [i, v];
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.fill', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(value, opt_start, opt_end) {
    var length = this.length || 0;
    if (opt_start < 0) {
      opt_start = Math.max(0, length + opt_start);
    }
    if (opt_end == null || opt_end > length) {
      opt_end = length;
    }
    opt_end = Number(opt_end);
    if (opt_end < 0) {
      opt_end = Math.max(0, length + opt_end);
    }
    for (var i = Number(opt_start || 0); i < opt_end; i++) {
      this[i] = value;
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.findInternal = function(array, callback, thisArg) {
  if (array instanceof String) {
    array = String(array);
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var value = array[i];
    if (callback.call(thisArg, value, i, array)) {
      return {i:i, v:value};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill('Array.prototype.find', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).v;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.findIndex', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).i;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.from', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
    $jscomp.initSymbolIterator();
    opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) {
      return x;
    };
    var result = [];
    var iteratorFunction = arrayLike[Symbol.iterator];
    if (typeof iteratorFunction == 'function') {
      arrayLike = iteratorFunction.call(arrayLike);
      var next;
      var k = 0;
      while (!(next = arrayLike.next()).done) {
        result.push(opt_mapFn.call(opt_thisArg, next.value, k++));
      }
    } else {
      var len = arrayLike.length;
      for (var i = 0; i < len; i++) {
        result.push(opt_mapFn.call(opt_thisArg, arrayLike[i], i));
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.is', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(left, right) {
    if (left === right) {
      return left !== 0 || 1 / left === 1 / right;
    } else {
      return left !== left && right !== right;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var includes = function(searchElement, opt_fromIndex) {
    var array = this;
    if (array instanceof String) {
      array = String(array);
    }
    var len = array.length;
    var i = opt_fromIndex || 0;
    if (i < 0) {
      i = Math.max(i + len, 0);
    }
    for (; i < len; i++) {
      var element = array[i];
      if (element === searchElement || Object.is(element, searchElement)) {
        return true;
      }
    }
    return false;
  };
  return includes;
}, 'es7', 'es3');
$jscomp.polyfill('Array.prototype.keys', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.of', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    return Array.from(arguments);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.values', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(k, v) {
      return v;
    });
  };
  return polyfill;
}, 'es8', 'es3');
$jscomp.makeIterator = function(iterable) {
  $jscomp.initSymbolIterator();
  var iteratorFunction = iterable[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator(iterable);
};
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill('Promise', function(NativePromise) {
  if (NativePromise && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return NativePromise;
  }
  function AsyncExecutor() {
    this.batch_ = null;
  }
  AsyncExecutor.prototype.asyncExecute = function(f) {
    if (this.batch_ == null) {
      this.batch_ = [];
      this.asyncExecuteBatch_();
    }
    this.batch_.push(f);
    return this;
  };
  AsyncExecutor.prototype.asyncExecuteBatch_ = function() {
    var self = this;
    this.asyncExecuteFunction(function() {
      self.executeBatch_();
    });
  };
  var nativeSetTimeout = $jscomp.global['setTimeout'];
  AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
    nativeSetTimeout(f, 0);
  };
  AsyncExecutor.prototype.executeBatch_ = function() {
    while (this.batch_ && this.batch_.length) {
      var executingBatch = this.batch_;
      this.batch_ = [];
      for (var i = 0; i < executingBatch.length; ++i) {
        var f = executingBatch[i];
        executingBatch[i] = null;
        try {
          f();
        } catch (error) {
          this.asyncThrow_(error);
        }
      }
    }
    this.batch_ = null;
  };
  AsyncExecutor.prototype.asyncThrow_ = function(exception) {
    this.asyncExecuteFunction(function() {
      throw exception;
    });
  };
  var PromiseState = {PENDING:0, FULFILLED:1, REJECTED:2};
  var PolyfillPromise = function(executor) {
    this.state_ = PromiseState.PENDING;
    this.result_ = undefined;
    this.onSettledCallbacks_ = [];
    var resolveAndReject = this.createResolveAndReject_();
    try {
      executor(resolveAndReject.resolve, resolveAndReject.reject);
    } catch (e) {
      resolveAndReject.reject(e);
    }
  };
  PolyfillPromise.prototype.createResolveAndReject_ = function() {
    var thisPromise = this;
    var alreadyCalled = false;
    function firstCallWins(method) {
      return function(x) {
        if (!alreadyCalled) {
          alreadyCalled = true;
          method.call(thisPromise, x);
        }
      };
    }
    return {resolve:firstCallWins(this.resolveTo_), reject:firstCallWins(this.reject_)};
  };
  PolyfillPromise.prototype.resolveTo_ = function(value) {
    if (value === this) {
      this.reject_(new TypeError('A Promise cannot resolve to itself'));
    } else {
      if (value instanceof PolyfillPromise) {
        this.settleSameAsPromise_(value);
      } else {
        if (isObject(value)) {
          this.resolveToNonPromiseObj_(value);
        } else {
          this.fulfill_(value);
        }
      }
    }
  };
  PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
    var thenMethod = undefined;
    try {
      thenMethod = obj.then;
    } catch (error) {
      this.reject_(error);
      return;
    }
    if (typeof thenMethod == 'function') {
      this.settleSameAsThenable_(thenMethod, obj);
    } else {
      this.fulfill_(obj);
    }
  };
  function isObject(value) {
    switch(typeof value) {
      case 'object':
        return value != null;
      case 'function':
        return true;
      default:
        return false;
    }
  }
  PolyfillPromise.prototype.reject_ = function(reason) {
    this.settle_(PromiseState.REJECTED, reason);
  };
  PolyfillPromise.prototype.fulfill_ = function(value) {
    this.settle_(PromiseState.FULFILLED, value);
  };
  PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
    if (this.state_ != PromiseState.PENDING) {
      throw new Error('Cannot settle(' + settledState + ', ' + valueOrReason + '): Promise already settled in state' + this.state_);
    }
    this.state_ = settledState;
    this.result_ = valueOrReason;
    this.executeOnSettledCallbacks_();
  };
  PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
    if (this.onSettledCallbacks_ != null) {
      for (var i = 0; i < this.onSettledCallbacks_.length; ++i) {
        asyncExecutor.asyncExecute(this.onSettledCallbacks_[i]);
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var asyncExecutor = new AsyncExecutor;
  PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
    var methods = this.createResolveAndReject_();
    promise.callWhenSettled_(methods.resolve, methods.reject);
  };
  PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
    var methods = this.createResolveAndReject_();
    try {
      thenMethod.call(thenable, methods.resolve, methods.reject);
    } catch (error) {
      methods.reject(error);
    }
  };
  PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
    var resolveChild;
    var rejectChild;
    var childPromise = new PolyfillPromise(function(resolve, reject) {
      resolveChild = resolve;
      rejectChild = reject;
    });
    function createCallback(paramF, defaultF) {
      if (typeof paramF == 'function') {
        return function(x) {
          try {
            resolveChild(paramF(x));
          } catch (error) {
            rejectChild(error);
          }
        };
      } else {
        return defaultF;
      }
    }
    this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
    return childPromise;
  };
  PolyfillPromise.prototype['catch'] = function(onRejected) {
    return this.then(undefined, onRejected);
  };
  PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
    var thisPromise = this;
    function callback() {
      switch(thisPromise.state_) {
        case PromiseState.FULFILLED:
          onFulfilled(thisPromise.result_);
          break;
        case PromiseState.REJECTED:
          onRejected(thisPromise.result_);
          break;
        default:
          throw new Error('Unexpected state: ' + thisPromise.state_);
      }
    }
    if (this.onSettledCallbacks_ == null) {
      asyncExecutor.asyncExecute(callback);
    } else {
      this.onSettledCallbacks_.push(callback);
    }
  };
  function resolvingPromise(opt_value) {
    if (opt_value instanceof PolyfillPromise) {
      return opt_value;
    } else {
      return new PolyfillPromise(function(resolve, reject) {
        resolve(opt_value);
      });
    }
  }
  PolyfillPromise['resolve'] = resolvingPromise;
  PolyfillPromise['reject'] = function(opt_reason) {
    return new PolyfillPromise(function(resolve, reject) {
      reject(opt_reason);
    });
  };
  PolyfillPromise['race'] = function(thenablesOrValues) {
    return new PolyfillPromise(function(resolve, reject) {
      var iterator = $jscomp.makeIterator(thenablesOrValues);
      for (var iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
        resolvingPromise(iterRec.value).callWhenSettled_(resolve, reject);
      }
    });
  };
  PolyfillPromise['all'] = function(thenablesOrValues) {
    var iterator = $jscomp.makeIterator(thenablesOrValues);
    var iterRec = iterator.next();
    if (iterRec.done) {
      return resolvingPromise([]);
    } else {
      return new PolyfillPromise(function(resolveAll, rejectAll) {
        var resultsArray = [];
        var unresolvedCount = 0;
        function onFulfilled(i) {
          return function(ithResult) {
            resultsArray[i] = ithResult;
            unresolvedCount--;
            if (unresolvedCount == 0) {
              resolveAll(resultsArray);
            }
          };
        }
        do {
          resultsArray.push(undefined);
          unresolvedCount++;
          resolvingPromise(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll);
          iterRec = iterator.next();
        } while (!iterRec.done);
      });
    }
  };
  return PolyfillPromise;
}, 'es6', 'es3');
$jscomp.polyfill('Promise.prototype.finally', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(onFinally) {
    return this.then(function(value) {
      var promise = Promise.resolve(onFinally());
      return promise.then(function() {
        return value;
      });
    }, function(reason) {
      var promise = Promise.resolve(onFinally());
      return promise.then(function() {
        throw reason;
      });
    });
  };
  return polyfill;
}, 'es9', 'es3');
$jscomp.underscoreProtoCanBeSet = function() {
  var x = {a:true};
  var y = {};
  try {
    y.__proto__ = x;
    return y.a;
  } catch (e) {
  }
  return false;
};
$jscomp.setPrototypeOf = typeof Object.setPrototypeOf == 'function' ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(target, proto) {
  target.__proto__ = proto;
  if (target.__proto__ !== proto) {
    throw new TypeError(target + ' is not extensible');
  }
  return target;
} : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(result) {
  if (result instanceof Object) {
    return;
  }
  throw new TypeError('Iterator result ' + result + ' is not an object');
};
$jscomp.generator.Context = function() {
  this.isRunning_ = false;
  this.yieldAllIterator_ = null;
  this.yieldResult = undefined;
  this.nextAddress = 1;
  this.catchAddress_ = 0;
  this.finallyAddress_ = 0;
  this.abruptCompletion_ = null;
  this.finallyContexts_ = null;
};
$jscomp.generator.Context.prototype.start_ = function() {
  if (this.isRunning_) {
    throw new TypeError('Generator is already running');
  }
  this.isRunning_ = true;
};
$jscomp.generator.Context.prototype.stop_ = function() {
  this.isRunning_ = false;
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
$jscomp.generator.Context.prototype.next_ = function(value) {
  this.yieldResult = value;
};
$jscomp.generator.Context.prototype.throw_ = function(e) {
  this.abruptCompletion_ = {exception:e, isException:true};
  this.jumpToErrorHandler_();
};
$jscomp.generator.Context.prototype['return'] = function(value) {
  this.abruptCompletion_ = {'return':value};
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(nextAddress) {
  this.abruptCompletion_ = {jumpTo:nextAddress};
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.yield = function(value, resumeAddress) {
  this.nextAddress = resumeAddress;
  return {value:value};
};
$jscomp.generator.Context.prototype.yieldAll = function(iterable, resumeAddress) {
  var iterator = $jscomp.makeIterator(iterable);
  var result = iterator.next();
  $jscomp.generator.ensureIteratorResultIsObject_(result);
  if (result.done) {
    this.yieldResult = result.value;
    this.nextAddress = resumeAddress;
    return;
  }
  this.yieldAllIterator_ = iterator;
  return this.yield(result.value, resumeAddress);
};
$jscomp.generator.Context.prototype.jumpTo = function(nextAddress) {
  this.nextAddress = nextAddress;
};
$jscomp.generator.Context.prototype.jumpToEnd = function() {
  this.nextAddress = 0;
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(catchAddress, finallyAddress) {
  this.catchAddress_ = catchAddress;
  if (finallyAddress != undefined) {
    this.finallyAddress_ = finallyAddress;
  }
};
$jscomp.generator.Context.prototype.setFinallyBlock = function(finallyAddress) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = finallyAddress || 0;
};
$jscomp.generator.Context.prototype.leaveTryBlock = function(nextAddress, catchAddress) {
  this.nextAddress = nextAddress;
  this.catchAddress_ = catchAddress || 0;
};
$jscomp.generator.Context.prototype.enterCatchBlock = function(nextCatchBlockAddress) {
  this.catchAddress_ = nextCatchBlockAddress || 0;
  var exception = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return exception;
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function(nextCatchAddress, nextFinallyAddress, finallyDepth) {
  if (!finallyDepth) {
    this.finallyContexts_ = [this.abruptCompletion_];
  } else {
    this.finallyContexts_[finallyDepth] = this.abruptCompletion_;
  }
  this.catchAddress_ = nextCatchAddress || 0;
  this.finallyAddress_ = nextFinallyAddress || 0;
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(nextAddress, finallyDepth) {
  var preservedContext = this.finallyContexts_.splice(finallyDepth || 0)[0];
  var abruptCompletion = this.abruptCompletion_ = this.abruptCompletion_ || preservedContext;
  if (abruptCompletion) {
    if (abruptCompletion.isException) {
      return this.jumpToErrorHandler_();
    }
    if (abruptCompletion.jumpTo != undefined && this.finallyAddress_ < abruptCompletion.jumpTo) {
      this.nextAddress = abruptCompletion.jumpTo;
      this.abruptCompletion_ = null;
    } else {
      this.nextAddress = this.finallyAddress_;
    }
  } else {
    this.nextAddress = nextAddress;
  }
};
$jscomp.generator.Context.prototype.forIn = function(object) {
  return new $jscomp.generator.Context.PropertyIterator(object);
};
$jscomp.generator.Context.PropertyIterator = function(object) {
  this.object_ = object;
  this.properties_ = [];
  for (var property in object) {
    this.properties_.push(property);
  }
  this.properties_.reverse();
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
  while (this.properties_.length > 0) {
    var property = this.properties_.pop();
    if (property in this.object_) {
      return property;
    }
  }
  return null;
};
$jscomp.generator.Engine_ = function(program) {
  this.context_ = new $jscomp.generator.Context;
  this.program_ = program;
};
$jscomp.generator.Engine_.prototype.next_ = function(value) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_.next, value, this.context_.next_);
  }
  this.context_.next_(value);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.return_ = function(value) {
  this.context_.start_();
  var yieldAllIterator = this.context_.yieldAllIterator_;
  if (yieldAllIterator) {
    var returnFunction = 'return' in yieldAllIterator ? yieldAllIterator['return'] : function(v) {
      return {value:v, done:true};
    };
    return this.yieldAllStep_(returnFunction, value, this.context_['return']);
  }
  this.context_['return'](value);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.throw_ = function(exception) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_['throw'], exception, this.context_.next_);
  }
  this.context_.throw_(exception);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(action, value, nextAction) {
  try {
    var result = action.call(this.context_.yieldAllIterator_, value);
    $jscomp.generator.ensureIteratorResultIsObject_(result);
    if (!result.done) {
      this.context_.stop_();
      return result;
    }
    var resultValue = result.value;
  } catch (e) {
    this.context_.yieldAllIterator_ = null;
    this.context_.throw_(e);
    return this.nextStep_();
  }
  this.context_.yieldAllIterator_ = null;
  nextAction.call(this.context_, resultValue);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
  while (this.context_.nextAddress) {
    try {
      var yieldValue = this.program_(this.context_);
      if (yieldValue) {
        this.context_.stop_();
        return {value:yieldValue.value, done:false};
      }
    } catch (e) {
      this.context_.yieldResult = undefined;
      this.context_.throw_(e);
    }
  }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    var abruptCompletion = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (abruptCompletion.isException) {
      throw abruptCompletion.exception;
    }
    return {value:abruptCompletion['return'], done:true};
  }
  return {value:undefined, done:true};
};
$jscomp.generator.Generator_ = function(engine) {
  this.next = function(opt_value) {
    return engine.next_(opt_value);
  };
  this['throw'] = function(exception) {
    return engine.throw_(exception);
  };
  this['return'] = function(value) {
    return engine.return_(value);
  };
  $jscomp.initSymbolIterator();
  this[Symbol.iterator] = function() {
    return this;
  };
};
$jscomp.generator.createGenerator = function(generator, program) {
  var result = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(program));
  if ($jscomp.setPrototypeOf) {
    $jscomp.setPrototypeOf(result, generator.prototype);
  }
  return result;
};
$jscomp.asyncExecutePromiseGenerator = function(generator) {
  function passValueToGenerator(value) {
    return generator.next(value);
  }
  function passErrorToGenerator(error) {
    return generator['throw'](error);
  }
  return new Promise(function(resolve, reject) {
    function handleGeneratorRecord(genRec) {
      if (genRec.done) {
        resolve(genRec.value);
      } else {
        Promise.resolve(genRec.value).then(passValueToGenerator, passErrorToGenerator).then(handleGeneratorRecord, reject);
      }
    }
    handleGeneratorRecord(generator.next());
  });
};
$jscomp.asyncExecutePromiseGeneratorFunction = function(generatorFunction) {
  return $jscomp.asyncExecutePromiseGenerator(generatorFunction());
};
$jscomp.asyncExecutePromiseGeneratorProgram = function(program) {
  return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(program)));
};
$jscomp.checkEs6ConformanceViaProxy = function() {
  try {
    var proxied = {};
    var proxy = Object.create(new $jscomp.global['Proxy'](proxied, {'get':function(target, key, receiver) {
      return target == proxied && key == 'q' && receiver == proxy;
    }}));
    return proxy['q'] === true;
  } catch (err) {
    return false;
  }
};
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = false;
$jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
$jscomp.owns = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill('WeakMap', function(NativeWeakMap) {
  function isConformant() {
    if (!NativeWeakMap || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var map = new NativeWeakMap([[x, 2], [y, 3]]);
      if (map.get(x) != 2 || map.get(y) != 3) {
        return false;
      }
      map['delete'](x);
      map.set(y, 4);
      return !map.has(x) && map.get(y) == 4;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeWeakMap && $jscomp.ES6_CONFORMANCE) {
      return NativeWeakMap;
    }
  } else {
    if (isConformant()) {
      return NativeWeakMap;
    }
  }
  var prop = '$jscomp_hidden_' + Math.random();
  function insert(target) {
    if (!$jscomp.owns(target, prop)) {
      var obj = {};
      $jscomp.defineProperty(target, prop, {value:obj});
    }
  }
  function patch(name) {
    var prev = Object[name];
    if (prev) {
      Object[name] = function(target) {
        insert(target);
        return prev(target);
      };
    }
  }
  patch('freeze');
  patch('preventExtensions');
  patch('seal');
  var index = 0;
  var PolyfillWeakMap = function(opt_iterable) {
    this.id_ = (index += Math.random() + 1).toString();
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillWeakMap.prototype.set = function(key, value) {
    insert(key);
    if (!$jscomp.owns(key, prop)) {
      throw new Error('WeakMap key fail: ' + key);
    }
    key[prop][this.id_] = value;
    return this;
  };
  PolyfillWeakMap.prototype.get = function(key) {
    return $jscomp.owns(key, prop) ? key[prop][this.id_] : undefined;
  };
  PolyfillWeakMap.prototype.has = function(key) {
    return $jscomp.owns(key, prop) && $jscomp.owns(key[prop], this.id_);
  };
  PolyfillWeakMap.prototype['delete'] = function(key) {
    if (!$jscomp.owns(key, prop) || !$jscomp.owns(key[prop], this.id_)) {
      return false;
    }
    return delete key[prop][this.id_];
  };
  return PolyfillWeakMap;
}, 'es6', 'es3');
$jscomp.MapEntry = function() {
  this.previous;
  this.next;
  this.head;
  this.key;
  this.value;
};
$jscomp.polyfill('Map', function(NativeMap) {
  function isConformant() {
    if ($jscomp.ASSUME_NO_NATIVE_MAP || !NativeMap || typeof NativeMap != 'function' || !NativeMap.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeMap = NativeMap;
      var key = Object.seal({x:4});
      var map = new NativeMap($jscomp.makeIterator([[key, 's']]));
      if (map.get(key) != 's' || map.size != 1 || map.get({x:4}) || map.set({x:4}, 't') != map || map.size != 2) {
        return false;
      }
      var iter = map.entries();
      var item = iter.next();
      if (item.done || item.value[0] != key || item.value[1] != 's') {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0].x != 4 || item.value[1] != 't' || !iter.next().done) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeMap && $jscomp.ES6_CONFORMANCE) {
      return NativeMap;
    }
  } else {
    if (isConformant()) {
      return NativeMap;
    }
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var idMap = new WeakMap;
  var PolyfillMap = function(opt_iterable) {
    this.data_ = {};
    this.head_ = createHead();
    this.size = 0;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillMap.prototype.set = function(key, value) {
    key = key === 0 ? 0 : key;
    var r = maybeGetEntry(this, key);
    if (!r.list) {
      r.list = this.data_[r.id] = [];
    }
    if (!r.entry) {
      r.entry = {next:this.head_, previous:this.head_.previous, head:this.head_, key:key, value:value};
      r.list.push(r.entry);
      this.head_.previous.next = r.entry;
      this.head_.previous = r.entry;
      this.size++;
    } else {
      r.entry.value = value;
    }
    return this;
  };
  PolyfillMap.prototype['delete'] = function(key) {
    var r = maybeGetEntry(this, key);
    if (r.entry && r.list) {
      r.list.splice(r.index, 1);
      if (!r.list.length) {
        delete this.data_[r.id];
      }
      r.entry.previous.next = r.entry.next;
      r.entry.next.previous = r.entry.previous;
      r.entry.head = null;
      this.size--;
      return true;
    }
    return false;
  };
  PolyfillMap.prototype.clear = function() {
    this.data_ = {};
    this.head_ = this.head_.previous = createHead();
    this.size = 0;
  };
  PolyfillMap.prototype.has = function(key) {
    return !!maybeGetEntry(this, key).entry;
  };
  PolyfillMap.prototype.get = function(key) {
    var entry = maybeGetEntry(this, key).entry;
    return entry && entry.value;
  };
  PolyfillMap.prototype.entries = function() {
    return makeIterator(this, function(entry) {
      return [entry.key, entry.value];
    });
  };
  PolyfillMap.prototype.keys = function() {
    return makeIterator(this, function(entry) {
      return entry.key;
    });
  };
  PolyfillMap.prototype.values = function() {
    return makeIterator(this, function(entry) {
      return entry.value;
    });
  };
  PolyfillMap.prototype.forEach = function(callback, opt_thisArg) {
    var iter = this.entries();
    var item;
    while (!(item = iter.next()).done) {
      var entry = item.value;
      callback.call(opt_thisArg, entry[1], entry[0], this);
    }
  };
  PolyfillMap.prototype[Symbol.iterator] = PolyfillMap.prototype.entries;
  var maybeGetEntry = function(map, key) {
    var id = getId(key);
    var list = map.data_[id];
    if (list && $jscomp.owns(map.data_, id)) {
      for (var index = 0; index < list.length; index++) {
        var entry = list[index];
        if (key !== key && entry.key !== entry.key || key === entry.key) {
          return {id:id, list:list, index:index, entry:entry};
        }
      }
    }
    return {id:id, list:list, index:-1, entry:undefined};
  };
  var makeIterator = function(map, func) {
    var entry = map.head_;
    return $jscomp.iteratorPrototype(function() {
      if (entry) {
        while (entry.head != map.head_) {
          entry = entry.previous;
        }
        while (entry.next != entry.head) {
          entry = entry.next;
          return {done:false, value:func(entry)};
        }
        entry = null;
      }
      return {done:true, value:void 0};
    });
  };
  var createHead = function() {
    var head = {};
    head.previous = head.next = head.head = head;
    return head;
  };
  var mapIndex = 0;
  var getId = function(obj) {
    var type = obj && typeof obj;
    if (type == 'object' || type == 'function') {
      obj = obj;
      if (!idMap.has(obj)) {
        var id = '' + ++mapIndex;
        idMap.set(obj, id);
        return id;
      }
      return idMap.get(obj);
    }
    return 'p_' + obj;
  };
  return PolyfillMap;
}, 'es6', 'es3');
$jscomp.polyfill('Math.acosh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return Math.log(x + Math.sqrt(x * x - 1));
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.asinh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log1p', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < 0.25 && x > -0.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      var s = 1;
      while (zPrev != z) {
        y *= x;
        s *= -1;
        z = (zPrev = z) + s * y / ++d;
      }
      return z;
    }
    return Math.log(1 + x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.atanh', function(orig) {
  if (orig) {
    return orig;
  }
  var log1p = Math.log1p;
  var polyfill = function(x) {
    x = Number(x);
    return (log1p(x) - log1p(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cbrt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (x === 0) {
      return x;
    }
    x = Number(x);
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.clz32', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x) >>> 0;
    if (x === 0) {
      return 32;
    }
    var result = 0;
    if ((x & 4294901760) === 0) {
      x <<= 16;
      result += 16;
    }
    if ((x & 4278190080) === 0) {
      x <<= 8;
      result += 8;
    }
    if ((x & 4026531840) === 0) {
      x <<= 4;
      result += 4;
    }
    if ((x & 3221225472) === 0) {
      x <<= 2;
      result += 2;
    }
    if ((x & 2147483648) === 0) {
      result++;
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cosh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    return (exp(x) + exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.expm1', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < .25 && x > -.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      while (zPrev != z) {
        y *= x / ++d;
        z = (zPrev = z) + y;
      }
      return z;
    }
    return Math.exp(x) - 1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.hypot', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x, y, var_args) {
    x = Number(x);
    y = Number(y);
    var i, z, sum;
    var max = Math.max(Math.abs(x), Math.abs(y));
    for (i = 2; i < arguments.length; i++) {
      max = Math.max(max, Math.abs(arguments[i]));
    }
    if (max > 1e100 || max < 1e-100) {
      if (!max) {
        return max;
      }
      x = x / max;
      y = y / max;
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]) / max;
        sum += z * z;
      }
      return Math.sqrt(sum) * max;
    } else {
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]);
        sum += z * z;
      }
      return Math.sqrt(sum);
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.imul', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(a, b) {
    a = Number(a);
    b = Number(b);
    var ah = a >>> 16 & 65535;
    var al = a & 65535;
    var bh = b >>> 16 & 65535;
    var bl = b & 65535;
    var lh = ah * bl + al * bh << 16 >>> 0;
    return al * bl + lh | 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log10', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN10;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log2', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return x === 0 || isNaN(x) ? x : x > 0 ? 1 : -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sinh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    return (exp(x) - exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.tanh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.exp(-2 * Math.abs(x));
    var z = (1 - y) / (1 + y);
    return x < 0 ? -z : z;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.trunc', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (isNaN(x) || x === Infinity || x === -Infinity || x === 0) {
      return x;
    }
    var y = Math.floor(Math.abs(x));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.EPSILON', function(orig) {
  return Math.pow(2, -52);
}, 'es6', 'es3');
$jscomp.polyfill('Number.MAX_SAFE_INTEGER', function() {
  return 9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.MIN_SAFE_INTEGER', function() {
  return -9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isFinite', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (typeof x !== 'number') {
      return false;
    }
    return !isNaN(x) && x !== Infinity && x !== -Infinity;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (!Number.isFinite(x)) {
      return false;
    }
    return x === Math.floor(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isNaN', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return typeof x === 'number' && isNaN(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isSafeInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.parseFloat', function(orig) {
  return orig || parseFloat;
}, 'es6', 'es3');
$jscomp.polyfill('Number.parseInt', function(orig) {
  return orig || parseInt;
}, 'es6', 'es3');
$jscomp.assign = typeof Object.assign == 'function' ? Object.assign : function(target, var_args) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    if (!source) {
      continue;
    }
    for (var key in source) {
      if ($jscomp.owns(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
$jscomp.polyfill('Object.assign', function(orig) {
  return orig || $jscomp.assign;
}, 'es6', 'es3');
$jscomp.polyfill('Object.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var entries = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push([key, obj[key]]);
      }
    }
    return result;
  };
  return entries;
}, 'es8', 'es3');
$jscomp.polyfill('Object.getOwnPropertySymbols', function(orig) {
  if (orig) {
    return orig;
  }
  return function() {
    return [];
  };
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.ownKeys', function(orig) {
  if (orig) {
    return orig;
  }
  var symbolPrefix = 'jscomp_symbol_';
  function isSymbol(key) {
    return key.substring(0, symbolPrefix.length) == symbolPrefix;
  }
  var polyfill = function(target) {
    var keys = [];
    var names = Object.getOwnPropertyNames(target);
    var symbols = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < names.length; i++) {
      (isSymbol(names[i]) ? symbols : keys).push(names[i]);
    }
    return keys.concat(symbols);
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.getOwnPropertyDescriptors', function(orig) {
  if (orig) {
    return orig;
  }
  var getOwnPropertyDescriptors = function(obj) {
    var result = {};
    var keys = Reflect.ownKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return result;
  };
  return getOwnPropertyDescriptors;
}, 'es8', 'es5');
$jscomp.polyfill('Object.setPrototypeOf', function(orig) {
  return orig || $jscomp.setPrototypeOf;
}, 'es6', 'es5');
$jscomp.polyfill('Object.values', function(orig) {
  if (orig) {
    return orig;
  }
  var values = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push(obj[key]);
      }
    }
    return result;
  };
  return values;
}, 'es8', 'es3');
$jscomp.polyfill('Reflect.apply', function(orig) {
  if (orig) {
    return orig;
  }
  var apply = Function.prototype.apply;
  var polyfill = function(target, thisArg, argList) {
    return apply.call(target, thisArg, argList);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || typeof Object.create == 'function' ? Object.create : function(prototype) {
  var ctor = function() {
  };
  ctor.prototype = prototype;
  return new ctor;
};
$jscomp.construct = function() {
  function reflectConstructWorks() {
    function Base() {
    }
    function Derived() {
    }
    new Base;
    Reflect.construct(Base, [], Derived);
    return new Base instanceof Base;
  }
  if (typeof Reflect != 'undefined' && Reflect.construct) {
    if (reflectConstructWorks()) {
      return Reflect.construct;
    }
    var brokenConstruct = Reflect.construct;
    var patchedConstruct = function(target, argList, opt_newTarget) {
      var out = brokenConstruct(target, argList);
      if (opt_newTarget) {
        Reflect.setPrototypeOf(out, opt_newTarget.prototype);
      }
      return out;
    };
    return patchedConstruct;
  }
  function construct(target, argList, opt_newTarget) {
    if (opt_newTarget === undefined) {
      opt_newTarget = target;
    }
    var proto = opt_newTarget.prototype || Object.prototype;
    var obj = $jscomp.objectCreate(proto);
    var apply = Function.prototype.apply;
    var out = apply.call(target, obj, argList);
    return out || obj;
  }
  return construct;
}();
$jscomp.polyfill('Reflect.construct', function(orig) {
  return $jscomp.construct;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.defineProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, attributes) {
    try {
      Object.defineProperty(target, propertyKey, attributes);
      var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
      if (!desc) {
        return false;
      }
      return desc.configurable === (attributes.configurable || false) && desc.enumerable === (attributes.enumerable || false) && ('value' in desc ? desc.value === attributes.value && desc.writable === (attributes.writable || false) : desc.get === attributes.get && desc.set === attributes.set);
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.deleteProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    if (!$jscomp.owns(target, propertyKey)) {
      return true;
    }
    try {
      return delete target[propertyKey];
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.getOwnPropertyDescriptor', function(orig) {
  return orig || Object.getOwnPropertyDescriptor;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.getPrototypeOf', function(orig) {
  return orig || Object.getPrototypeOf;
}, 'es6', 'es5');
$jscomp.findDescriptor = function(target, propertyKey) {
  var obj = target;
  while (obj) {
    var property = Reflect.getOwnPropertyDescriptor(obj, propertyKey);
    if (property) {
      return property;
    }
    obj = Reflect.getPrototypeOf(obj);
  }
  return undefined;
};
$jscomp.polyfill('Reflect.get', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, opt_receiver) {
    if (arguments.length <= 2) {
      return target[propertyKey];
    }
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (property) {
      return property.get ? property.get.call(opt_receiver) : property.value;
    }
    return undefined;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.has', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    return propertyKey in target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.isExtensible', function(orig) {
  if (orig) {
    return orig;
  }
  if ($jscomp.ASSUME_ES5 || typeof Object.isExtensible == 'function') {
    return Object.isExtensible;
  }
  return function() {
    return true;
  };
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.preventExtensions', function(orig) {
  if (orig) {
    return orig;
  }
  if (!($jscomp.ASSUME_ES5 || typeof Object.preventExtensions == 'function')) {
    return function() {
      return false;
    };
  }
  var polyfill = function(target) {
    Object.preventExtensions(target);
    return !Object.isExtensible(target);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.set', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, value, opt_receiver) {
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (!property) {
      if (Reflect.isExtensible(target)) {
        target[propertyKey] = value;
        return true;
      }
      return false;
    }
    if (property.set) {
      property.set.call(arguments.length > 3 ? opt_receiver : target, value);
      return true;
    } else {
      if (property.writable && !Object.isFrozen(target)) {
        target[propertyKey] = value;
        return true;
      }
    }
    return false;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  } else {
    if ($jscomp.setPrototypeOf) {
      var setPrototypeOf = $jscomp.setPrototypeOf;
      var polyfill = function(target, proto) {
        try {
          setPrototypeOf(target, proto);
          return true;
        } catch (e) {
          return false;
        }
      };
      return polyfill;
    } else {
      return null;
    }
  }
}, 'es6', 'es5');
$jscomp.polyfill('Set', function(NativeSet) {
  function isConformant() {
    if ($jscomp.ASSUME_NO_NATIVE_SET || !NativeSet || typeof NativeSet != 'function' || !NativeSet.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeSet = NativeSet;
      var value = Object.seal({x:4});
      var set = new NativeSet($jscomp.makeIterator([value]));
      if (!set.has(value) || set.size != 1 || set.add(value) != set || set.size != 1 || set.add({x:4}) != set || set.size != 2) {
        return false;
      }
      var iter = set.entries();
      var item = iter.next();
      if (item.done || item.value[0] != value || item.value[1] != value) {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0] == value || item.value[0].x != 4 || item.value[1] != item.value[0]) {
        return false;
      }
      return iter.next().done;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeSet && $jscomp.ES6_CONFORMANCE) {
      return NativeSet;
    }
  } else {
    if (isConformant()) {
      return NativeSet;
    }
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var PolyfillSet = function(opt_iterable) {
    this.map_ = new Map;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
    this.size = this.map_.size;
  };
  PolyfillSet.prototype.add = function(value) {
    value = value === 0 ? 0 : value;
    this.map_.set(value, value);
    this.size = this.map_.size;
    return this;
  };
  PolyfillSet.prototype['delete'] = function(value) {
    var result = this.map_['delete'](value);
    this.size = this.map_.size;
    return result;
  };
  PolyfillSet.prototype.clear = function() {
    this.map_.clear();
    this.size = 0;
  };
  PolyfillSet.prototype.has = function(value) {
    return this.map_.has(value);
  };
  PolyfillSet.prototype.entries = function() {
    return this.map_.entries();
  };
  PolyfillSet.prototype.values = function() {
    return this.map_.values();
  };
  PolyfillSet.prototype.keys = PolyfillSet.prototype.values;
  PolyfillSet.prototype[Symbol.iterator] = PolyfillSet.prototype.values;
  PolyfillSet.prototype.forEach = function(callback, opt_thisArg) {
    var set = this;
    this.map_.forEach(function(value) {
      return callback.call(opt_thisArg, value, value, set);
    });
  };
  return PolyfillSet;
}, 'es6', 'es3');
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (thisArg == null) {
    throw new TypeError("The 'this' value for String.prototype." + func + ' must not be null or undefined');
  }
  if (arg instanceof RegExp) {
    throw new TypeError('First argument to String.prototype.' + func + ' must not be a regular expression');
  }
  return thisArg + '';
};
$jscomp.polyfill('String.prototype.codePointAt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(position) {
    var string = $jscomp.checkStringArgs(this, null, 'codePointAt');
    var size = string.length;
    position = Number(position) || 0;
    if (!(position >= 0 && position < size)) {
      return void 0;
    }
    position = position | 0;
    var first = string.charCodeAt(position);
    if (first < 55296 || first > 56319 || position + 1 === size) {
      return first;
    }
    var second = string.charCodeAt(position + 1);
    if (second < 56320 || second > 57343) {
      return first;
    }
    return (first - 55296) * 1024 + second + 9216;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.endsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'endsWith');
    searchString = searchString + '';
    if (opt_position === void 0) {
      opt_position = string.length;
    }
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = searchString.length;
    while (j > 0 && i > 0) {
      if (string[--i] != searchString[--j]) {
        return false;
      }
    }
    return j <= 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.fromCodePoint', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
      var code = Number(arguments[i]);
      if (code < 0 || code > 1114111 || code !== Math.floor(code)) {
        throw new RangeError('invalid_code_point ' + code);
      }
      if (code <= 65535) {
        result += String.fromCharCode(code);
      } else {
        code -= 65536;
        result += String.fromCharCode(code >>> 10 & 1023 | 55296);
        result += String.fromCharCode(code & 1023 | 56320);
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'includes');
    return string.indexOf(searchString, opt_position || 0) !== -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.repeat', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(copies) {
    var string = $jscomp.checkStringArgs(this, null, 'repeat');
    if (copies < 0 || copies > 1342177279) {
      throw new RangeError('Invalid count value');
    }
    copies = copies | 0;
    var result = '';
    while (copies) {
      if (copies & 1) {
        result += string;
      }
      if (copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.stringPadding = function(padString, padLength) {
  var padding = padString !== undefined ? String(padString) : ' ';
  if (!(padLength > 0) || !padding) {
    return '';
  }
  var repeats = Math.ceil(padLength / padding.length);
  return padding.repeat(repeats).substring(0, padLength);
};
$jscomp.polyfill('String.prototype.padEnd', function(orig) {
  if (orig) {
    return orig;
  }
  var padEnd = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return string + $jscomp.stringPadding(opt_padString, padLength);
  };
  return padEnd;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.padStart', function(orig) {
  if (orig) {
    return orig;
  }
  var padStart = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return $jscomp.stringPadding(opt_padString, padLength) + string;
  };
  return padStart;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.startsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'startsWith');
    searchString = searchString + '';
    var strLen = string.length;
    var searchLen = searchString.length;
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = 0;
    while (j < searchLen && i < strLen) {
      if (string[i++] != searchString[j++]) {
        return false;
      }
    }
    return j >= searchLen;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.arrayFromIterator = function(iterator) {
  var i;
  var arr = [];
  while (!(i = iterator.next()).done) {
    arr.push(i.value);
  }
  return arr;
};
$jscomp.arrayFromIterable = function(iterable) {
  if (iterable instanceof Array) {
    return iterable;
  } else {
    return $jscomp.arrayFromIterator($jscomp.makeIterator(iterable));
  }
};
$jscomp.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = $jscomp.objectCreate(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
  if ($jscomp.setPrototypeOf) {
    var setPrototypeOf = $jscomp.setPrototypeOf;
    setPrototypeOf(childCtor, parentCtor);
  } else {
    for (var p in parentCtor) {
      if (p == 'prototype') {
        continue;
      }
      if (Object.defineProperties) {
        var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
        if (descriptor) {
          Object.defineProperty(childCtor, p, descriptor);
        }
      } else {
        childCtor[p] = parentCtor[p];
      }
    }
  }
  childCtor.superClass_ = parentCtor.prototype;
};
$jscomp.polyfill('WeakSet', function(NativeWeakSet) {
  function isConformant() {
    if (!NativeWeakSet || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var set = new NativeWeakSet([x]);
      if (!set.has(x) || set.has(y)) {
        return false;
      }
      set['delete'](x);
      set.add(y);
      return !set.has(x) && set.has(y);
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeWeakSet && $jscomp.ES6_CONFORMANCE) {
      return NativeWeakSet;
    }
  } else {
    if (isConformant()) {
      return NativeWeakSet;
    }
  }
  var PolyfillWeakSet = function(opt_iterable) {
    this.map_ = new WeakMap;
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
  };
  PolyfillWeakSet.prototype.add = function(elem) {
    this.map_.set(elem, true);
    return this;
  };
  PolyfillWeakSet.prototype.has = function(elem) {
    return this.map_.has(elem);
  };
  PolyfillWeakSet.prototype['delete'] = function(elem) {
    return this.map_['delete'](elem);
  };
  return PolyfillWeakSet;
}, 'es6', 'es3');
try {
  if (Array.prototype.values.toString().indexOf('[native code]') == -1) {
    delete Array.prototype.values;
  }
} catch (e) {
}
Ext.define('Ext.data.amf.Encoder', {alias:'data.amf.Encoder', config:{format:3}, bytes:[], constructor:function(config) {
  this.initConfig(config);
  this.clear();
}, clear:function() {
  this.bytes = [];
}, applyFormat:function(protocol_version) {
  var funcs = {0:{writeUndefined:this.write0Undefined, writeNull:this.write0Null, writeBoolean:this.write0Boolean, writeNumber:this.write0Number, writeString:this.write0String, writeXml:this.write0Xml, writeDate:this.write0Date, writeArray:this.write0Array, writeGenericObject:this.write0GenericObject}, 3:{writeUndefined:this.write3Undefined, writeNull:this.write3Null, writeBoolean:this.write3Boolean, writeNumber:this.write3Number, writeString:this.write3String, writeXml:this.write3Xml, writeDate:this.write3Date, 
  writeArray:this.write3Array, writeGenericObject:this.write3GenericObject}}[protocol_version];
  if (funcs) {
    Ext.apply(this, funcs);
    return protocol_version;
  } else {
    Ext.raise('Unsupported AMF format: ' + protocol_version + ". Only '3' (AMF3) is supported at this point.");
    return;
  }
}, writeObject:function(item) {
  var t = typeof item;
  if (t === 'undefined') {
    this.writeUndefined();
  } else {
    if (item === null) {
      this.writeNull();
    } else {
      if (Ext.isBoolean(item)) {
        this.writeBoolean(item);
      } else {
        if (Ext.isString(item)) {
          this.writeString(item);
        } else {
          if (t === 'number' || item instanceof Number) {
            this.writeNumber(item);
          } else {
            if (t === 'object') {
              if (item instanceof Date) {
                this.writeDate(item);
              } else {
                if (Ext.isArray(item)) {
                  this.writeArray(item);
                } else {
                  if (this.isXmlDocument(item)) {
                    this.writeXml(item);
                  } else {
                    this.writeGenericObject(item);
                  }
                }
              }
            } else {
              Ext.log.warn('AMF Encoder: Unknown item type ' + t + " can't be written to stream: " + item);
            }
          }
        }
      }
    }
  }
}, write3Undefined:function() {
  this.writeByte(0);
}, write0Undefined:function() {
  this.writeByte(6);
}, write3Null:function() {
  this.writeByte(1);
}, write0Null:function() {
  this.writeByte(5);
}, write3Boolean:function(item) {
  if (typeof item !== 'boolean') {
    Ext.log.warn('Encoder: writeBoolean argument is not a boolean. Coercing.');
  }
  if (item) {
    this.writeByte(3);
  } else {
    this.writeByte(2);
  }
}, write0Boolean:function(item) {
  if (typeof item !== 'boolean') {
    Ext.log.warn('Encoder: writeBoolean argument is not a boolean. Coercing.');
  }
  this.writeByte(1);
  if (item) {
    this.writeByte(1);
  } else {
    this.writeByte(0);
  }
}, encode29Int:function(item) {
  var data = [], num = item, nibble, i;
  if (num === 0) {
    return [0];
  }
  if (num > 2097151) {
    nibble = num & 255;
    data.unshift(nibble);
    num = num >> 8;
  }
  while (num > 0) {
    nibble = num & 127;
    data.unshift(nibble);
    num = num >> 7;
  }
  for (i = 0; i < data.length - 1; i++) {
    data[i] = data[i] | 128;
  }
  return data;
}, write3Number:function(item) {
  var data, maxInt = 536870911, minSignedInt = -268435455;
  if (typeof item !== 'number' && !(item instanceof Number)) {
    Ext.log.warn("Encoder: writeNumber argument is not numeric. Can't coerce.");
  }
  if (item instanceof Number) {
    item = item.valueOf();
  }
  if (item % 1 === 0 && item >= minSignedInt && item <= maxInt) {
    item = item & maxInt;
    data = this.encode29Int(item);
    data.unshift(4);
    this.writeBytes(data);
  } else {
    data = this.encodeDouble(item);
    data.unshift(5);
    this.writeBytes(data);
  }
}, write0Number:function(item) {
  var data;
  if (typeof item !== 'number' && !(item instanceof Number)) {
    Ext.log.warn("Encoder: writeNumber argument is not numeric. Can't coerce.");
  }
  if (item instanceof Number) {
    item = item.valueOf();
  }
  data = this.encodeDouble(item);
  data.unshift(0);
  this.writeBytes(data);
}, encodeUtf8Char:function(c) {
  var data = [], val, b, i, marker;
  if (c > 1114111) {
    Ext.raise('UTF 8 char out of bounds');
  }
  if (c <= 127) {
    data.push(c);
  } else {
    if (c <= 2047) {
      b = 2;
    } else {
      if (c <= 65535) {
        b = 3;
      } else {
        b = 4;
      }
    }
    marker = 128;
    for (i = 1; i < b; i++) {
      val = c & 63 | 128;
      data.unshift(val);
      c = c >> 6;
      marker = marker >> 1 | 128;
    }
    val = c | marker;
    data.unshift(val);
  }
  return data;
}, encodeUtf8String:function(str) {
  var utf8Data = [], data, i;
  for (i = 0; i < str.length; i++) {
    data = this.encodeUtf8Char(str.charCodeAt(i));
    Ext.Array.push(utf8Data, data);
  }
  return utf8Data;
}, encode3Utf8StringLen:function(utf8Data) {
  var len = utf8Data.length, data = [];
  if (len <= 268435455) {
    len = len << 1;
    len = len | 1;
    data = this.encode29Int(len);
  } else {
    Ext.raise('UTF8 encoded string too long to serialize to AMF: ' + len);
  }
  return data;
}, write3String:function(item) {
  var utf8Data, lenData;
  if (!Ext.isString(item)) {
    Ext.log.warn('Encoder: writString argument is not a string.');
  }
  if (item === '') {
    this.writeByte(6);
    this.writeByte(1);
  } else {
    utf8Data = this.encodeUtf8String(item);
    lenData = this.encode3Utf8StringLen(utf8Data);
    this.writeByte(6);
    this.writeBytes(lenData);
    this.writeBytes(utf8Data);
  }
}, encodeXInt:function(value, byte_count) {
  var data = [], i;
  for (i = 0; i < byte_count; i++) {
    data.unshift(value & 255);
    value = value >> 8;
  }
  return data;
}, write0String:function(item) {
  var utf8Data, lenData, encoding;
  if (!Ext.isString(item)) {
    Ext.log.warn('Encoder: writString argument is not a string.');
  }
  if (item === '') {
    this.writeByte(2);
    this.writeBytes([0, 0]);
  } else {
    utf8Data = this.encodeUtf8String(item);
    if (utf8Data.length <= 65535) {
      encoding = 2;
      lenData = this.encodeXInt(utf8Data.length, 2);
    } else {
      encoding = 12;
      lenData = this.encodeXInt(utf8Data.length, 4);
    }
    this.writeByte(encoding);
    this.writeBytes(lenData);
    this.writeBytes(utf8Data);
  }
}, write3XmlWithType:function(xml, amfType) {
  var xmlStr, utf8Data, lenData;
  if (amfType !== 7 && amfType !== 11) {
    Ext.raise('write XML with unknown AMF3 code: ' + amfType);
  }
  if (!this.isXmlDocument(xml)) {
    Ext.log.warn('Encoder: write3XmlWithType argument is not an xml document.');
  }
  xmlStr = this.convertXmlToString(xml);
  if (xmlStr === '') {
    this.writeByte(amfType);
    this.writeByte(1);
  } else {
    utf8Data = this.encodeUtf8String(xmlStr);
    lenData = this.encode3Utf8StringLen(utf8Data);
    this.writeByte(amfType);
    this.writeBytes(lenData);
    this.writeBytes(utf8Data);
  }
}, write3XmlDocument:function(xml) {
  this.write3XmlWithType(xml, 7);
}, write3Xml:function(xml) {
  this.write3XmlWithType(xml, 11);
}, write0Xml:function(xml) {
  var xmlStr, utf8Data, lenData;
  if (!this.isXmlDocument(xml)) {
    Ext.log.warn('Encoder: write0Xml argument is not an xml document.');
  }
  xmlStr = this.convertXmlToString(xml);
  this.writeByte(15);
  utf8Data = this.encodeUtf8String(xmlStr);
  lenData = this.encodeXInt(utf8Data.length, 4);
  this.writeBytes(lenData);
  this.writeBytes(utf8Data);
}, write3Date:function(date) {
  if (!(date instanceof Date)) {
    Ext.raise('Serializing a non-date object as date: ' + date);
  }
  this.writeByte(8);
  this.writeBytes(this.encode29Int(1));
  this.writeBytes(this.encodeDouble(new Number(date)));
}, write0Date:function(date) {
  if (!(date instanceof Date)) {
    Ext.raise('Serializing a non-date object as date: ' + date);
  }
  this.writeByte(11);
  this.writeBytes(this.encodeDouble(new Number(date)));
  this.writeBytes([0, 0]);
}, write3Array:function(arr) {
  var len;
  if (!Ext.isArray(arr)) {
    Ext.raise('Serializing a non-array object as array: ' + arr);
  }
  if (arr.length > 268435455) {
    Ext.raise('Array size too long to encode in AMF3: ' + arr.length);
  }
  this.writeByte(9);
  len = arr.length;
  len = len << 1;
  len = len | 1;
  this.writeBytes(this.encode29Int(len));
  this.writeByte(1);
  Ext.each(arr, function(x) {
    this.writeObject(x);
  }, this);
}, write0ObjectProperty:function(key, value) {
  var utf8Data, lenData;
  if (!(key instanceof String) && typeof key !== 'string') {
    key = key + '';
  }
  utf8Data = this.encodeUtf8String(key);
  lenData = this.encodeXInt(utf8Data.length, 2);
  this.writeBytes(lenData);
  this.writeBytes(utf8Data);
  this.writeObject(value);
}, write0Array:function(arr) {
  var key, total;
  if (!Ext.isArray(arr)) {
    Ext.raise('Serializing a non-array object as array: ' + arr);
  }
  this.writeByte(8);
  total = 0;
  for (key in arr) {
    total++;
  }
  this.writeBytes(this.encodeXInt(total, 4));
  for (key in arr) {
    Ext.Array.push(this.write0ObjectProperty(key, arr[key]));
  }
  this.writeBytes([0, 0, 9]);
}, write0StrictArray:function(arr) {
  var len;
  if (!Ext.isArray(arr)) {
    Ext.raise('Serializing a non-array object as array: ' + arr);
  }
  this.writeByte(10);
  len = arr.length;
  this.writeBytes(this.encodeXInt(len, 4));
  Ext.each(arr, function(x) {
    this.writeObject(x);
  }, this);
}, write3ByteArray:function(arr) {
  var len;
  if (!Ext.isArray(arr)) {
    Ext.raise('Serializing a non-array object as array: ' + arr);
  }
  if (arr.length > 268435455) {
    Ext.raise('Array size too long to encode in AMF3: ' + arr.length);
  }
  this.writeByte(12);
  len = arr.length;
  len = len << 1;
  len = len | 1;
  this.writeBytes(this.encode29Int(len));
  this.writeBytes(arr);
}, write3GenericObject:function(obj) {
  var name, newName, nameData, oType;
  if (!Ext.isObject(obj)) {
    Ext.raise('Serializing a non-object object: ' + obj);
  }
  this.writeByte(10);
  oType = 11;
  this.writeByte(oType);
  this.writeByte(1);
  for (name in obj) {
    newName = (new String(name)).valueOf();
    if (newName === '') {
      Ext.raise("Can't encode non-string field name: " + name);
    }
    nameData = this.encodeUtf8String(name);
    this.writeBytes(this.encode3Utf8StringLen(name));
    this.writeBytes(nameData);
    this.writeObject(obj[name]);
  }
  this.writeByte(1);
}, write0GenericObject:function(obj) {
  var typed, amfType, key;
  if (!Ext.isObject(obj)) {
    Ext.raise('Serializing a non-object object: ' + obj);
  }
  typed = !!obj.$flexType;
  amfType = typed ? 16 : 3;
  this.writeByte(amfType);
  if (typed) {
    this.write0ShortUtf8String(obj.$flexType);
  }
  for (key in obj) {
    if (key !== '$flexType') {
      Ext.Array.push(this.write0ObjectProperty(key, obj[key]));
    }
  }
  this.writeBytes([0, 0, 9]);
}, writeByte:function(b) {
  if (b < 0 || b > 255) {
    Ext.Error.raise('ERROR: Value being written outside byte range: ' + b);
  }
  Ext.Array.push(this.bytes, b);
}, writeBytes:function(b) {
  var i;
  if (!Ext.isArray(b)) {
    Ext.raise('Decoder: writeBytes parameter is not an array: ' + b);
  }
  for (i = 0; i < b.length; i++) {
    if (b[i] < 0 || b[i] > 255 || !Ext.isNumber(b[i])) {
      Ext.raise('ERROR: Value ' + i + ' being written outside byte range: ' + b[i]);
    }
  }
  Ext.Array.push(this.bytes, b);
}, convertXmlToString:function(xml) {
  var str;
  if (window.XMLSerializer) {
    str = (new window.XMLSerializer).serializeToString(xml);
  } else {
    str = xml.xml;
  }
  return str;
}, isXmlDocument:function(item) {
  if (window.DOMParser) {
    if (Ext.isDefined(item.doctype)) {
      return true;
    }
  }
  if (Ext.isString(item.xml)) {
    return true;
  }
  return false;
}, encodeDouble:function(num) {
  var ebits = 11, fbits = 52, bias = (1 << ebits - 1) - 1, s, e, f, ln, i, bits, str, data = [], K_INFINITY = [127, 240, 0, 0, 0, 0, 0, 0], K_NINFINITY = [255, 240, 0, 0, 0, 0, 0, 0], K_NAN = [255, 248, 0, 0, 0, 0, 0, 0];
  if (isNaN(num)) {
    data = K_NAN;
  } else {
    if (num === Infinity) {
      data = K_INFINITY;
    } else {
      if (num === -Infinity) {
        data = K_NINFINITY;
      } else {
        if (num === 0) {
          e = 0;
          f = 0;
          s = 1 / num === -Infinity ? 1 : 0;
        } else {
          s = num < 0;
          num = Math.abs(num);
          if (num >= Math.pow(2, 1 - bias)) {
            ln = Math.min(Math.floor(Math.log(num) / Math.LN2), bias);
            e = ln + bias;
            f = Math.round(num * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
          } else {
            e = 0;
            f = Math.round(num / Math.pow(2, 1 - bias - fbits));
          }
        }
        bits = [];
        for (i = fbits; i; i -= 1) {
          bits.push(f % 2 ? 1 : 0);
          f = Math.floor(f / 2);
        }
        for (i = ebits; i; i -= 1) {
          bits.push(e % 2 ? 1 : 0);
          e = Math.floor(e / 2);
        }
        bits.push(s ? 1 : 0);
        bits.reverse();
        str = bits.join('');
        data = [];
        while (str.length) {
          data.push(parseInt(str.substring(0, 8), 2));
          str = str.substring(8);
        }
      }
    }
  }
  return data;
}, write0ShortUtf8String:function(str) {
  var utf8Data = this.encodeUtf8String(str), lenData;
  lenData = this.encodeXInt(utf8Data.length, 2);
  this.writeBytes(lenData);
  this.writeBytes(utf8Data);
}, writeAmfPacket:function(headers, messages) {
  var i;
  if (this.config.format !== 0) {
    Ext.raise('Trying to write a packet on an AMF3 Encoder. Only AMF0 is supported!');
  }
  if (!Ext.isArray(headers)) {
    Ext.raise('headers is not an array: ' + headers);
  }
  if (!Ext.isArray(messages)) {
    Ext.raise('messages is not an array: ' + messages);
  }
  this.writeBytes([0, 0]);
  this.writeBytes(this.encodeXInt(headers.length, 2));
  for (i in headers) {
    if (!Ext.isString(headers[i].name)) {
      Ext.raise('targetURI is not a string: ' + headers[i].targetUri);
    }
    this.writeAmfHeader(headers[i].name, headers[i].mustUnderstand, headers[i].value);
  }
  this.writeBytes(this.encodeXInt(messages.length, 2));
  for (i in messages) {
    this.writeAmfMessage(messages[i].targetUri, messages[i].responseUri, messages[i].body);
  }
}, writeAmfHeader:function(headerName, mustUnderstand, value) {
  var mu;
  if (this.config.format !== 0) {
    Ext.raise('Trying to write a header on an AMF3 Encoder. Only AMF0 is supported!');
  }
  if (typeof mustUnderstand !== 'boolean' && !Ext.isBoolean(mustUnderstand)) {
    Ext.raise('mustUnderstand is not a boolean value: ' + mustUnderstand);
  }
  this.write0ShortUtf8String(headerName);
  mu = mustUnderstand ? 1 : 0;
  this.writeByte(mu);
  this.writeBytes(this.encodeXInt(-1, 4));
  this.writeObject(value);
}, writeAmfMessage:function(targetUri, responseUri, body) {
  if (this.config.format !== 0) {
    Ext.raise('Trying to write a message on an AMF3 Encoder. Only AMF0 is supported!');
  }
  if (!Ext.isString(targetUri)) {
    Ext.raise('targetURI is not a string: ' + targetUri);
  }
  if (!Ext.isString(responseUri)) {
    Ext.raise('targetURI is not a string: ' + responseUri);
  }
  if (!Ext.isArray(body)) {
    Ext.raise('body is not an array: ' + typeof body);
  }
  this.write0ShortUtf8String(targetUri);
  this.write0ShortUtf8String(responseUri);
  this.writeBytes(this.encodeXInt(-1, 4));
  this.write0StrictArray(body);
}});
Ext.define('Ext.data.amf.Packet', function() {
  var twoPowN52 = Math.pow(2, -52), twoPow8 = Math.pow(2, 8), pos = 0, bytes, strings, objects, traits;
  return {typeMap:{0:{0:'readDouble', 1:'readBoolean', 2:'readAmf0String', 3:'readAmf0Object', 5:'readNull', 6:'readUndefined', 7:'readReference', 8:'readEcmaArray', 10:'readStrictArray', 11:'readAmf0Date', 12:'readLongString', 13:'readUnsupported', 15:'readAmf0Xml', 16:'readTypedObject'}, 3:{0:'readUndefined', 1:'readNull', 2:'readFalse', 3:'readTrue', 4:'readUInt29', 5:'readDouble', 6:'readAmf3String', 7:'readAmf3Xml', 8:'readAmf3Date', 9:'readAmf3Array', 10:'readAmf3Object', 11:'readAmf3Xml', 
  12:'readByteArray'}}, decode:function(byteArray) {
    var me = this, headers = me.headers = [], messages = me.messages = [], headerCount, messageCount;
    pos = 0;
    bytes = me.bytes = byteArray;
    strings = me.strings = [];
    objects = me.objects = [];
    traits = me.traits = [];
    me.version = me.readUInt(2);
    for (headerCount = me.readUInt(2); headerCount--;) {
      headers.push({name:me.readAmf0String(), mustUnderstand:me.readBoolean(), byteLength:me.readUInt(4), value:me.readValue()});
      strings = me.strings = [];
      objects = me.objects = [];
      traits = me.traits = [];
    }
    for (messageCount = me.readUInt(2); messageCount--;) {
      messages.push({targetURI:me.readAmf0String(), responseURI:me.readAmf0String(), byteLength:me.readUInt(4), body:me.readValue()});
      strings = me.strings = [];
      objects = me.objects = [];
      traits = me.traits = [];
    }
    pos = 0;
    bytes = strings = objects = traits = me.bytes = me.strings = me.objects = me.traits = null;
    return me;
  }, decodeValue:function(byteArray) {
    var me = this;
    bytes = me.bytes = byteArray;
    pos = 0;
    me.version = 3;
    strings = me.strings = [];
    objects = me.objects = [];
    traits = me.traits = [];
    return me.readValue();
  }, parseXml:function(xml) {
    var doc;
    if (window.DOMParser) {
      doc = (new DOMParser).parseFromString(xml, 'text/xml');
    } else {
      doc = new ActiveXObject('Microsoft.XMLDOM');
      doc.loadXML(xml);
    }
    return doc;
  }, readAmf0Date:function() {
    var date = new Date(this.readDouble());
    pos += 2;
    return date;
  }, readAmf0Object:function(obj) {
    var me = this, key;
    obj = obj || {};
    objects.push(obj);
    while ((key = me.readAmf0String()) || bytes[pos] !== 9) {
      obj[key] = me.readValue();
    }
    pos++;
    return obj;
  }, readAmf0String:function() {
    return this.readUtf8(this.readUInt(2));
  }, readAmf0Xml:function() {
    return this.parseXml(this.readLongString());
  }, readAmf3Array:function() {
    var me = this, header = me.readUInt29(), count, key, array, i;
    if (header & 1) {
      count = header >> 1;
      key = me.readAmf3String();
      if (key) {
        array = {};
        objects.push(array);
        do {
          array[key] = me.readValue();
        } while (key = me.readAmf3String());
        for (i = 0; i < count; i++) {
          array[i] = me.readValue();
        }
      } else {
        array = [];
        objects.push(array);
        for (i = 0; i < count; i++) {
          array.push(me.readValue());
        }
      }
    } else {
      array = objects[header >> 1];
    }
    return array;
  }, readAmf3Date:function() {
    var me = this, header = me.readUInt29(), date;
    if (header & 1) {
      date = new Date(me.readDouble());
      objects.push(date);
    } else {
      date = objects[header >> 1];
    }
    return date;
  }, readAmf3Object:function() {
    var me = this, header = me.readUInt29(), members = [], headerLast3Bits, memberCount, className, dynamic, objectTraits, obj, key, klass, i;
    if (header & 1) {
      headerLast3Bits = header & 7;
      if (headerLast3Bits === 3) {
        className = me.readAmf3String();
        dynamic = !!(header & 8);
        memberCount = header >> 4;
        for (i = 0; i < memberCount; i++) {
          members.push(me.readAmf3String());
        }
        objectTraits = {className:className, dynamic:dynamic, members:members};
        traits.push(objectTraits);
      } else {
        if ((header & 3) === 1) {
          objectTraits = traits[header >> 2];
          className = objectTraits.className;
          dynamic = objectTraits.dynamic;
          members = objectTraits.members;
          memberCount = members.length;
        } else {
          if (headerLast3Bits === 7) {
          }
        }
      }
      if (className) {
        klass = Ext.ClassManager.getByAlias('amf.' + className);
        obj = klass ? new klass : {$className:className};
      } else {
        obj = {};
      }
      objects.push(obj);
      for (i = 0; i < memberCount; i++) {
        obj[members[i]] = me.readValue();
      }
      if (dynamic) {
        while (key = me.readAmf3String()) {
          obj[key] = me.readValue();
        }
      }
      if (!klass && this.converters[className]) {
        obj = this.converters[className](obj);
      }
    } else {
      obj = objects[header >> 1];
    }
    return obj;
  }, readAmf3String:function() {
    var me = this, header = me.readUInt29(), value;
    if (header & 1) {
      value = me.readUtf8(header >> 1);
      if (value) {
        strings.push(value);
      }
      return value;
    } else {
      return strings[header >> 1];
    }
  }, readAmf3Xml:function() {
    var me = this, header = me.readUInt29(), doc;
    if (header & 1) {
      doc = me.parseXml(me.readUtf8(header >> 1));
      objects.push(doc);
    } else {
      doc = objects[header >> 1];
    }
    return doc;
  }, readBoolean:function() {
    return !!bytes[pos++];
  }, readByteArray:function() {
    var header = this.readUInt29(), byteArray, end;
    if (header & 1) {
      end = pos + (header >> 1);
      byteArray = Array.prototype.slice.call(bytes, pos, end);
      objects.push(byteArray);
      pos = end;
    } else {
      byteArray = objects[header >> 1];
    }
    return byteArray;
  }, readDouble:function() {
    var byte1 = bytes[pos++], byte2 = bytes[pos++], sign = byte1 >> 7 ? -1 : 1, exponent = (byte1 & 127) << 4 | byte2 >> 4, significand = byte2 & 15, hiddenBit = exponent ? 1 : 0, i = 6;
    while (i--) {
      significand = significand * twoPow8 + bytes[pos++];
    }
    if (!exponent) {
      if (!significand) {
        return 0;
      }
      exponent = 1;
    }
    if (exponent === 2047) {
      return significand ? NaN : Infinity * sign;
    }
    return sign * Math.pow(2, exponent - 1023) * (hiddenBit + twoPowN52 * significand);
  }, readEcmaArray:function() {
    pos += 4;
    return this.readAmf0Object();
  }, readFalse:function() {
    return false;
  }, readLongString:function() {
    return this.readUtf8(this.readUInt(4));
  }, readNull:function() {
    return null;
  }, readReference:function() {
    return objects[this.readUInt(2)];
  }, readStrictArray:function() {
    var me = this, len = me.readUInt(4), arr = [];
    objects.push(arr);
    while (len--) {
      arr.push(me.readValue());
    }
    return arr;
  }, readTrue:Ext.returnTrue, readTypedObject:function() {
    var me = this, className = me.readAmf0String(), klass, instance, modified;
    klass = Ext.ClassManager.getByAlias('amf.' + className);
    instance = klass ? new klass : {$className:className};
    modified = me.readAmf0Object(instance);
    if (!klass && this.converters[className]) {
      modified = this.converters[className](instance);
    }
    return modified;
  }, readUInt:function(byteCount) {
    var i = 1, result;
    result = bytes[pos++];
    for (; i < byteCount; ++i) {
      result = result << 8 | bytes[pos++];
    }
    return result;
  }, readUInt29:function() {
    var value = bytes[pos++], nextByte;
    if (value & 128) {
      nextByte = bytes[pos++];
      value = (value & 127) << 7 | nextByte & 127;
      if (nextByte & 128) {
        nextByte = bytes[pos++];
        value = value << 7 | nextByte & 127;
        if (nextByte & 128) {
          nextByte = bytes[pos++];
          value = value << 8 | nextByte;
        }
      }
    }
    return value;
  }, readUndefined:Ext.emptyFn, readUnsupported:Ext.emptyFn, readUtf8:function(byteLength) {
    var end = pos + byteLength, chars = [], charCount = 0, maxCharCount = 65535, charArrayCount = 1, result = [], i = 0, charArrays, byteCount, charCode;
    charArrays = [chars];
    while (pos < end) {
      charCode = bytes[pos++];
      if (charCode > 127) {
        if (charCode > 239) {
          byteCount = 4;
          charCode = charCode & 7;
        } else {
          if (charCode > 223) {
            byteCount = 3;
            charCode = charCode & 15;
          } else {
            byteCount = 2;
            charCode = charCode & 31;
          }
        }
        while (--byteCount) {
          charCode = charCode << 6 | bytes[pos++] & 63;
        }
      }
      chars.push(charCode);
      if (++charCount === maxCharCount) {
        charArrays.push(chars = []);
        charCount = 0;
        charArrayCount++;
      }
    }
    for (; i < charArrayCount; i++) {
      result.push(String.fromCharCode.apply(String, charArrays[i]));
    }
    return result.join('');
  }, readValue:function() {
    var me = this, marker = bytes[pos++];
    if (marker === 17) {
      me.version = 3;
      marker = bytes[pos++];
    }
    return me[me.typeMap[me.version][marker]]();
  }, converters:{'flex.messaging.io.ArrayCollection':function(obj) {
    return obj.source || [];
  }}};
});
Ext.define('Ext.data.amf.Reader', {extend:'Ext.data.reader.Json', alias:'reader.amf', requires:['Ext.data.amf.Packet'], messageIndex:0, responseType:'arraybuffer', read:function(response) {
  var me = this, bytes = response.responseBytes, packet, messages, resultSet;
  if (!bytes) {
    throw 'AMF Reader cannot process the response because it does not contain ' + "binary data. Make sure the Proxy's 'binary' config is true.";
  }
  packet = new Ext.data.amf.Packet;
  packet.decode(bytes);
  messages = packet.messages;
  if (messages.length) {
    resultSet = me.readRecords(messages[me.messageIndex].body);
  } else {
    resultSet = me.nullResultSet;
    if (packet.invalid) {
      resultSet.success = false;
    }
  }
  return resultSet;
}});
Ext.define('Ext.data.amf.Proxy', {extend:'Ext.data.proxy.Ajax', alias:'proxy.amf', requires:['Ext.data.amf.Reader'], binary:true, reader:'amf'});
Ext.define('Ext.data.amf.RemotingMessage', {alias:'data.amf.remotingmessage', config:{$flexType:'flex.messaging.messages.RemotingMessage', body:[], clientId:'', destination:'', headers:[], messageId:'', operation:'', source:'', timestamp:[], timeToLive:[]}, constructor:function(config) {
  this.initConfig(config);
}, encodeMessage:function() {
  var encoder = Ext.create('Ext.data.amf.XmlEncoder'), cleanObj;
  cleanObj = Ext.copyTo({}, this, '$flexType,body,clientId,destination,headers,messageId,operation,source,timestamp,timeToLive', true);
  encoder.writeObject(cleanObj);
  return encoder.body;
}});
Ext.define('Ext.data.amf.XmlDecoder', {alias:'data.amf.xmldecoder', statics:{readXml:function(xml) {
  var doc;
  if (window.DOMParser) {
    doc = (new DOMParser).parseFromString(xml, 'text/xml');
  } else {
    doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.loadXML(xml);
  }
  return doc;
}, readByteArray:function(node) {
  var bytes = [], c, i, str;
  str = node.firstChild.nodeValue;
  for (i = 0; i < str.length; i = i + 2) {
    c = str.substr(i, 2);
    bytes.push(parseInt(c, 16));
  }
  return bytes;
}, readAMF3Value:function(bytes) {
  var packet = Ext.create('Ext.data.amf.Packet');
  return packet.decodeValue(bytes);
}, decodeTidFromFlexUID:function(messageId) {
  var str = messageId.substr(0, 8);
  return parseInt(str, 16);
}}, constructor:function(config) {
  this.initConfig(config);
  this.clear();
}, clear:function() {
  this.objectReferences = [];
  this.traitsReferences = [];
  this.stringReferences = [];
}, readAmfxMessage:function(xml) {
  var doc, amfx, body, resp = {}, i;
  this.clear();
  doc = Ext.data.amf.XmlDecoder.readXml(xml);
  amfx = doc.getElementsByTagName('amfx')[0];
  if (!amfx) {
    Ext.warn.log('No AMFX tag in message');
  }
  if (amfx.getAttribute('ver') != '3') {
    Ext.raise('Unsupported AMFX version: ' + amfx.getAttribute('ver'));
  }
  body = amfx.getElementsByTagName('body')[0];
  resp.targetURI = body.getAttribute('targetURI');
  resp.responseURI = body.getAttribute('responseURI');
  for (i = 0; i < body.childNodes.length; i++) {
    if (body.childNodes.item(i).nodeType != 1) {
      continue;
    }
    resp.message = this.readValue(body.childNodes.item(i));
    break;
  }
  return resp;
}, readValue:function(node) {
  var val;
  if (typeof node.normalize === 'function') {
    node.normalize();
  }
  if (node.tagName == 'null') {
    return null;
  } else {
    if (node.tagName == 'true') {
      return true;
    } else {
      if (node.tagName == 'false') {
        return false;
      } else {
        if (node.tagName == 'string') {
          return this.readString(node);
        } else {
          if (node.tagName == 'int') {
            return parseInt(node.firstChild.nodeValue);
          } else {
            if (node.tagName == 'double') {
              return parseFloat(node.firstChild.nodeValue);
            } else {
              if (node.tagName == 'date') {
                val = new Date(parseFloat(node.firstChild.nodeValue));
                this.objectReferences.push(val);
                return val;
              } else {
                if (node.tagName == 'dictionary') {
                  return this.readDictionary(node);
                } else {
                  if (node.tagName == 'array') {
                    return this.readArray(node);
                  } else {
                    if (node.tagName == 'ref') {
                      return this.readObjectRef(node);
                    } else {
                      if (node.tagName == 'object') {
                        return this.readObject(node);
                      } else {
                        if (node.tagName == 'xml') {
                          return Ext.data.amf.XmlDecoder.readXml(node.firstChild.nodeValue);
                        } else {
                          if (node.tagName == 'bytearray') {
                            return Ext.data.amf.XmlDecoder.readAMF3Value(Ext.data.amf.XmlDecoder.readByteArray(node));
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  Ext.raise('Unknown tag type: ' + node.tagName);
  return null;
}, readString:function(node) {
  var val;
  if (node.getAttributeNode('id')) {
    return this.stringReferences[parseInt(node.getAttribute('id'))];
  }
  val = (node.firstChild ? node.firstChild.nodeValue : '') || '';
  this.stringReferences.push(val);
  return val;
}, readTraits:function(node) {
  var traits = [], i, rawtraits;
  if (node === null) {
    return null;
  }
  if (node.getAttribute('externalizable') == 'true') {
    return null;
  }
  if (node.getAttributeNode('id')) {
    return this.traitsReferences[parseInt(node.getAttributeNode('id').value)];
  }
  rawtraits = node.childNodes;
  for (i = 0; i < rawtraits.length; i++) {
    if (rawtraits.item(i).nodeType != 1) {
      continue;
    }
    traits.push(this.readValue(rawtraits.item(i)));
  }
  this.traitsReferences.push(traits);
  return traits;
}, readObjectRef:function(node) {
  var id = parseInt(node.getAttribute('id'));
  return this.objectReferences[id];
}, readObject:function(node) {
  var obj, traits = [], traitsNode, i, j, n, key, val, klass = null, className;
  className = node.getAttribute('type');
  if (className) {
    klass = Ext.ClassManager.getByAlias('amfx.' + className);
  }
  obj = klass ? new klass : className ? {$className:className} : {};
  if (!klass && this.converters[className]) {
    obj = this.converters[className](this, node);
    return obj;
  }
  traitsNode = node.getElementsByTagName('traits')[0];
  traits = this.readTraits(traitsNode);
  if (traits === null) {
    Ext.raise('No support for externalizable object: ' + className);
  }
  this.objectReferences.push(obj);
  j = 0;
  for (i = 0; i < node.childNodes.length; i++) {
    n = node.childNodes.item(i);
    if (n.nodeType != 1) {
      continue;
    }
    if (n.tagName == 'traits') {
      continue;
    }
    key = traits[j];
    val = this.readValue(n);
    j = j + 1;
    obj[key] = val;
    if (j > traits.length) {
      Ext.raise('Too many items for object, not enough traits: ' + className);
    }
  }
  return obj;
}, readArray:function(node) {
  var arr = [], n, i, j, l, name, val, len, childnodes, cn;
  this.objectReferences.push(arr);
  len = parseInt(node.getAttributeNode('length').value);
  i = 0;
  for (l = 0; l < node.childNodes.length; l++) {
    n = node.childNodes.item(l);
    if (n.nodeType != 1) {
      continue;
    }
    if (n.tagName == 'item') {
      name = n.getAttributeNode('name').value;
      childnodes = n.childNodes;
      for (j = 0; j < childnodes.length; j++) {
        cn = childnodes.item(j);
        if (cn.nodeType != 1) {
          continue;
        }
        val = this.readValue(cn);
        break;
      }
      arr[name] = val;
    } else {
      arr[i] = this.readValue(n);
      i++;
      if (i > len) {
        Ext.raise('Array has more items than declared length: ' + i + ' \x3e ' + len);
      }
    }
  }
  if (i < len) {
    Ext.raise('Array has less items than declared length: ' + i + ' \x3c ' + len);
  }
  return arr;
}, readDictionary:function(node) {
  var dict = {}, key, val, i, j, n, len;
  len = parseInt(node.getAttribute('length'));
  this.objectReferences.push(dict);
  key = null;
  val = null;
  j = 0;
  for (i = 0; i < node.childNodes.length; i++) {
    n = node.childNodes.item(i);
    if (n.nodeType != 1) {
      continue;
    }
    if (!key) {
      key = this.readValue(n);
      continue;
    }
    val = this.readValue(n);
    j = j + 1;
    dict[key] = val;
    key = null;
    val = null;
  }
  if (j != len) {
    Ext.raise('Incorrect number of dictionary values: ' + j + ' !\x3d ' + len);
  }
  return dict;
}, convertObjectWithSourceField:function(node) {
  var i, n, val;
  for (i = 0; i < node.childNodes.length; i++) {
    n = node.childNodes.item(i);
    if (n.tagName == 'bytearray') {
      val = this.readValue(n);
      this.objectReferences.push(val);
      return val;
    }
  }
  return null;
}, converters:{'flex.messaging.io.ArrayCollection':function(decoder, node) {
  return decoder.convertObjectWithSourceField(node);
}, 'mx.collections.ArrayList':function(decoder, node) {
  return decoder.convertObjectWithSourceField(node);
}, 'mx.collections.ArrayCollection':function(decoder, node) {
  return decoder.convertObjectWithSourceField(node);
}}});
Ext.define('Ext.data.amf.XmlEncoder', {alias:'data.amf.xmlencoder', body:'', statics:{generateFlexUID:function(id) {
  var uid = '', i, j, t;
  if (id === undefined) {
    id = Ext.Number.randomInt(0, 4.294967295E9);
  }
  t = (id + 4.294967296E9).toString(16).toUpperCase();
  uid = t.substr(t.length - 8, 8);
  for (j = 0; j < 3; j++) {
    uid += '-';
    for (i = 0; i < 4; i++) {
      uid += Ext.Number.randomInt(0, 15).toString(16).toUpperCase();
    }
  }
  uid += '-';
  t = (new Number(new Date)).valueOf().toString(16).toUpperCase();
  j = 0;
  if (t.length < 8) {
    for (i = 0; i < t.length - 8; i++) {
      j++;
      uid += '0';
    }
  }
  uid += t.substr(-(8 - j));
  for (i = 0; i < 4; i++) {
    uid += Ext.Number.randomInt(0, 15).toString(16).toUpperCase();
  }
  return uid;
}}, constructor:function(config) {
  this.initConfig(config);
  this.clear();
}, clear:function() {
  this.body = '';
}, encodeUndefined:function() {
  return this.encodeNull();
}, writeUndefined:function() {
  this.write(this.encodeUndefined());
}, encodeNull:function() {
  return '\x3cnull /\x3e';
}, writeNull:function() {
  this.write(this.encodeNull());
}, encodeBoolean:function(val) {
  var str;
  if (val) {
    str = '\x3ctrue /\x3e';
  } else {
    str = '\x3cfalse /\x3e';
  }
  return str;
}, writeBoolean:function(val) {
  this.write(this.encodeBoolean(val));
}, encodeString:function(str) {
  var ret;
  if (str === '') {
    ret = '\x3cstring /\x3e';
  } else {
    ret = '\x3cstring\x3e' + str + '\x3c/string\x3e';
  }
  return ret;
}, writeString:function(str) {
  this.write(this.encodeString(str));
}, encodeInt:function(num) {
  return '\x3cint\x3e' + num.toString() + '\x3c/int\x3e';
}, writeInt:function(num) {
  this.write(this.encodeInt(num));
}, encodeDouble:function(num) {
  return '\x3cdouble\x3e' + num.toString() + '\x3c/double\x3e';
}, writeDouble:function(num) {
  this.write(this.encodeDouble(num));
}, encodeNumber:function(num) {
  var maxInt = 536870911, minSignedInt = -268435455;
  if (typeof num !== 'number' && !(num instanceof Number)) {
    Ext.log.warn("Encoder: writeNumber argument is not numeric. Can't coerce.");
  }
  if (num instanceof Number) {
    num = num.valueOf();
  }
  if (num % 1 === 0 && num >= minSignedInt && num <= maxInt) {
    return this.encodeInt(num);
  } else {
    return this.encodeDouble(num);
  }
}, writeNumber:function(num) {
  this.write(this.encodeNumber(num));
}, encodeDate:function(date) {
  return '\x3cdate\x3e' + (new Number(date)).toString() + '\x3c/date\x3e';
}, writeDate:function(date) {
  this.write(this.encodeDate(date));
}, encodeEcmaElement:function(key, value) {
  var str = '\x3citem name\x3d"' + key.toString() + '"\x3e' + this.encodeObject(value) + '\x3c/item\x3e';
  return str;
}, encodeArray:function(array) {
  var ordinals = [], firstNonOrdinal, ecmaElements = [], i, str;
  for (i in array) {
    if (Ext.isNumeric(i) && i % 1 === 0) {
      ordinals[i] = this.encodeObject(array[i]);
    } else {
      ecmaElements.push(this.encodeEcmaElement(i, array[i]));
    }
  }
  firstNonOrdinal = ordinals.length;
  for (i = 0; i < ordinals.length; i++) {
    if (ordinals[i] === undefined) {
      firstNonOrdinal = i;
      break;
    }
  }
  if (firstNonOrdinal < ordinals.length) {
    for (i = firstNonOrdinal; i < ordinals.length; i++) {
      if (ordinals[i] !== undefined) {
        ecmaElements.push(this.encodeEcmaElement(i, ordinals[i]));
      }
    }
    ordinals = ordinals.slice(0, firstNonOrdinal);
  }
  str = '\x3carray length\x3d"' + ordinals.length + '"';
  if (ecmaElements.length > 0) {
    str += ' ecma\x3d"true"';
  }
  str += '\x3e';
  for (i = 0; i < ordinals.length; i++) {
    str += ordinals[i];
  }
  for (i in ecmaElements) {
    str += ecmaElements[i];
  }
  str += '\x3c/array\x3e';
  return str;
}, writeArray:function(array) {
  this.write(this.encodeArray(array));
}, encodeXml:function(xml) {
  var str = this.convertXmlToString(xml);
  return '\x3cxml\x3e\x3c![CDATA[' + str + ']]\x3e\x3c/xml\x3e';
}, writeXml:function(xml) {
  this.write(this.encodeXml(xml));
}, encodeGenericObject:function(obj) {
  var traits = [], values = [], flexType = null, i, str;
  for (i in obj) {
    if (i === '$flexType') {
      flexType = obj[i];
    } else {
      traits.push(this.encodeString(new String(i)));
      values.push(this.encodeObject(obj[i]));
    }
  }
  if (flexType) {
    str = '\x3cobject type\x3d"' + flexType + '"\x3e';
  } else {
    str = '\x3cobject\x3e';
  }
  if (traits.length > 0) {
    str += '\x3ctraits\x3e';
    str += traits.join('');
    str += '\x3c/traits\x3e';
  } else {
    str += '\x3ctraits /\x3e';
  }
  str += values.join('');
  str += '\x3c/object\x3e';
  return str;
}, writeGenericObject:function(obj) {
  this.write(this.encodeGenericObject(obj));
}, encodeByteArray:function(array) {
  var str, i, h;
  if (array.length > 0) {
    str = '\x3cbytearray\x3e';
    for (i = 0; i < array.length; i++) {
      if (!Ext.isNumber(array[i])) {
        Ext.raise('Byte array contains a non-number: ' + array[i] + ' in index: ' + i);
      }
      if (array[i] < 0 || array[i] > 255) {
        Ext.raise('Byte array value out of bounds: ' + array[i]);
      }
      h = array[i].toString(16).toUpperCase();
      if (array[i] < 16) {
        h = '0' + h;
      }
      str += h;
    }
    str += '\x3c/bytearray\x3e';
  } else {
    str = '\x3cbytearray /\x3e';
  }
  return str;
}, writeByteArray:function(array) {
  this.write(this.encodeByteArray(array));
}, encodeObject:function(item) {
  var t = typeof item;
  if (t === 'undefined') {
    return this.encodeUndefined();
  } else {
    if (item === null) {
      return this.encodeNull();
    } else {
      if (Ext.isBoolean(item)) {
        return this.encodeBoolean(item);
      } else {
        if (Ext.isString(item)) {
          return this.encodeString(item);
        } else {
          if (t === 'number' || item instanceof Number) {
            return this.encodeNumber(item);
          } else {
            if (t === 'object') {
              if (item instanceof Date) {
                return this.encodeDate(item);
              } else {
                if (Ext.isArray(item)) {
                  return this.encodeArray(item);
                } else {
                  if (this.isXmlDocument(item)) {
                    return this.encodeXml(item);
                  } else {
                    return this.encodeGenericObject(item);
                  }
                }
              }
            } else {
              Ext.log.warn('AMFX Encoder: Unknown item type ' + t + " can't be written to stream: " + item);
            }
          }
        }
      }
    }
  }
  return null;
}, writeObject:function(item) {
  this.write(this.encodeObject(item));
}, encodeAmfxRemotingPacket:function(message) {
  var str = '\x3camfx ver\x3d"3" xmlns\x3d"http://www.macromedia.com/2005/amfx"\x3e\x3cbody\x3e' + message.encodeMessage() + '\x3c/body\x3e\x3c/amfx\x3e';
  return str;
}, writeAmfxRemotingPacket:function(message) {
  this.write(this.encodeAmfxRemotingPacket(message));
}, convertXmlToString:function(xml) {
  var str;
  if (window.XMLSerializer) {
    str = (new window.XMLSerializer).serializeToString(xml);
  } else {
    str = xml.xml;
  }
  return str;
}, isXmlDocument:function(item) {
  if (window.DOMParser) {
    if (Ext.isDefined(item.doctype)) {
      return true;
    }
  }
  if (Ext.isString(item.xml)) {
    return true;
  }
  return false;
}, write:function(str) {
  this.body += str;
}});
Ext.define('Ext.direct.AmfRemotingProvider', {alias:'direct.amfremotingprovider', extend:'Ext.direct.Provider', requires:['Ext.util.MixedCollection', 'Ext.util.DelayedTask', 'Ext.direct.Transaction', 'Ext.direct.RemotingMethod', 'Ext.data.amf.XmlEncoder', 'Ext.data.amf.XmlDecoder', 'Ext.data.amf.Encoder', 'Ext.data.amf.Packet', 'Ext.data.amf.RemotingMessage', 'Ext.direct.ExceptionEvent'], binary:false, maxRetries:1, timeout:undefined, constructor:function(config) {
  var me = this;
  me.callParent(arguments);
  me.namespace = Ext.isString(me.namespace) ? Ext.ns(me.namespace) : me.namespace || window;
  me.transactions = new Ext.util.MixedCollection;
  me.callBuffer = [];
}, initAPI:function() {
  var actions = this.actions, namespace = this.namespace, action, cls, methods, i, len, method;
  for (action in actions) {
    if (actions.hasOwnProperty(action)) {
      cls = namespace[action];
      if (!cls) {
        cls = namespace[action] = {};
      }
      methods = actions[action];
      for (i = 0, len = methods.length; i < len; ++i) {
        method = new Ext.direct.RemotingMethod(methods[i]);
        cls[method.name] = this.createHandler(action, method);
      }
    }
  }
}, createHandler:function(action, method) {
  var me = this, handler;
  if (!method.formHandler) {
    handler = function() {
      me.configureRequest(action, method, Array.prototype.slice.call(arguments, 0));
    };
  } else {
    handler = function(form, callback, scope) {
      me.configureFormRequest(action, method, form, callback, scope);
    };
  }
  handler.directCfg = {action:action, method:method};
  return handler;
}, isConnected:function() {
  return !!this.connected;
}, connect:function() {
  var me = this;
  if (me.url) {
    me.clientId = Ext.data.amf.XmlEncoder.generateFlexUID();
    me.initAPI();
    me.connected = true;
    me.fireEvent('connect', me);
    me.DSId = null;
  } else {
    if (!me.url) {
      Ext.raise('Error initializing RemotingProvider, no url configured.');
    }
  }
}, disconnect:function() {
  var me = this;
  if (me.connected) {
    me.connected = false;
    me.fireEvent('disconnect', me);
  }
}, runCallback:function(transaction, event) {
  var success = !!event.status, funcName = success ? 'success' : 'failure', callback, result;
  if (transaction && transaction.callback) {
    callback = transaction.callback;
    result = Ext.isDefined(event.result) ? event.result : event.data;
    if (Ext.isFunction(callback)) {
      callback(result, event, success);
    } else {
      Ext.callback(callback[funcName], callback.scope, [result, event, success]);
      Ext.callback(callback.callback, callback.scope, [result, event, success]);
    }
  }
}, onData:function(options, success, response) {
  var me = this, i = 0, len, events, event, transaction, transactions;
  if (success) {
    events = me.createEvents(response);
    for (len = events.length; i < len; ++i) {
      event = events[i];
      transaction = me.getTransaction(event);
      me.fireEvent('data', me, event);
      if (transaction) {
        me.runCallback(transaction, event, true);
        Ext.direct.Manager.removeTransaction(transaction);
      }
    }
  } else {
    transactions = [].concat(options.transaction);
    for (len = transactions.length; i < len; ++i) {
      transaction = me.getTransaction(transactions[i]);
      if (transaction && transaction.retryCount < me.maxRetries) {
        transaction.retry();
      } else {
        event = new Ext.direct.ExceptionEvent({data:null, transaction:transaction, code:Ext.direct.Manager.exceptions.TRANSPORT, message:'Unable to connect to the server.', xhr:response});
        me.fireEvent('data', me, event);
        if (transaction) {
          me.runCallback(transaction, event, false);
          Ext.direct.Manager.removeTransaction(transaction);
        }
      }
    }
  }
}, getTransaction:function(options) {
  return options && options.tid ? Ext.direct.Manager.getTransaction(options.tid) : null;
}, configureRequest:function(action, method, args) {
  var me = this, callData = method.getCallData(args), data = callData.data, callback = callData.callback, scope = callData.scope, transaction;
  transaction = new Ext.direct.Transaction({provider:me, args:args, action:action, method:method.name, data:data, callback:scope && Ext.isFunction(callback) ? callback.bind(scope) : callback});
  if (me.fireEvent('beforecall', me, transaction, method) !== false) {
    Ext.direct.Manager.addTransaction(transaction);
    me.queueTransaction(transaction);
    me.fireEvent('call', me, transaction, method);
  }
}, getCallData:function(transaction) {
  if (this.binary) {
    return {targetUri:transaction.action + '.' + transaction.method, responseUri:'/' + transaction.id, body:transaction.data || []};
  } else {
    return new Ext.data.amf.RemotingMessage({body:transaction.data || [], clientId:this.clientId, destination:transaction.action, headers:{DSEndpoint:this.endpoint, DSId:this.DSId || 'nil'}, messageId:Ext.data.amf.XmlEncoder.generateFlexUID(transaction.id), operation:transaction.method, timestamp:0, timeToLive:0});
  }
}, sendRequest:function(data) {
  var me = this, request = {url:me.url, callback:me.onData, scope:me, transaction:data, timeout:me.timeout}, i = 0, len, encoder, amfMessages = [], amfHeaders = [];
  if (Ext.isArray(data)) {
    if (!me.binary) {
      Ext.raise('Mutltiple messages in the same call are not supported in AMFX');
    }
    for (len = data.length; i < len; ++i) {
      amfMessages.push(me.getCallData(data[i]));
    }
  } else {
    amfMessages.push(me.getCallData(data));
  }
  if (me.binary) {
    encoder = new Ext.data.amf.Encoder({format:0});
    encoder.writeAmfPacket(amfHeaders, amfMessages);
    request.binaryData = encoder.bytes;
    request.binary = true;
    request.headers = {'Content-Type':'application/x-amf'};
  } else {
    encoder = new Ext.data.amf.XmlEncoder;
    encoder.writeAmfxRemotingPacket(amfMessages[0]);
    request.xmlData = encoder.body;
  }
  Ext.Ajax.request(request);
}, queueTransaction:function(transaction) {
  var me = this, enableBuffer = false;
  if (transaction.form) {
    me.sendFormRequest(transaction);
    return;
  }
  me.callBuffer.push(transaction);
  if (enableBuffer) {
    if (!me.callTask) {
      me.callTask = new Ext.util.DelayedTask(me.combineAndSend, me);
    }
    me.callTask.delay(Ext.isNumber(enableBuffer) ? enableBuffer : 10);
  } else {
    me.combineAndSend();
  }
}, combineAndSend:function() {
  var buffer = this.callBuffer, len = buffer.length;
  if (len > 0) {
    this.sendRequest(len === 1 ? buffer[0] : buffer);
    this.callBuffer = [];
  }
}, configureFormRequest:function(action, method, form, callback, scope) {
  Ext.raise('Form requests are not supported for AmfRemoting');
}, sendFormRequest:function(transaction) {
  Ext.raise('Form requests are not supported for AmfRemoting');
}, createEvents:function(response) {
  var data = null, events = [], event, i = 0, decoder;
  try {
    if (this.binary) {
      decoder = new Ext.data.amf.Packet;
      data = decoder.decode(response.responseBytes);
    } else {
      decoder = new Ext.data.amf.XmlDecoder;
      data = decoder.readAmfxMessage(response.responseText);
    }
  } catch (e$0) {
    event = new Ext.direct.ExceptionEvent({data:e$0, xhr:response, code:Ext.direct.Manager.exceptions.PARSE, message:'Error parsing AMF response: \n\n ' + data});
    return [event];
  }
  if (this.binary) {
    for (i = 0; i < data.messages.length; i++) {
      events.push(this.createEvent(data.messages[i]));
    }
  } else {
    events.push(this.createEvent(data));
  }
  return events;
}, createEvent:function(response) {
  var status = response.targetURI.split('/'), tid, event, data, statusIndex, me = this;
  if (me.binary) {
    tid = status[1];
    statusIndex = 2;
  } else {
    tid = Ext.data.amf.XmlDecoder.decodeTidFromFlexUID(response.message.correlationId);
    statusIndex = 1;
  }
  if (status[statusIndex] === 'onStatus') {
    data = {tid:tid, data:me.binary ? response.body : response.message};
    event = Ext.create('direct.exception', data);
  } else {
    if (status[statusIndex] === 'onResult') {
      data = {tid:tid, data:me.binary ? response.body : response.message.body};
      event = Ext.create('direct.rpc', data);
    } else {
      Ext.raise('Unknown AMF return status: ' + status[statusIndex]);
    }
  }
  return event;
}});
