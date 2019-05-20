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
Ext.define('Ext.data.proxy.Sql', {alias:'proxy.sql', extend:'Ext.data.proxy.Client', alternateClassName:'Ext.data.proxy.SQL', isSQLProxy:true, config:{reader:null, writer:null, table:null, database:'Sencha'}, _createOptions:{silent:true, dirty:false}, updateModel:function(model) {
  var me = this, modelName, len, i, columns, quoted;
  if (model) {
    me.uniqueIdStrategy = model.identifier.isUnique;
    if (!me.getTable()) {
      modelName = model.entityName;
      me.setTable(modelName.slice(modelName.lastIndexOf('.') + 1));
    }
    me.columns = columns = me.getPersistedModelColumns(model);
    me.quotedColumns = quoted = [];
    for (i = 0, len = columns.length; i < len; ++i) {
      quoted.push('"' + columns[i] + '"');
    }
  }
  me.callParent([model]);
}, setException:function(operation, error) {
  operation.setException(error);
}, create:function(operation) {
  var me = this, records = operation.getRecords(), result, error;
  operation.setStarted();
  me.executeTransaction(function(transaction) {
    me.insertRecords(records, transaction, function(resultSet, statementError) {
      result = resultSet;
      error = statementError;
    });
  }, function(transactionError) {
    operation.setException(transactionError);
  }, function() {
    if (error) {
      operation.setException(statementError);
    } else {
      operation.process(result);
    }
  });
}, read:function(operation) {
  var me = this, model = me.getModel(), records = operation.getRecords(), record = records ? records[0] : null, result, error, id, params;
  if (record && !record.phantom) {
    id = record.getId();
  } else {
    id = operation.getId();
  }
  if (id !== undefined) {
    params = {idOnly:true, id:id};
  } else {
    params = {page:operation.getPage(), start:operation.getStart(), limit:operation.getLimit(), sorters:operation.getSorters(), filters:operation.getFilters()};
  }
  operation.setStarted();
  me.executeTransaction(function(transaction) {
    me.selectRecords(transaction, params, function(resultSet, statementError) {
      result = resultSet;
      error = statementError;
    });
  }, function(transactionError) {
    operation.setException(transactionError);
  }, function() {
    if (error) {
      operation.setException(statementError);
    } else {
      operation.process(result);
    }
  });
}, update:function(operation) {
  var me = this, records = operation.getRecords(), result, error;
  operation.setStarted();
  me.executeTransaction(function(transaction) {
    me.updateRecords(transaction, records, function(resultSet, statementError) {
      result = resultSet;
      error = statementError;
    });
  }, function(transactionError) {
    operation.setException(transactionError);
  }, function() {
    if (error) {
      operation.setException(statementError);
    } else {
      operation.process(result);
    }
  });
}, erase:function(operation) {
  var me = this, records = operation.getRecords(), result, error;
  operation.setStarted();
  me.executeTransaction(function(transaction) {
    me.destroyRecords(transaction, records, function(resultSet, statementError) {
      result = resultSet;
      error = statementError;
    });
  }, function(transactionError) {
    operation.setException(transactionError);
  }, function() {
    if (error) {
      operation.setException(error);
    } else {
      operation.process(result);
    }
  });
}, createTable:function(transaction) {
  var me = this;
  if (!transaction) {
    me.executeTransaction(function(transaction) {
      me.createTable(transaction);
    });
    return;
  }
  me.executeStatement(transaction, 'CREATE TABLE IF NOT EXISTS "' + me.getTable() + '" (' + me.getSchemaString() + ')', function() {
    me.tableExists = true;
  });
}, insertRecords:function(records, transaction, callback) {
  var me = this, columns = me.columns, totalRecords = records.length, executed = 0, uniqueIdStrategy = me.uniqueIdStrategy, setOptions = me._createOptions, len = records.length, i, record, placeholders, sql, data, values, errors, completeIf;
  completeIf = function(transaction) {
    ++executed;
    if (executed === totalRecords) {
      callback.call(me, new Ext.data.ResultSet({success:!errors}), errors);
    }
  };
  placeholders = Ext.String.repeat('?', columns.length, ',');
  sql = 'INSERT INTO "' + me.getTable() + '" (' + me.quotedColumns.join(',') + ') VALUES (' + placeholders + ')';
  for (i = 0; i < len; ++i) {
    record = records[i];
    data = me.getRecordData(record);
    values = me.getColumnValues(columns, data);
    (function(record) {
      me.executeStatement(transaction, sql, values, function(transaction, resultSet) {
        if (!uniqueIdStrategy) {
          record.setId(resultSet.insertId, setOptions);
        }
        completeIf();
      }, function(transaction, error) {
        if (!errors) {
          errors = [];
        }
        errors.push(error);
        completeIf();
      });
    })(record);
  }
}, selectRecords:function(transaction, params, callback, scope) {
  var me = this, Model = me.getModel(), idProperty = Model.idProperty, sql = 'SELECT * FROM "' + me.getTable() + '"', filterStatement = ' WHERE ', sortStatement = ' ORDER BY ', values = [], sorters, filters, placeholder, i, len, result, filter, sorter, property, operator, value;
  if (params.idOnly) {
    sql += filterStatement + '"' + idProperty + '" \x3d ?';
    values.push(params);
  } else {
    filters = params.filters;
    len = filters && filters.length;
    if (len) {
      for (i = 0; i < len; i++) {
        filter = filters[i];
        property = filter.getProperty();
        value = me.toSqlValue(filter.getValue(), Model.getField(property));
        operator = filter.getOperator();
        if (property !== null) {
          operator = operator || '\x3d';
          placeholder = '?';
          if (operator === 'like' || operator === '\x3d' && filter.getAnyMatch()) {
            operator = 'LIKE';
            value = '%' + value + '%';
          }
          if (operator === 'in' || operator === 'notin') {
            if (operator === 'notin') {
              operator = 'not in';
            }
            placeholder = '(' + Ext.String.repeat('?', value.length, ',') + ')';
            values = values.concat(value);
          } else {
            values.push(value);
          }
          sql += filterStatement + '"' + property + '" ' + operator + ' ' + placeholder;
          filterStatement = ' AND ';
        }
      }
    }
    sorters = params.sorters;
    len = sorters && sorters.length;
    if (len) {
      for (i = 0; i < len; i++) {
        sorter = sorters[i];
        property = sorter.getProperty();
        if (property !== null) {
          sql += sortStatement + '"' + property + '" ' + sorter.getDirection();
          sortStatement = ', ';
        }
      }
    }
    if (params.page !== undefined) {
      sql += ' LIMIT ' + parseInt(params.start, 10) + ', ' + parseInt(params.limit, 10);
    }
  }
  me.executeStatement(transaction, sql, values, function(transaction, resultSet) {
    var rows = resultSet.rows, count = rows.length, records = [], fields = Model.fields, fieldsLen = fields.length, raw, data, i, len, j, field, name;
    for (i = 0, len = count; i < len; ++i) {
      raw = rows.item(i);
      data = {};
      for (j = 0; j < fieldsLen; ++j) {
        field = fields[j];
        name = field.name;
        data[name] = me.fromSqlValue(raw[name], field);
      }
      records.push(new Model(data));
    }
    callback.call(me, new Ext.data.ResultSet({records:records, success:true, total:count, count:count}));
  }, function(transaction, error) {
    callback.call(me, new Ext.data.ResultSet({success:false, total:0, count:0}), error);
  });
}, updateRecords:function(transaction, records, callback) {
  var me = this, columns = me.columns, quotedColumns = me.quotedColumns, totalRecords = records.length, executed = 0, updates = [], setOptions = me._createOptions, len, i, record, placeholders, sql, data, values, errors, completeIf;
  completeIf = function(transaction) {
    ++executed;
    if (executed === totalRecords) {
      callback.call(me, new Ext.data.ResultSet({success:!errors}), errors);
    }
  };
  for (i = 0, len = quotedColumns.length; i < len; i++) {
    updates.push(quotedColumns[i] + ' \x3d ?');
  }
  sql = 'UPDATE "' + me.getTable() + '" SET ' + updates.join(', ') + ' WHERE "' + me.getModel().idProperty + '" \x3d ?';
  for (i = 0, len = records.length; i < len; ++i) {
    record = records[i];
    data = me.getRecordData(record);
    values = me.getColumnValues(columns, data);
    values.push(record.getId());
    (function(record) {
      me.executeStatement(transaction, sql, values, function(transaction, resultSet) {
        completeIf();
      }, function(transaction, error) {
        if (!errors) {
          errors = [];
        }
        errors.push(error);
        completeIf();
      });
    })(record);
  }
}, destroyRecords:function(transaction, records, callback) {
  var me = this, table = me.getTable(), idProperty = me.getModel().idProperty, ids = [], values = [], destroyedRecords = [], len = records.length, idStr = '"' + idProperty + '" \x3d ?', i, result, record, sql;
  for (i = 0; i < len; i++) {
    ids.push(idStr);
    values.push(records[i].getId());
  }
  sql = 'DELETE FROM "' + me.getTable() + '" WHERE ' + ids.join(' OR ');
  me.executeStatement(transaction, sql, values, function(transaction, resultSet) {
    callback.call(me, new Ext.data.ResultSet({success:true}));
  }, function(transaction, error) {
    callback.call(me, new Ext.data.ResultSet({success:false}), error);
  });
}, getRecordData:function(record) {
  var me = this, fields = record.fields, idProperty = record.idProperty, uniqueIdStrategy = me.uniqueIdStrategy, data = {}, len = fields.length, recordData = record.data, i, name, value, field;
  for (i = 0; i < len; ++i) {
    field = fields[i];
    if (field.persist !== false) {
      name = field.name;
      if (name === idProperty && !uniqueIdStrategy) {
        continue;
      }
      data[name] = me.toSqlValue(recordData[name], field);
    }
  }
  return data;
}, getColumnValues:function(columns, data) {
  var len = columns.length, values = [], i, column, value;
  for (i = 0; i < len; i++) {
    column = columns[i];
    value = data[column];
    if (value !== undefined) {
      values.push(value);
    }
  }
  return values;
}, getSchemaString:function() {
  var me = this, schema = [], model = me.getModel(), idProperty = model.idProperty, fields = model.fields, uniqueIdStrategy = me.uniqueIdStrategy, len = fields.length, i, field, type, name;
  for (i = 0; i < len; i++) {
    field = fields[i];
    type = field.getType();
    name = field.name;
    if (name === idProperty) {
      if (uniqueIdStrategy) {
        type = me.convertToSqlType(type);
        schema.unshift('"' + idProperty + '" ' + type);
      } else {
        schema.unshift('"' + idProperty + '" INTEGER PRIMARY KEY AUTOINCREMENT');
      }
    } else {
      type = me.convertToSqlType(type);
      schema.push('"' + name + '" ' + type);
    }
  }
  return schema.join(', ');
}, convertToSqlType:function(type) {
  switch(type.toLowerCase()) {
    case 'string':
    case 'auto':
      return 'TEXT';
    case 'int':
    case 'date':
      return 'INTEGER';
    case 'float':
      return 'REAL';
    case 'bool':
      return 'NUMERIC';
  }
}, dropTable:function() {
  var me = this;
  me.executeTransaction(function(transaction) {
    me.executeStatement(transaction, 'DROP TABLE "' + me.getTable() + '"', function() {
      me.tableExists = false;
    });
  }, null, null, false);
}, getDatabaseObject:function() {
  return window.openDatabase(this.getDatabase(), '1.0', 'Sencha Database', 5 * 1024 * 1024);
}, privates:{executeStatement:function(transaction, sql, values, success, failure) {
  var me = this;
  transaction.executeSql(sql, values, success ? function() {
    success.apply(me, arguments);
  } : null, failure ? function() {
    failure.apply(me, arguments);
  } : null);
}, executeTransaction:function(runner, failure, success, autoCreateTable) {
  var me = this;
  autoCreateTable = autoCreateTable !== false;
  me.getDatabaseObject().transaction(runner ? function(transaction) {
    if (autoCreateTable && !me.tableExists) {
      me.createTable(transaction);
    }
    runner.apply(me, arguments);
  } : null, failure ? function() {
    failure.apply(me, arguments);
  } : null, success ? function() {
    success.apply(me, arguments);
  } : null);
}, fromSqlValue:function(value, field) {
  if (field.isDateField) {
    value = value ? new Date(value) : null;
  } else {
    if (field.isBooleanField) {
      value = value === 1;
    }
  }
  return value;
}, getPersistedModelColumns:function(model) {
  var fields = model.fields, uniqueIdStrategy = this.uniqueIdStrategy, idProperty = model.idProperty, columns = [], len = fields.length, i, field, name;
  for (i = 0; i < len; ++i) {
    field = fields[i];
    name = field.name;
    if (name === idProperty && !uniqueIdStrategy) {
      continue;
    }
    if (field.persist !== false) {
      columns.push(field.name);
    }
  }
  return columns;
}, toSqlValue:function(value, field) {
  if (field.isDateField) {
    value = value ? value.getTime() : null;
  } else {
    if (field.isBooleanField) {
      value = value ? 1 : 0;
    }
  }
  return value;
}}});
Ext.define('Ext.device.accelerometer.Abstract', {config:{frequency:10000}, getCurrentAcceleration:function(config) {
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getCurrentAcceleration');
  }
  return config;
}, watchAcceleration:function(config) {
  var defaultConfig = Ext.device.accelerometer.Abstract.prototype.config;
  config = Ext.applyIf(config, {frequency:defaultConfig.frequency});
  if (!config.callback) {
    Ext.Logger.warn('You need to specify a `callback` function for #watchAcceleration');
  }
  return config;
}, clearWatch:Ext.emptyFn});
Ext.define('Ext.device.accelerometer.Cordova', {alternateClassName:'Ext.device.accelerometer.PhoneGap', extend:'Ext.device.accelerometer.Abstract', activeWatchID:null, getCurrentAcceleration:function(config) {
  config = this.callParent(arguments);
  navigator.accelerometer.getCurrentAcceleration(config.success, config.failure);
  return config;
}, watchAcceleration:function(config) {
  config = this.callParent(arguments);
  if (this.activeWatchID) {
    this.clearWatch();
  }
  this.activeWatchID = navigator.accelerometer.watchAcceleration(config.callback, config.failure, config);
  return config;
}, clearWatch:function() {
  if (this.activeWatchID) {
    navigator.accelerometer.clearWatch(this.activeWatchID);
    this.activeWatchID = null;
  }
}});
Ext.define('Ext.device.accelerometer.Simulator', {extend:'Ext.device.accelerometer.Abstract'});
Ext.define('Ext.device.Accelerometer', {singleton:true, requires:['Ext.device.accelerometer.Cordova', 'Ext.device.accelerometer.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView && browserEnv.Cordova) {
    return Ext.create('Ext.device.accelerometer.Cordova');
  }
  return Ext.create('Ext.device.accelerometer.Simulator');
}});
Ext.define('Ext.device.communicator.Default', {SERVER_URL:'http://localhost:3000', callbackDataMap:{}, callbackIdMap:{}, idSeed:0, globalScopeId:'0', generateId:function() {
  return String(++this.idSeed);
}, getId:function(object) {
  var id = object.$callbackId;
  if (!id) {
    object.$callbackId = id = this.generateId();
  }
  return id;
}, getCallbackId:function(callback, scope) {
  var idMap = this.callbackIdMap, dataMap = this.callbackDataMap, id, scopeId, callbackId, data;
  if (!scope) {
    scopeId = this.globalScopeId;
  } else {
    if (scope.isIdentifiable) {
      scopeId = scope.getId();
    } else {
      scopeId = this.getId(scope);
    }
  }
  callbackId = this.getId(callback);
  if (!idMap[scopeId]) {
    idMap[scopeId] = {};
  }
  if (!idMap[scopeId][callbackId]) {
    id = this.generateId();
    data = {callback:callback, scope:scope};
    idMap[scopeId][callbackId] = id;
    dataMap[id] = data;
  }
  return idMap[scopeId][callbackId];
}, getCallbackData:function(id) {
  return this.callbackDataMap[id];
}, invoke:function(id, args) {
  var data = this.getCallbackData(id);
  data.callback.apply(data.scope, args);
}, send:function(args) {
  var callbacks, scope, name, callback;
  if (!args) {
    args = {};
  } else {
    if (args.callbacks) {
      callbacks = args.callbacks;
      scope = args.scope;
      delete args.callbacks;
      delete args.scope;
      for (name in callbacks) {
        if (callbacks.hasOwnProperty(name)) {
          callback = callbacks[name];
          if (typeof callback == 'function') {
            args[name] = this.getCallbackId(callback, scope);
          }
        }
      }
    }
  }
  args.__source = document.location.href;
  var result = this.doSend(args);
  return result && result.length > 0 ? JSON.parse(result) : null;
}, doSend:function(args) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', this.SERVER_URL + '?' + Ext.Object.toQueryString(args) + '\x26_dc\x3d' + (new Date).getTime(), false);
  try {
    xhr.send(null);
    return xhr.responseText;
  } catch (e$0) {
    if (args.failure) {
      this.invoke(args.failure);
    } else {
      if (args.callback) {
        this.invoke(args.callback);
      }
    }
  }
}});
Ext.define('Ext.device.communicator.Android', {extend:'Ext.device.communicator.Default', doSend:function(args) {
  return window.Sencha.action(JSON.stringify(args));
}});
Ext.define('Ext.device.Communicator', {requires:['Ext.device.communicator.Default', 'Ext.device.communicator.Android'], singleton:true, constructor:function() {
  if (Ext.os.is.Android) {
    return new Ext.device.communicator.Android;
  }
  return new Ext.device.communicator.Default;
}});
Ext.define('Ext.device.analytics.Abstract', {config:{accountID:null}, updateAccountID:function(newID) {
  if (newID) {
    window.plugins.googleAnalyticsPlugin.startTrackerWithAccountID(newID);
  }
}, registerAccount:function(accountID) {
  this.setAccountID(accountID);
}, trackEvent:Ext.emptyFn, trackPageview:Ext.emptyFn});
Ext.define('Ext.device.analytics.Cordova', {extend:'Ext.device.analytics.Abstract', trackEvent:function(config) {
  if (!this.getAccountID()) {
    return;
  }
  window.plugins.googleAnalyticsPlugin.trackEvent(config.category, config.action, config.label, config.value, config.nonInteraction);
}, trackPageview:function(page) {
  if (!this.getAccountID()) {
    return;
  }
  window.plugins.googleAnalyticsPlugin.trackPageview(page);
}});
Ext.define('Ext.device.Analytics', {alternateClassName:'Ext.ux.device.Analytics', singleton:true, requires:['Ext.device.Communicator', 'Ext.device.analytics.*'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView && browserEnv.Cordova) {
    return Ext.create('Ext.device.analytics.Cordova');
  } else {
    return Ext.create('Ext.device.analytics.Abstract');
  }
}});
Ext.define('Ext.device.browser.Abstract', {open:Ext.emptyFn, close:Ext.emptyFn});
Ext.define('Ext.device.browser.Cordova', {extend:'Ext.device.browser.Abstract', open:function(config) {
  if (!this._window) {
    this._window = Ext.create('Ext.device.browser.Window');
  }
  this._window.open(config);
  return this._window;
}, close:function() {
  if (!this._window) {
    return;
  }
  this._window.close();
}});
Ext.define('Ext.device.browser.Simulator', {open:function(config) {
  window.open(config.url, '_blank');
}, close:Ext.emptyFn});
Ext.define('Ext.device.Browser', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.browser.Cordova', 'Ext.device.browser.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView && browserEnv.Cordova) {
    return Ext.create('Ext.device.browser.Cordova');
  }
  return Ext.create('Ext.device.browser.Simulator');
}});
Ext.define('Ext.device.camera.Abstract', {source:{library:0, camera:1, album:2}, destination:{data:0, file:1, 'native':2}, encoding:{jpeg:0, jpg:0, png:1}, media:{picture:0, video:1, all:2}, direction:{back:0, front:1}, capture:Ext.emptyFn, getPicture:Ext.emptyFn, cleanup:Ext.emptyFn});
Ext.define('Ext.device.camera.Cordova', {alternateClassName:'Ext.device.camera.PhoneGap', extend:'Ext.device.camera.Abstract', getPicture:function(onSuccess, onError, options) {
  try {
    navigator.camera.getPicture(onSuccess, onError, options);
  } catch (e$1) {
    alert(e$1);
  }
}, cleanup:function(onSuccess, onError) {
  try {
    navigator.camera.cleanup(onSuccess, onError);
  } catch (e$2) {
    alert(e$2);
  }
}, capture:function(args) {
  var onSuccess = args.success, onError = args.failure, scope = args.scope, sources = this.source, destinations = this.destination, encodings = this.encoding, source = args.source, destination = args.destination, encoding = args.encoding, options = {};
  if (scope) {
    onSuccess = Ext.Function.bind(onSuccess, scope);
    onError = Ext.Function.bind(onError, scope);
  }
  if (source !== undefined) {
    options.sourceType = sources.hasOwnProperty(source) ? sources[source] : source;
  }
  if (destination !== undefined) {
    options.destinationType = destinations.hasOwnProperty(destination) ? destinations[destination] : destination;
  }
  if (encoding !== undefined) {
    options.encodingType = encodings.hasOwnProperty(encoding) ? encodings[encoding] : encoding;
  }
  if ('quality' in args) {
    options.quality = args.quality;
  }
  if ('width' in args) {
    options.targetWidth = args.width;
  }
  if ('height' in args) {
    options.targetHeight = args.height;
  }
  this.getPicture(onSuccess, onError, options);
}});
Ext.define('Ext.device.camera.Simulator', {extend:'Ext.device.camera.Abstract', config:{samples:[{success:'http://www.sencha.com/img/sencha-large.png'}]}, constructor:function(config) {
  this.initConfig(config);
}, updateSamples:function(samples) {
  this.sampleIndex = 0;
}, capture:function(options) {
  var index = this.sampleIndex, samples = this.getSamples(), samplesCount = samples.length, sample = samples[index], scope = options.scope, success = options.success, failure = options.failure;
  if ('success' in sample) {
    if (success) {
      success.call(scope, sample.success);
    }
  } else {
    if (failure) {
      failure.call(scope, sample.failure);
    }
  }
  if (++index > samplesCount - 1) {
    index = 0;
  }
  this.sampleIndex = index;
}});
Ext.define('Ext.device.Camera', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.camera.Cordova', 'Ext.device.camera.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.camera.Cordova');
    }
  }
  return Ext.create('Ext.device.camera.Simulator');
}});
Ext.define('Ext.device.capture.Cordova', {captureAudio:function(config) {
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #captureAudio');
  }
  var options = {limit:config.limit, duration:config.maximumDuration};
  navigator.device.capture.captureAudio(config.success, config.failure, options);
}, captureVideo:function(config) {
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #captureVideo');
  }
  var options = {limit:config.limit, duration:config.maximumDuration};
  navigator.device.capture.captureVideo(config.success, config.failure, options);
}});
Ext.define('Ext.device.capture.Abstract', {alternateClassName:'Ext.device.capture.Simulator', captureAudio:Ext.emptyFn, captureVideo:Ext.emptyFn});
Ext.define('Ext.device.Capture', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.capture.Cordova', 'Ext.device.capture.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView && browserEnv.Cordova) {
    return Ext.create('Ext.device.capture.Cordova');
  }
  return Ext.create('Ext.device.capture.Simulator');
}});
Ext.define('Ext.device.compass.Abstract', {config:{frequency:100}, getHeadingAvailable:function(config) {
  if (!config.callback) {
    Ext.Logger.warn('You need to specify a `callback` function for #getHeadingAvailable');
  }
  return config;
}, getCurrentHeading:function(config) {
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getCurrentHeading');
  }
  return config;
}, watchHeading:function(config) {
  var defaultConfig = Ext.device.compass.Abstract.prototype.config;
  config = Ext.applyIf(config, {frequency:defaultConfig.frequency});
  if (!config.callback) {
    Ext.Logger.warn('You need to specify a `callback` function for #watchHeading');
  }
  return config;
}, clearWatch:Ext.emptyFn});
Ext.define('Ext.device.compass.Cordova', {alternateClassName:'Ext.device.compass.PhoneGap', extend:'Ext.device.compass.Abstract', activeWatchID:null, getHeadingAvailable:function(config) {
  var callback = function(result) {
    if (result.hasOwnProperty('code')) {
      config.callback.call(config.scope || this, false);
    } else {
      config.callback.call(config.scope || this, true);
    }
  };
  this.getCurrentHeading({success:callback, failure:callback});
}, getCurrentHeading:function(config) {
  config = this.callParent(arguments);
  navigator.compass.getCurrentHeading(config.success, config.failure);
  return config;
}, watchHeading:function(config) {
  config = this.callParent(arguments);
  if (this.activeWatchID) {
    this.clearWatch();
  }
  this.activeWatchID = navigator.compass.watchHeading(config.callback, config.failure, config);
  return config;
}, clearWatch:function() {
  if (this.activeWatchID) {
    navigator.compass.clearWatch(this.activeWatchID);
    this.activeWatchID = null;
  }
}});
Ext.define('Ext.device.compass.Simulator', {extend:'Ext.device.compass.Abstract'});
Ext.define('Ext.device.Compass', {singleton:true, requires:['Ext.device.compass.Cordova', 'Ext.device.compass.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView && browserEnv.Cordova) {
    return Ext.create('Ext.device.compass.Cordova');
  }
  return Ext.create('Ext.device.compass.Simulator');
}});
Ext.define('Ext.device.connection.Abstract', {extend:'Ext.Evented', mixins:['Ext.mixin.Observable'], config:{online:false, type:null}, UNKNOWN:'Unknown connection', ETHERNET:'Ethernet connection', WIFI:'WiFi connection', CELL_2G:'Cell 2G connection', CELL_3G:'Cell 3G connection', CELL_4G:'Cell 4G connection', NONE:'No network connection', isOnline:function() {
  return this.getOnline();
}});
Ext.define('Ext.device.connection.Cordova', {alternateClassName:'Ext.device.connection.PhoneGap', extend:'Ext.device.connection.Abstract', constructor:function() {
  var me = this;
  document.addEventListener('online', function() {
    me.fireEvent('online', me);
  });
  document.addEventListener('offline', function() {
    me.fireEvent('offline', me);
  });
}, syncOnline:function() {
  var type = navigator.connection.type;
  this._type = type;
  this._online = type != Connection.NONE;
}, getOnline:function() {
  this.syncOnline();
  return this._online;
}, getType:function() {
  this.syncOnline();
  return this._type;
}});
Ext.define('Ext.device.connection.Simulator', {extend:'Ext.device.connection.Abstract', getOnline:function() {
  this._online = navigator.onLine;
  this._type = Ext.device.Connection.UNKNOWN;
  return this._online;
}});
Ext.define('Ext.device.Connection', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.connection.Cordova', 'Ext.device.connection.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.connection.Cordova');
    }
  }
  return Ext.create('Ext.device.connection.Simulator');
}});
Ext.define('Ext.device.contacts.Abstract', {mixins:['Ext.mixin.Observable'], config:{includeImages:false}, getContacts:function(config) {
  if (!this._store) {
    this._store = [{first:'Peter', last:'Venkman', emails:{work:'peter.venkman@gb.com'}}, {first:'Egon', last:'Spengler', emails:{work:'egon.spengler@gb.com'}}];
  }
  config.success.call(config.scope || this, this._store);
}, getThumbnail:function(config) {
  config.callback.call(config.scope || this, '');
}, getLocalizedLabel:function(config) {
  config.callback.call(config.scope || this, config.label.toUpperCase(), config.label);
}});
Ext.define('Ext.device.contacts.Cordova', {alternateClassName:'Ext.device.contacts.PhoneGap', extend:'Ext.device.contacts.Abstract', getContacts:function(config) {
  if (!config) {
    Ext.Logger.warn('Ext.device.Contacts#getContacts: You must specify a `config` object.');
    return false;
  }
  if (!config.success) {
    Ext.Logger.warn('Ext.device.Contacts#getContacts: You must specify a `success` method.');
    return false;
  }
  if (!config.fields) {
    config.fields = ['*'];
  }
  if (!Ext.isArray(config.fields)) {
    config.fields = [config.fields];
  }
  if (Ext.isEmpty(config.multiple)) {
    config.multiple = true;
  }
  navigator.contacts.find(config.fields, config.success, config.failure, config);
}});
Ext.define('Ext.device.Contacts', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.contacts.Cordova'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.contacts.Cordova');
    }
  }
  return Ext.create('Ext.device.contacts.Abstract');
}});
Ext.define('Ext.device.device.Abstract', {mixins:['Ext.mixin.Observable'], name:'not available', uuid:'anonymous', platform:Ext.os.name, scheme:false, openURL:function(url) {
  window.location = url;
}});
Ext.define('Ext.device.device.Cordova', {alternateClassName:'Ext.device.device.PhoneGap', extend:'Ext.device.device.Abstract', availableListeners:['pause', 'resume', 'backbutton', 'batterycritical', 'batterylow', 'batterystatus', 'menubutton', 'searchbutton', 'startcallbutton', 'endcallbutton', 'volumeupbutton', 'volumedownbutton'], constructor:function() {
  if (Ext.isReady) {
    this.onReady();
  } else {
    Ext.onReady(this.onReady, this, {single:true});
  }
}, onReady:function() {
  var me = this, device = window.device;
  me.name = device.name || device.model;
  me.cordova = device.cordova;
  me.platform = device.platform || Ext.os.name;
  me.uuid = device.uuid;
  me.version = device.version;
  me.model = device.model;
}, privates:{doAddListener:function(name) {
  var me = this;
  if (!me.addedListeners) {
    me.addedListeners = [];
  }
  if (me.availableListeners.indexOf(name) != -1 && me.addedListeners.indexOf(name) == -1) {
    me.addedListeners.push(name);
    document.addEventListener(name, function() {
      me.fireEvent(name, me);
    });
  }
  Ext.device.Device.mixins.observable.doAddListener.apply(Ext.device.Device.mixins.observable, arguments);
}}});
Ext.define('Ext.device.device.Simulator', {extend:'Ext.device.device.Abstract'});
Ext.define('Ext.device.Device', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.device.Cordova', 'Ext.device.device.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.device.Cordova');
    }
  }
  return Ext.create('Ext.device.device.Simulator');
}});
Ext.define('Ext.device.filesystem.Abstract', {config:{fileSystemType:1, fileSystemSize:0, readerType:'text', stringEncoding:'UTF8'}, requestFileSystem:function(config) {
  var defaultConfig = Ext.device.filesystem.Abstract.prototype.config;
  config = Ext.applyIf(config, {type:defaultConfig.fileSystemType, size:defaultConfig.fileSystemSize, success:Ext.emptyFn, failure:Ext.emptyFn});
  return config;
}});
Ext.define('Ext.device.filesystem.HTML5', {extend:'Ext.device.filesystem.Abstract', requestFileSystem:function(config) {
  if (!config.success) {
    Ext.Logger.error('Ext.device.filesystem#requestFileSystem: You must specify a `success` callback.');
    return null;
  }
  var me = this;
  var successCallback = function(fs) {
    var fileSystem = Ext.create('Ext.device.filesystem.FileSystem', fs);
    config.success.call(config.scope || me, fileSystem);
  };
  window.requestFileSystem(config.type, config.size, successCallback, config.failure || Ext.emptyFn);
}}, function() {
  Ext.define('Ext.device.filesystem.FileSystem', {fs:null, root:null, constructor:function(fs) {
    this.fs = fs;
    this.root = Ext.create('Ext.device.filesystem.DirectoryEntry', '/', this);
  }, getRoot:function() {
    return this.root;
  }}, function() {
    Ext.define('Ext.device.filesystem.Entry', {directory:false, path:0, fileSystem:null, entry:null, constructor:function(directory, path, fileSystem) {
      this.directory = directory;
      this.path = path;
      this.fileSystem = fileSystem;
    }, isFile:function() {
      return !this.directory;
    }, isDirectory:function() {
      return this.directory;
    }, getName:function() {
      var components = this.path.split('/');
      for (var i = components.length - 1; i >= 0; --i) {
        if (components[i].length > 0) {
          return components[i];
        }
      }
      return '/';
    }, getFullPath:function() {
      return this.path;
    }, getFileSystem:function() {
      return this.fileSystem;
    }, getEntry:function() {
      return null;
    }, moveTo:function(config) {
      if (config.parent == null) {
        Ext.Logger.error('Ext.device.filesystem.Entry#moveTo: You must specify a new `parent` of the entry.');
        return null;
      }
      var me = this;
      this.getEntry({options:config.options || {}, success:function(sourceEntry) {
        config.parent.getEntry({options:config.options || {}, success:function(destinationEntry) {
          if (config.copy) {
            sourceEntry.copyTo(destinationEntry, config.newName, function(entry) {
              config.success.call(config.scope || me, entry.isDirectory ? Ext.create('Ext.device.filesystem.DirectoryEntry', entry.fullPath, me.fileSystem) : Ext.create('Ext.device.filesystem.FileEntry', entry.fullPath, me.fileSystem));
            }, config.failure);
          } else {
            sourceEntry.moveTo(destinationEntry, config.newName, function(entry) {
              config.success.call(config.scope || me, entry.isDirectory ? Ext.create('Ext.device.filesystem.DirectoryEntry', entry.fullPath, me.fileSystem) : Ext.create('Ext.device.filesystem.FileEntry', entry.fullPath, me.fileSystem));
            }, config.failure);
          }
        }, failure:config.failure});
      }, failure:config.failure});
    }, copyTo:function(config) {
      this.moveTo(Ext.apply(config, {copy:true}));
    }, remove:function(config) {
      this.getEntry({success:function(entry) {
        if (config.recursively && this.directory) {
          entry.removeRecursively(config.success, config.failure);
        } else {
          entry.remove(config.success, config.failure);
        }
      }, failure:config.failure});
    }, getParent:function(config) {
      if (!config.success) {
        Ext.Logger.error('Ext.device.filesystem.Entry#getParent: You must specify a `success` callback.');
        return null;
      }
      var me = this;
      this.getEntry({options:config.options || {}, success:function(entry) {
        entry.getParent(function(parentEntry) {
          config.success.call(config.scope || me, parentEntry.isDirectory ? Ext.create('Ext.device.filesystem.DirectoryEntry', parentEntry.fullPath, me.fileSystem) : Ext.create('Ext.device.filesystem.FileEntry', parentEntry.fullPath, me.fileSystem));
        }, config.failure);
      }, failure:config.failure});
    }});
    Ext.define('Ext.device.filesystem.DirectoryEntry', {extend:'Ext.device.filesystem.Entry', cachedDirectory:null, constructor:function(path, fileSystem) {
      this.callParent([true, path, fileSystem]);
    }, getEntry:function(config) {
      var me = this;
      var callback = config.success;
      if (config.options && config.options.create && this.path) {
        var folders = this.path.split('/');
        if (folders[0] == '.' || folders[0] == '') {
          folders = folders.slice(1);
        }
        var recursiveCreation = function(dirEntry) {
          if (folders.length) {
            dirEntry.getDirectory(folders.shift(), config.options, recursiveCreation, config.failure);
          } else {
            callback(dirEntry);
          }
        };
        recursiveCreation(this.fileSystem.fs.root);
      } else {
        this.fileSystem.fs.root.getDirectory(this.path, config.options, function(directory) {
          config.success.call(config.scope || me, directory);
        }, config.failure);
      }
    }, readEntries:function(config) {
      if (!config.success) {
        Ext.Logger.error('Ext.device.filesystem.DirectoryEntry#readEntries: You must specify a `success` callback.');
        return null;
      }
      var me = this;
      this.getEntry({success:function(dirEntry) {
        var directoryReader = dirEntry.createReader();
        directoryReader.readEntries(function(entryInfos) {
          var entries = [], i = 0, len = entryInfos.length;
          for (; i < len; i++) {
            entryInfo = entryInfos[i];
            entries[i] = entryInfo.isDirectory ? Ext.create('Ext.device.filesystem.DirectoryEntry', entryInfo.fullPath, me.fileSystem) : Ext.create('Ext.device.filesystem.FileEntry', entryInfo.fullPath, me.fileSystem);
          }
          config.success.call(config.scope || this, entries);
        }, function(error) {
          if (config.failure) {
            config.failure.call(config.scope || this, error);
          }
        });
      }, failure:config.failure});
    }, getFile:function(config) {
      if (config.path == null) {
        Ext.Logger.error('Ext.device.filesystem.DirectoryEntry#getFile: You must specify a `path` of the file.');
        return null;
      }
      var me = this;
      var fullPath = this.path + config.path;
      var fileEntry = Ext.create('Ext.device.filesystem.FileEntry', fullPath, this.fileSystem);
      fileEntry.getEntry({success:function() {
        config.success.call(config.scope || me, fileEntry);
      }, options:config.options || {}, failure:config.failure});
    }, getDirectory:function(config) {
      if (config.path == null) {
        Ext.Logger.error('Ext.device.filesystem.DirectoryEntry#getFile: You must specify a `path` of the file.');
        return null;
      }
      var me = this;
      var fullPath = this.path + config.path;
      var directoryEntry = Ext.create('Ext.device.filesystem.DirectoryEntry', fullPath, this.fileSystem);
      directoryEntry.getEntry({success:function() {
        config.success.call(config.scope || me, directoryEntry);
      }, options:config.options || {}, failure:config.failure});
    }, removeRecursively:function(config) {
      this.remove(Ext.apply(config, {recursively:true}));
    }});
    Ext.define('Ext.device.filesystem.FileEntry', {extend:'Ext.device.filesystem.Entry', length:0, offset:0, constructor:function(path, fileSystem) {
      this.callParent([false, path, fileSystem]);
      this.offset = 0;
      this.length = 0;
    }, getEntry:function(config) {
      var me = this;
      var originalConfig = Ext.applyIf({}, config);
      if (this.fileSystem) {
        var failure = function(evt) {
          if (config.options && config.options.create && Ext.isString(this.path)) {
            var folders = this.path.split('/');
            if (folders[0] == '.' || folders[0] == '') {
              folders = folders.slice(1);
            }
            if (folders.length > 1 && !config.recursive === true) {
              folders.pop();
              var dirEntry = Ext.create('Ext.device.filesystem.DirectoryEntry', folders.join('/'), me.fileSystem);
              dirEntry.getEntry({options:config.options, success:function() {
                originalConfig.recursive = true;
                me.getEntry(originalConfig);
              }, failure:config.failure});
            } else {
              if (config.failure) {
                config.failure.call(config.scope || me, evt);
              }
            }
          } else {
            if (config.failure) {
              config.failure.call(config.scope || me, evt);
            }
          }
        };
        this.fileSystem.fs.root.getFile(this.path, config.options || null, function(fileEntry) {
          fileEntry.file(function(file) {
            me.length = file.size;
            originalConfig.success.call(config.scope || me, fileEntry);
          }, function(error) {
            failure.call(config.scope || me, error);
          });
        }, function(error) {
          failure.call(config.scope || me, error);
        });
      } else {
        config.failure({code:-1, message:'FileSystem not Initialized'});
      }
    }, getOffset:function() {
      return this.offset;
    }, seek:function(config) {
      if (config.offset == null) {
        Ext.Logger.error('Ext.device.filesystem.FileEntry#seek: You must specify an `offset` in the file.');
        return null;
      }
      this.offset = config.offset || 0;
      if (config.success) {
        config.success.call(config.scope || this);
      }
    }, read:function(config) {
      var me = this;
      this.getEntry({success:function(fileEntry) {
        fileEntry.file(function(file) {
          if (Ext.isNumber(config.length)) {
            if (Ext.isFunction(file.slice)) {
              file = file.slice(me.offset, config.length);
            } else {
              if (config.failure) {
                config.failure.call(config.scope || me, {code:-2, message:'File missing slice functionality'});
              }
              return;
            }
          }
          var reader = new FileReader;
          reader.onloadend = function(evt) {
            config.success.call(config.scope || me, evt.target.result);
          };
          reader.onerror = function(error) {
            config.failure.call(config.scope || me, error);
          };
          if (config.reader) {
            reader = Ext.applyIf(reader, config.reader);
          }
          config.encoding = config.encoding || 'UTF8';
          switch(config.type) {
            default:
            case 'text':
              reader.readAsText(file, config.encoding);
              break;
            case 'dataURL':
              reader.readAsDataURL(file);
              break;
            case 'binaryString':
              reader.readAsBinaryString(file);
              break;
            case 'arrayBuffer':
              reader.readAsArrayBuffer(file);
              break;
          }
        }, function(error) {
          config.failure.call(config.scope || me, error);
        });
      }, failure:function(error) {
        config.failure.call(config.scope || me, error);
      }});
    }, write:function(config) {
      if (config.data == null) {
        Ext.Logger.error('Ext.device.filesystem.FileEntry#write: You must specify `data` to write into the file.');
        return null;
      }
      var me = this;
      this.getEntry({options:config.options || {}, success:function(fileEntry) {
        fileEntry.createWriter(function(writer) {
          writer.onwriteend = function(evt) {
            me.length = evt.target.length;
            config.success.call(config.scope || me, evt.result);
          };
          writer.onerror = function(error) {
            config.failure.call(config.scope || me, error);
          };
          if (config.writer) {
            writer = Ext.applyIf(writer, config.writer);
          }
          if (me.offset) {
            writer.seek(me.offset);
          } else {
            if (config.append) {
              writer.seek(me.length);
            }
          }
          me.writeData(writer, config.data);
        }, function(error) {
          config.failure.call(config.scope || me, error);
        });
      }, failure:function(error) {
        config.failure.call(config.scope || me, error);
      }});
    }, writeData:function(writer, data) {
      writer.write(new Blob([data]));
    }, truncate:function(config) {
      if (config.size == null) {
        Ext.Logger.error('Ext.device.filesystem.FileEntry#write: You must specify a `size` of the file.');
        return null;
      }
      var me = this;
      this.getEntry({success:function(fileEntry) {
        fileEntry.createWriter(function(writer) {
          writer.truncate(config.size);
          config.success.call(config.scope || me, me);
        }, function(error) {
          config.failure.call(config.scope || me, error);
        });
      }, failure:function(error) {
        config.failure.call(config.scope || me, error);
      }});
    }});
  });
});
Ext.define('Ext.device.filesystem.Cordova', {alternateClassName:'Ext.device.filesystem.PhoneGap', extend:'Ext.device.filesystem.HTML5', constructor:function() {
  Ext.override(Ext.device.filesystem.Entry, {writeMetadata:function(config) {
    var me = this;
    this.getEntry({options:config.options, success:function(entry) {
      entry.setMetadata(function() {
        config.success.call(config.scope || me);
      }, function(error) {
        config.failure.call(config.scope || me, error);
      }, config.metadata);
    }, failure:function(error) {
      config.failure.call(config.scope || me, error);
    }});
  }, readMetadata:function(config) {
    var me = this;
    this.getEntry({options:config.options, success:function(entry) {
      entry.getMetadata(function(metadata) {
        config.success.call(config.scope || me, metadata);
      }, function(error) {
        config.failure.call(config.scope || me, error);
      });
    }, failure:function(error) {
      config.failure.call(config.scope || me, error);
    }});
  }});
  Ext.override(Ext.device.filesystem.FileEntry, {writeData:function(writer, data) {
    writer.write(data.toString());
  }, upload:function(config) {
    var options = new FileUploadOptions;
    options.fileKey = config.fileKey || 'file';
    options.fileName = this.path.substr(this.path.lastIndexOf('/') + 1);
    options.mimeType = config.mimeType || 'image/jpeg';
    options.params = config.params || {};
    options.headers = config.headers || {};
    options.chunkMode = config.chunkMode || true;
    var fileTransfer = new FileTransfer;
    fileTransfer.upload(this.path, encodeURI(config.url), config.success, config.failure, options, config.trustAllHosts || false);
    return fileTransfer;
  }, download:function(config) {
    var fileTransfer = new FileTransfer;
    fileTransfer.download(encodeURI(config.source), this.path, config.success, config.failure, config.trustAllHosts || false, config.options || {});
    return fileTransfer;
  }});
}});
Ext.define('Ext.device.filesystem.Chrome', {extend:'Ext.device.filesystem.HTML5', requestFileSystem:function(config) {
  var me = this;
  config = Ext.device.filesystem.Abstract.prototype.requestFileSystem(config);
  var successCallback = function(fs) {
    var fileSystem = Ext.create('Ext.device.filesystem.FileSystem', fs);
    config.success.call(config.scope || me, fileSystem);
  };
  if (config.type == window.PERSISTENT) {
    if (navigator.webkitPersistentStorage) {
      navigator.webkitPersistentStorage.requestQuota(config.size, function(grantedBytes) {
        window.webkitRequestFileSystem(config.type, grantedBytes, successCallback, config.failure);
      });
    } else {
      window.webkitStorageInfo.requestQuota(window.PERSISTENT, config.size, function(grantedBytes) {
        window.webkitRequestFileSystem(config.type, grantedBytes, successCallback, config.failure);
      });
    }
  } else {
    window.webkitRequestFileSystem(config.type, config.size, successCallback, config.failure);
  }
}});
Ext.define('Ext.device.filesystem.Simulator', {extend:'Ext.device.filesystem.HTML5'});
Ext.define('Ext.device.FileSystem', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.filesystem.Cordova', 'Ext.device.filesystem.Chrome', 'Ext.device.filesystem.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.filesystem.Cordova');
    }
  } else {
    if (browserEnv.Chrome) {
      return Ext.create('Ext.device.filesystem.Chrome');
    }
  }
  return Ext.create('Ext.device.filesystem.Simulator');
}});
Ext.define('Ext.device.geolocation.Abstract', {config:{maximumAge:0, frequency:10000, allowHighAccuracy:false, timeout:Infinity}, getCurrentPosition:function(config) {
  var defaultConfig = Ext.device.geolocation.Abstract.prototype.config;
  config = Ext.applyIf(config, {maximumAge:defaultConfig.maximumAge, frequency:defaultConfig.frequency, allowHighAccuracy:defaultConfig.allowHighAccuracy, timeout:defaultConfig.timeout});
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getCurrentPosition');
  }
  return config;
}, watchPosition:function(config) {
  var defaultConfig = Ext.device.geolocation.Abstract.prototype.config;
  config = Ext.applyIf(config, {maximumAge:defaultConfig.maximumAge, frequency:defaultConfig.frequency, allowHighAccuracy:defaultConfig.allowHighAccuracy, timeout:defaultConfig.timeout});
  if (!config.callback) {
    Ext.Logger.warn('You need to specify a `callback` function for #watchPosition');
  }
  return config;
}, clearWatch:function() {
}});
Ext.define('Ext.device.geolocation.Cordova', {alternateClassName:'Ext.device.geolocation.PhoneGap', extend:'Ext.device.geolocation.Abstract', activeWatchID:null, getCurrentPosition:function(config) {
  config = this.callParent(arguments);
  navigator.geolocation.getCurrentPosition(config.success, config.failure, config);
  return config;
}, watchPosition:function(config) {
  config = this.callParent(arguments);
  if (this.activeWatchID) {
    this.clearWatch();
  }
  this.activeWatchID = navigator.geolocation.watchPosition(config.callback, config.failure, config);
  return config;
}, clearWatch:function() {
  if (this.activeWatchID) {
    navigator.geolocation.clearWatch(this.activeWatchID);
    this.activeWatchID = null;
  }
}});
Ext.define('Ext.device.geolocation.Simulator', {extend:'Ext.device.geolocation.Abstract', requires:['Ext.util.Geolocation'], getCurrentPosition:function(config) {
  config = this.callParent([config]);
  Ext.apply(config, {autoUpdate:false, listeners:{scope:this, locationupdate:function(geolocation) {
    if (config.success) {
      config.success.call(config.scope || this, geolocation.position);
    }
  }, locationerror:function() {
    if (config.failure) {
      config.failure.call(config.scope || this);
    }
  }}});
  this.geolocation = Ext.create('Ext.util.Geolocation', config);
  this.geolocation.updateLocation();
  return config;
}, watchPosition:function(config) {
  config = this.callParent([config]);
  Ext.apply(config, {listeners:{scope:this, locationupdate:function(geolocation) {
    if (config.callback) {
      config.callback.call(config.scope || this, geolocation.position);
    }
  }, locationerror:function() {
    if (config.failure) {
      config.failure.call(config.scope || this);
    }
  }}});
  this.geolocation = Ext.create('Ext.util.Geolocation', config);
  return config;
}, clearWatch:function() {
  if (this.geolocation) {
    this.geolocation.destroy();
  }
  this.geolocation = null;
}});
Ext.define('Ext.device.Geolocation', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.geolocation.Cordova', 'Ext.device.geolocation.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.geolocation.Cordova');
    }
  }
  return Ext.create('Ext.device.geolocation.Simulator');
}});
Ext.define('Ext.device.globalization.Abstract', {mixins:['Ext.mixin.Observable'], config:{formatLength:'full', selector:'date and time', dateType:'wide', items:'months', numberType:'decimal', currencyCode:'USD'}, getPreferredLanguage:function(config) {
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getPreferredLanguage');
  }
  return config;
}, getLocaleName:function(config) {
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getLocaleName');
  }
  return config;
}, dateToString:function(config) {
  var defaultConfig = Ext.device.globalization.Abstract.prototype.config;
  config = Ext.applyIf(config, {date:new Date, formatLength:defaultConfig.formatLength, selector:defaultConfig.selector});
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #dateToString');
  }
  return config;
}, stringToDate:function(config) {
  var defaultConfig = Ext.device.globalization.Abstract.prototype.config;
  config = Ext.applyIf(config, {dateString:Ext.util.Format.date(new Date, 'm/d/Y'), formatLength:defaultConfig.formatLength, selector:defaultConfig.selector});
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #stringToDate');
  }
  return config;
}, getDatePattern:function(config) {
  var defaultConfig = Ext.device.globalization.Abstract.prototype.config;
  config = Ext.applyIf(config, {formatLength:defaultConfig.formatLength, selector:defaultConfig.selector});
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getDatePattern');
  }
  return config;
}, getDateNames:function(config) {
  var defaultConfig = Ext.device.globalization.Abstract.prototype.config;
  config = Ext.applyIf(config, {type:defaultConfig.dateType, items:defaultConfig.items});
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getDateNames');
  }
  return config;
}, isDayLightSavingsTime:function(config) {
  config = Ext.applyIf(config, {date:new Date});
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #isDayLightSavingsTime');
  }
  return config;
}, getFirstDayOfWeek:function(config) {
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getFirstDayOfWeek');
  }
  return config;
}, numberToString:function(config) {
  var defaultConfig = Ext.device.globalization.Abstract.prototype.config;
  config = Ext.applyIf(config, {number:defaultConfig.number, type:defaultConfig.numberType});
  if (!config.number) {
    Ext.Logger.warn('You need to specify a `number` for #numberToString');
  }
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #numberToString');
  }
  return config;
}, stringToNumber:function(config) {
  var defaultConfig = Ext.device.globalization.Abstract.prototype.config;
  config = Ext.applyIf(config, {type:defaultConfig.numberType});
  if (!config.number) {
    Ext.Logger.warn('You need to specify a `string` for #stringToNumber');
  }
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #stringToNumber');
  }
  return config;
}, getNumberPattern:function(config) {
  var defaultConfig = Ext.device.globalization.Abstract.prototype.config;
  config = Ext.applyIf(config, {type:defaultConfig.numberType});
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getNumberPattern');
  }
  return config;
}, getCurrencyPattern:function(config) {
  var defaultConfig = Ext.device.globalization.Abstract.prototype.config;
  config = Ext.applyIf(config, {currencyCode:defaultConfig.currencyCode});
  if (!config.success) {
    Ext.Logger.warn('You need to specify a `success` function for #getCurrency');
  }
  return config;
}});
Ext.define('Ext.device.globalization.Cordova', {alternateClassName:'Ext.device.globalization.PhoneGap', extend:'Ext.device.globalization.Abstract', getPreferredLanguage:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.getPreferredLanguage(config.success, config.error);
}, getLocaleName:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.getLocaleName(config.success, config.error);
}, dateToString:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.dateToString(config.date, config.success, config.error, config);
}, stringToDate:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.stringToDate(config.dateString, config.success, config.error, config);
}, getDatePattern:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.getDatePattern(config.success, config.error, config);
}, getDateNames:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.getDateNames(config.success, config.error, config);
}, isDayLightSavingsTime:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.isDayLightSavingsTime(config.date, config.success, config.error, config);
}, getFirstDayOfWeek:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.getFirstDayOfWeek(config.success, config.error);
}, numberToString:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.numberToString(config.number, config.success, config.error, config);
}, stringToNumber:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.stringToNumber(config.string, config.success, config.error, config);
}, getNumberPattern:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.getNumberPattern(config.success, config.error, config);
}, getCurrencyPattern:function(config) {
  config = this.callParent(arguments);
  navigator.globalization.getCurrencyPattern(config.currencyCode, config.success, config.error);
}});
Ext.define('Ext.device.globalization.Simulator', {extend:'Ext.device.globalization.Abstract'});
Ext.define('Ext.device.Globalization', {singleton:true, requires:['Ext.device.globalization.Cordova', 'Ext.device.globalization.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.globalization.Cordova');
    }
  }
  return Ext.create('Ext.device.globalization.Simulator');
}});
Ext.define('Ext.device.media.Abstract', {mixins:['Ext.mixin.Observable'], config:{src:null}, play:Ext.emptyFn, pause:Ext.emptyFn, stop:Ext.emptyFn, release:Ext.emptyFn, seekTo:Ext.emptyFn, getCurrentPosition:Ext.emptyFn, getDuration:Ext.emptyFn, startRecord:Ext.emptyFn, stopRecord:Ext.emptyFn});
Ext.define('Ext.device.media.Cordova', {alternateClassName:'Ext.device.media.PhoneGap', extend:'Ext.device.media.Abstract', config:{src:null, media:null}, updateSrc:function(newSrc, oldSrc) {
  this.setMedia(new Media(newSrc));
}, play:function() {
  var media = this.getMedia();
  if (media) {
    media.play();
  }
}, pause:function() {
  var media = this.getMedia();
  if (media) {
    media.pause();
  }
}, stop:function() {
  var media = this.getMedia();
  if (media) {
    media.stop();
  }
}, release:function() {
  var media = this.getMedia();
  if (media) {
    media.release();
  }
}, seekTo:function(miliseconds) {
  var media = this.getMedia();
  if (media) {
    media.seekTo(miliseconds);
  }
}, getDuration:function() {
  var media = this.getMedia();
  if (media) {
    media.getDuration();
  }
}, startRecord:function() {
  var media = this.getMedia();
  if (!media) {
    this.setSrc(null);
  }
  media.startRecord();
}, stopRecord:function() {
  var media = this.getMedia();
  if (media) {
    media.stopRecord();
  }
}});
Ext.define('Ext.device.Media', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.media.Cordova'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView && browserEnv.Cordova) {
    return Ext.create('Ext.device.media.Cordova');
  }
  return Ext.create('Ext.device.media.Abstract');
}});
Ext.define('Ext.device.notification.Abstract', {show:function(config) {
  if (!config.message) {
    throw '[Ext.device.Notification#show] You passed no message';
  }
  if (!config.buttons) {
    config.buttons = ['OK', 'Cancel'];
  }
  if (!Ext.isArray(config.buttons)) {
    config.buttons = [config.buttons];
  }
  if (!config.scope) {
    config.scope = this;
  }
  return config;
}, alert:function(config) {
  if (!config.message) {
    throw '[Ext.device.Notification#alert] You passed no message';
  }
  if (!config.scope) {
    config.scope = this;
  }
  return config;
}, confirm:function(config) {
  if (!config.message) {
    throw '[Ext.device.Notification#confirm] You passed no message';
  }
  if (!config.buttons) {
    config.buttons = ['OK', 'Cancel'];
  }
  if (!Ext.isArray(config.buttons)) {
    config.buttons = [config.buttons];
  }
  if (!config.scope) {
    config.scope = this;
  }
  return config;
}, prompt:function(config) {
  if (!config.message) {
    throw '[Ext.device.Notification#prompt] You passed no message';
  }
  if (!config.buttons) {
    config.buttons = ['OK', 'Cancel'];
  }
  if (!Ext.isArray(config.buttons)) {
    config.buttons = [config.buttons];
  }
  if (!config.scope) {
    config.scope = this;
  }
  return config;
}, vibrate:Ext.emptyFn, beep:Ext.emptyFn});
Ext.define('Ext.device.notification.Cordova', {alternateClassName:'Ext.device.notification.PhoneGap', extend:'Ext.device.notification.Abstract', requires:['Ext.device.Communicator'], show:function(config) {
  config = this.callParent(arguments);
  this.confirm(config);
}, confirm:function(config) {
  config = this.callParent(arguments);
  var buttons = config.buttons, ln = config.buttons.length;
  if (ln && typeof buttons[0] != 'string') {
    var newButtons = [], i;
    for (i = 0; i < ln; i++) {
      newButtons.push(buttons[i].text);
    }
    buttons = newButtons;
  }
  var callback = function(index) {
    if (config.callback) {
      config.callback.apply(config.scope, buttons ? [buttons[index - 1].toLowerCase()] : []);
    }
  };
  navigator.notification.confirm(config.message, callback, config.title, buttons);
}, alert:function(config) {
  navigator.notification.alert(config.message, config.callback, config.title, config.buttonName);
}, prompt:function(config) {
  config = this.callParent(arguments);
  var buttons = config.buttons, ln = config.buttons.length;
  if (ln && typeof buttons[0] != 'string') {
    var newButtons = [], i;
    for (i = 0; i < ln; i++) {
      newButtons.push(buttons[i].text);
    }
    buttons = newButtons;
  }
  var callback = function(result) {
    if (config.callback) {
      config.callback.call(config.scope, buttons ? buttons[result.buttonIndex - 1].toLowerCase() : null, result.input1);
    }
  };
  navigator.notification.prompt(config.message, callback, config.title, buttons);
}, vibrate:function(time) {
  navigator.notification.vibrate(time);
}, beep:function(times) {
  navigator.notification.vibrate(times);
}});
Ext.define('Ext.device.notification.Simulator', {extend:'Ext.device.notification.Abstract', requires:['Ext.MessageBox', 'Ext.util.Audio'], msg:null, show:function() {
  var config = this.callParent(arguments), buttons = [], ln = config.buttons.length, button, i, callback;
  for (i = 0; i < ln; i++) {
    button = config.buttons[i];
    if (Ext.isString(button)) {
      button = {text:config.buttons[i], itemId:config.buttons[i].toLowerCase()};
    }
    buttons.push(button);
  }
  this.msg = Ext.create('Ext.MessageBox');
  callback = function(itemId) {
    if (config.callback) {
      config.callback.apply(config.scope, [itemId]);
    }
  };
  this.msg.show({title:config.title, message:config.message, scope:this.msg, buttons:buttons, fn:callback});
}, alert:function() {
  var config = this.callParent(arguments);
  if (config.buttonName) {
    config.buttons = [config.buttonName];
  }
  this.show(config);
}, confirm:function() {
  var config = this.callParent(arguments);
  this.show(config);
}, prompt:function() {
  var config = this.callParent(arguments), buttons = [], ln = config.buttons.length, button, i, callback;
  for (i = 0; i < ln; i++) {
    button = config.buttons[i];
    if (Ext.isString(button)) {
      button = {text:config.buttons[i], itemId:config.buttons[i].toLowerCase()};
    }
    buttons.push(button);
  }
  this.msg = Ext.create('Ext.MessageBox');
  callback = function(buttonText, value) {
    if (config.callback) {
      config.callback.apply(config.scope, [buttonText, value]);
    }
  };
  this.msg.prompt(config.title, config.message, callback, this.msg, config.multiLine, config.value, config.prompt);
}, beep:function(times) {
  if (!Ext.isNumber(times)) {
    times = 1;
  }
  var count = 0;
  var callback = function() {
    if (count < times) {
      Ext.defer(function() {
        Ext.util.Audio.beep(callback);
      }, 50);
    }
    count++;
  };
  callback();
}, vibrate:function() {
  var animation = ['@-webkit-keyframes vibrate{', '    from {', '        -webkit-transform: rotate(-2deg);', '    }', '    to{', '        -webkit-transform: rotate(2deg);', '    }', '}', 'body {', '    -webkit-animation: vibrate 50ms linear 10 alternate;', '}'];
  var head = document.getElementsByTagName('head')[0];
  var cssNode = document.createElement('style');
  cssNode.innerHTML = animation.join('\n');
  head.appendChild(cssNode);
  Ext.defer(function() {
    head.removeChild(cssNode);
  }, 400);
}});
Ext.define('Ext.device.Notification', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.notification.Cordova', 'Ext.device.notification.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.notification.Cordova');
    }
  }
  return Ext.create('Ext.device.notification.Simulator');
}});
Ext.define('Ext.device.orientation.Abstract', {mixins:['Ext.mixin.Observable'], onDeviceOrientation:function(e) {
  this.doFireEvent('orientationchange', [e]);
}});
Ext.define('Ext.device.orientation.HTML5', {extend:'Ext.device.orientation.Abstract', constructor:function() {
  this.callParent(arguments);
  this.onDeviceOrientation = Ext.Function.bind(this.onDeviceOrientation, this);
  window.addEventListener('deviceorientation', this.onDeviceOrientation, true);
}});
Ext.define('Ext.device.Orientation', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.orientation.HTML5'], constructor:function() {
  return Ext.create('Ext.device.orientation.HTML5');
}});
Ext.define('Ext.device.push.Abstract', {ALERT:1, BADGE:2, SOUND:4, register:function(config) {
  var me = this;
  if (!config.received) {
    Ext.Logger.error('Failed to pass a received callback. This is required.');
  }
  if (config.type == null) {
    Ext.Logger.error('Failed to pass a type. This is required.');
  }
  return {success:function(token) {
    me.onSuccess(token, config.success, config.scope || me);
  }, failure:function(error) {
    me.onFailure(error, config.failure, config.scope || me);
  }, received:function(notifications) {
    me.onReceived(notifications, config.received, config.scope || me);
  }, type:config.type};
}, onSuccess:function(token, callback, scope) {
  if (callback) {
    callback.call(scope, token);
  }
}, onFailure:function(error, callback, scope) {
  if (callback) {
    callback.call(scope, error);
  }
}, onReceived:function(notifications, callback, scope) {
  if (callback) {
    callback.call(scope, notifications);
  }
}});
Ext.define('Ext.device.push.Cordova', {extend:'Ext.device.push.Abstract', statics:{callbacks:{}}, setPushConfig:function(config) {
  var methodName = Ext.id(null, 'callback');
  Ext.device.push.Cordova.callbacks[methodName] = config.callbacks.received;
  return {'badge':config.callbacks.type === Ext.device.Push.BADGE ? 'true' : 'false', 'sound':config.callbacks.type === Ext.device.Push.SOUND ? 'true' : 'false', 'alert':config.callbacks.type === Ext.device.Push.ALERT ? 'true' : 'false', 'ecb':'Ext.device.push.Cordova.callbacks.' + methodName, 'senderID':config.senderID};
}, register:function() {
  var config = arguments[0];
  config.callbacks = this.callParent(arguments);
  var pushConfig = this.setPushConfig(config), plugin = window.plugins.pushNotification;
  plugin.register(config.callbacks.success, config.callbacks.failure, pushConfig);
}});
Ext.define('Ext.device.Push', {singleton:true, requires:['Ext.device.Communicator', 'Ext.device.push.Cordova'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.push.Cordova');
    }
  }
  return Ext.create('Ext.device.push.Abstract');
}});
Ext.define('Ext.device.splashscreen.Abstract', {show:Ext.emptyFn, hide:Ext.emptyFn});
Ext.define('Ext.device.splashscreen.Cordova', {alternateClassName:'Ext.device.splashscreen.PhoneGap', extend:'Ext.device.splashscreen.Abstract', show:function() {
  navigator.splashscreen.show();
}, hide:function() {
  navigator.splashscreen.hide();
}});
Ext.define('Ext.device.splashscreen.Simulator', {extend:'Ext.device.splashscreen.Abstract'});
Ext.define('Ext.device.Splashscreen', {singleton:true, requires:['Ext.device.splashscreen.Cordova', 'Ext.device.splashscreen.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.splashscreen.Cordova');
    }
  }
  return Ext.create('Ext.device.splashscreen.Simulator');
}});
Ext.define('Ext.device.storage.Abstract', {config:{databaseName:'Sencha', databaseVersion:'1.0', databaseDisplayName:'Sencha Database', databaseSize:5 * 1024 * 1024}, openDatabase:function(config) {
  var defaultConfig = Ext.device.storage.Abstract.prototype.config;
  config = Ext.applyIf(config, {name:defaultConfig.databaseName, version:defaultConfig.databaseVersion, displayName:defaultConfig.databaseDisplayName, size:defaultConfig.databaseSize});
  return config;
}, numKeys:Ext.emptyFn, getKey:Ext.emptyFn, getItem:Ext.emptyFn, setItem:Ext.emptyFn, removeItem:Ext.emptyFn, clear:Ext.emptyFn});
Ext.define('Ext.device.storage.HTML5.SQLStatement', {extend:'Ext.Base', sql:null, 'arguments':null, success:Ext.emptyFn, failure:Ext.emptyFn, constructor:function(config) {
  this.sql = config.sql;
  this.arguments = config.arguments;
  this.success = config.success;
  this.failure = config.failure;
}});
Ext.define('Ext.device.storage.HTML5.Database', {requires:['Ext.device.storage.HTML5.SQLStatement'], db:null, constructor:function(config) {
  this.db = window.openDatabase(config.name, config.version, config.displayName, config.size);
}, getVersion:function() {
  if (this.db) {
    return this.db.version;
  }
  Ext.Logger.warn('Database has not been opened before calling function #getVersion');
  return null;
}, transaction:function(sql, success, failure) {
  if (!this.db) {
    Ext.Logger.warn('Database has not been opened before calling function #transaction');
    return;
  }
  if (!Ext.isArray(sql)) {
    sql = [sql];
  }
  var txFn = function(tx) {
    Ext.each(sql, function(sqlStatement) {
      if (Ext.isString(sqlStatement)) {
        tx.executeSql(sqlStatement);
      } else {
        if (Ext.isObject(sqlStatement)) {
          tx.executeSql(sqlStatement.sql, sqlStatement.arguments, sqlStatement.success, sqlStatement.failure);
        }
      }
    });
  };
  this.db.transaction(txFn, failure, success);
}});
Ext.define('Ext.device.storage.HTML5.HTML5', {extend:'Ext.device.storage.Abstract', requires:['Ext.device.storage.HTML5.Database'], dbCache:{}, openDatabase:function(config) {
  config = this.callParent(arguments);
  if (!this.dbCache[config.name] || config.noCache) {
    this.dbCache[config.name] = Ext.create('Ext.device.storage.HTML5.Database', config);
  }
  return this.dbCache[config.name];
}, numKeys:function() {
  return window.localStorage.length;
}, getKey:function(index) {
  return window.localStorage.key(index);
}, getItem:function(key) {
  return window.localStorage.getItem(key);
}, setItem:function(key, value) {
  return window.localStorage.setItem(key, value);
}, removeItem:function(key) {
  return window.localStorage.removeItem(key);
}, clear:function() {
  return window.localStorage.clear();
}});
Ext.define('Ext.device.storage.Cordova', {alternateClassName:'Ext.device.storage.PhoneGap', extend:'Ext.device.storage.HTML5.HTML5'});
Ext.define('Ext.device.storage.Simulator', {extend:'Ext.device.storage.HTML5.HTML5'});
Ext.define('Ext.device.Storage', {singleton:true, requires:['Ext.device.storage.Cordova', 'Ext.device.storage.Simulator'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView) {
    if (browserEnv.Cordova) {
      return Ext.create('Ext.device.storage.Cordova');
    }
  }
  return Ext.create('Ext.device.storage.Simulator');
}});
Ext.define('Ext.device.twitter.Abstract', {compose:Ext.emptyFn, getPublicTimeline:Ext.emptyFn, getMentions:Ext.emptyFn, getTwitterUsername:Ext.emptyFn, getTwitterRequest:Ext.emptyFn});
Ext.define('Ext.device.twitter.Cordova', {compose:function(config) {
  window.plugins.twitter.composeTweet(config.success, config.failure, config.tweet, {urlAttach:config.url, imageAttach:config.image});
}, getPublicTimeline:function(config) {
  window.plugins.twitter.getPublicTimeline(config.success, config.failure);
}, getMentions:function(config) {
  window.plugins.twitter.getMentions(config.success, config.failure);
}, getTwitterUsername:function(config) {
  window.plugins.twitter.getTwitterUsername(config.success, config.failure);
}, getTwitterRequest:function(config) {
  window.plugins.twitter.getTWRequest(config.url, config.params, config.success, config.failure, config.options);
}});
Ext.define('Ext.device.Twitter', {alternateClassName:'Ext.ux.device.Twitter', singleton:true, requires:['Ext.device.Communicator', 'Ext.device.twitter.*'], constructor:function() {
  var browserEnv = Ext.browser.is;
  if (browserEnv.WebView && browserEnv.Cordova) {
    return Ext.create('Ext.device.twitter.Cordova');
  } else {
    return Ext.create('Ext.device.twitter.Abstract');
  }
}});
Ext.define('Ext.device.browser.Window', {extend:'Ext.Evented', open:function(config) {
  var me = this;
  this._window = window.open(config.url, config.showToolbar ? '_blank' : '_self', config.options || null);
  this._window.addEventListener('loadstart', function() {
    me.fireEvent('loadstart', me);
  });
  this._window.addEventListener('loadstop', function() {
    me.fireEvent('loadstop', me);
  });
  this._window.addEventListener('loaderror', function() {
    me.fireEvent('loaderror', me);
  });
  this._window.addEventListener('exit', function() {
    me.fireEvent('close', me);
  });
}, close:function() {
  if (!this._window) {
    return;
  }
  this._window.close();
}});
