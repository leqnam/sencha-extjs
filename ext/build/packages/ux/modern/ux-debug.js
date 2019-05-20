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
Ext.define(null, {override:'Ext.ux.gauge.needle.Abstract', compatibility:Ext.isIE10p, setTransform:function(centerX, centerY, rotation) {
  var needleGroup = this.getNeedleGroup();
  this.callParent([centerX, centerY, rotation]);
  needleGroup.set({transform:getComputedStyle(needleGroup.dom).getPropertyValue('transform')});
}, updateStyle:function(style) {
  var pathElement;
  this.callParent([style]);
  if (Ext.isObject(style) && 'transform' in style) {
    pathElement = this.getNeedlePath();
    pathElement.set({transform:getComputedStyle(pathElement.dom).getPropertyValue('transform')});
  }
}});
Ext.define('Ext.ux.ajax.Simlet', function() {
  var urlRegex = /([^?#]*)(#.*)?$/, dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/, intRegex = /^[+-]?\d+$/, floatRegex = /^[+-]?\d+\.\d+$/;
  function parseParamValue(value) {
    var m;
    if (Ext.isDefined(value)) {
      value = decodeURIComponent(value);
      if (intRegex.test(value)) {
        value = parseInt(value, 10);
      } else {
        if (floatRegex.test(value)) {
          value = parseFloat(value);
        } else {
          if (!!(m = dateRegex.exec(value))) {
            value = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
          }
        }
      }
    }
    return value;
  }
  return {alias:'simlet.basic', isSimlet:true, responseProps:['responseText', 'responseXML', 'status', 'statusText', 'responseHeaders'], status:200, statusText:'OK', constructor:function(config) {
    Ext.apply(this, config);
  }, doGet:function(ctx) {
    return this.handleRequest(ctx);
  }, doPost:function(ctx) {
    return this.handleRequest(ctx);
  }, doRedirect:function(ctx) {
    return false;
  }, doDelete:function(ctx) {
    var me = this, xhr = ctx.xhr, records = xhr.options.records;
    me.removeFromData(ctx, records);
  }, exec:function(xhr) {
    var me = this, ret = {}, method = 'do' + Ext.String.capitalize(xhr.method.toLowerCase()), fn = me[method];
    if (fn) {
      ret = fn.call(me, me.getCtx(xhr.method, xhr.url, xhr));
    } else {
      ret = {status:405, statusText:'Method Not Allowed'};
    }
    return ret;
  }, getCtx:function(method, url, xhr) {
    return {method:method, params:this.parseQueryString(url), url:url, xhr:xhr};
  }, handleRequest:function(ctx) {
    var me = this, ret = {}, val;
    Ext.Array.forEach(me.responseProps, function(prop) {
      if (prop in me) {
        val = me[prop];
        if (Ext.isFunction(val)) {
          val = val.call(me, ctx);
        }
        ret[prop] = val;
      }
    });
    return ret;
  }, openRequest:function(method, url, options, async) {
    var ctx = this.getCtx(method, url), redirect = this.doRedirect(ctx), xhr;
    if (options.action === 'destroy') {
      method = 'delete';
    }
    if (redirect) {
      xhr = redirect;
    } else {
      xhr = new Ext.ux.ajax.SimXhr({mgr:this.manager, simlet:this, options:options});
      xhr.open(method, url, async);
    }
    return xhr;
  }, parseQueryString:function(str) {
    var m = urlRegex.exec(str), ret = {}, key, value, pair, parts, i, n;
    if (m && m[1]) {
      parts = m[1].split('\x26');
      for (i = 0, n = parts.length; i < n; ++i) {
        if ((pair = parts[i].split('\x3d'))[0]) {
          key = decodeURIComponent(pair.shift());
          value = parseParamValue(pair.length > 1 ? pair.join('\x3d') : pair[0]);
          if (!(key in ret)) {
            ret[key] = value;
          } else {
            if (Ext.isArray(ret[key])) {
              ret[key].push(value);
            } else {
              ret[key] = [ret[key], value];
            }
          }
        }
      }
    }
    return ret;
  }, redirect:function(method, url, params) {
    switch(arguments.length) {
      case 2:
        if (typeof url === 'string') {
          break;
        }
        params = url;
      case 1:
        url = method;
        method = 'GET';
        break;
    }
    if (params) {
      url = Ext.urlAppend(url, Ext.Object.toQueryString(params));
    }
    return this.manager.openRequest(method, url);
  }, removeFromData:function(ctx, records) {
    var me = this, data = me.getData(ctx), model = ctx.xhr.options.proxy && ctx.xhr.options.proxy.getModel() || {}, idProperty = model.idProperty || 'id', i;
    Ext.each(records, function(record) {
      var id = record.get(idProperty);
      for (i = data.length; i-- > 0;) {
        if (data[i][idProperty] === id) {
          me.deleteRecord(i);
          break;
        }
      }
    });
  }};
}());
Ext.define('Ext.ux.ajax.DataSimlet', function() {
  function makeSortFn(def, cmp) {
    var order = def.direction, sign = order && order.toUpperCase() === 'DESC' ? -1 : 1;
    return function(leftRec, rightRec) {
      var lhs = leftRec[def.property], rhs = rightRec[def.property], c = lhs < rhs ? -1 : rhs < lhs ? 1 : 0;
      if (c || !cmp) {
        return c * sign;
      }
      return cmp(leftRec, rightRec);
    };
  }
  function makeSortFns(defs, cmp) {
    var sortFn, i;
    for (sortFn = cmp, i = defs && defs.length; i;) {
      sortFn = makeSortFn(defs[--i], sortFn);
    }
    return sortFn;
  }
  return {extend:'Ext.ux.ajax.Simlet', buildNodes:function(node, path) {
    var me = this, nodeData = {data:[]}, len = node.length, children, i, child, name;
    me.nodes[path] = nodeData;
    for (i = 0; i < len; ++i) {
      nodeData.data.push(child = node[i]);
      name = child.text || child.title;
      child.id = path ? path + '/' + name : name;
      children = child.children;
      if (!(child.leaf = !children)) {
        delete child.children;
        me.buildNodes(children, child.id);
      }
    }
  }, deleteRecord:function(pos) {
    if (this.data && typeof this.data !== 'function') {
      Ext.Array.removeAt(this.data, pos);
    }
  }, fixTree:function(ctx, tree) {
    var me = this, node = ctx.params.node, nodes;
    if (!(nodes = me.nodes)) {
      me.nodes = nodes = {};
      me.buildNodes(tree, '');
    }
    node = nodes[node];
    if (node) {
      if (me.node) {
        me.node.sortedData = me.sortedData;
        me.node.currentOrder = me.currentOrder;
      }
      me.node = node;
      me.data = node.data;
      me.sortedData = node.sortedData;
      me.currentOrder = node.currentOrder;
    } else {
      me.data = null;
    }
  }, getData:function(ctx) {
    var me = this, params = ctx.params, order = (params.filter || '') + (params.group || '') + '-' + (params.sort || '') + '-' + (params.dir || ''), tree = me.tree, dynamicData, data, fields, sortFn, filters;
    if (tree) {
      me.fixTree(ctx, tree);
    }
    data = me.data;
    if (typeof data === 'function') {
      dynamicData = true;
      data = data.call(this, ctx);
    }
    if (!data || order === '--') {
      return data || [];
    }
    if (!dynamicData && order === me.currentOrder) {
      return me.sortedData;
    }
    ctx.filterSpec = params.filter && Ext.decode(params.filter);
    ctx.groupSpec = params.group && Ext.decode(params.group);
    fields = params.sort;
    if (params.dir) {
      fields = [{direction:params.dir, property:fields}];
    } else {
      if (params.sort) {
        fields = Ext.decode(params.sort);
      } else {
        fields = null;
      }
    }
    if (ctx.filterSpec) {
      filters = new Ext.util.FilterCollection;
      filters.add(this.processFilters(ctx.filterSpec));
      data = Ext.Array.filter(data, filters.getFilterFn());
    }
    sortFn = makeSortFns(ctx.sortSpec = fields);
    if (ctx.groupSpec) {
      sortFn = makeSortFns([ctx.groupSpec], sortFn);
    }
    data = Ext.isArray(data) ? data.slice(0) : data;
    if (sortFn) {
      Ext.Array.sort(data, sortFn);
    }
    me.sortedData = data;
    me.currentOrder = order;
    return data;
  }, processFilters:Ext.identityFn, getPage:function(ctx, data) {
    var ret = data, length = data.length, start = ctx.params.start || 0, end = ctx.params.limit ? Math.min(length, start + ctx.params.limit) : length;
    if (start || end < length) {
      ret = ret.slice(start, end);
    }
    return ret;
  }, getGroupSummary:function(groupField, rows, ctx) {
    return rows[0];
  }, getSummary:function(ctx, data, page) {
    var me = this, groupField = ctx.groupSpec.property, accum, todo = {}, summary = [], fieldValue, lastFieldValue;
    Ext.each(page, function(rec) {
      fieldValue = rec[groupField];
      todo[fieldValue] = true;
    });
    function flush() {
      if (accum) {
        summary.push(me.getGroupSummary(groupField, accum, ctx));
        accum = null;
      }
    }
    Ext.each(data, function(rec) {
      fieldValue = rec[groupField];
      if (lastFieldValue !== fieldValue) {
        flush();
        lastFieldValue = fieldValue;
      }
      if (!todo[fieldValue]) {
        return !summary.length;
      }
      if (accum) {
        accum.push(rec);
      } else {
        accum = [rec];
      }
      return true;
    });
    flush();
    return summary;
  }};
}());
Ext.define('Ext.ux.ajax.JsonSimlet', {extend:'Ext.ux.ajax.DataSimlet', alias:'simlet.json', doGet:function(ctx) {
  var me = this, data = me.getData(ctx), page = me.getPage(ctx, data), reader = ctx.xhr.options.proxy && ctx.xhr.options.proxy.getReader(), root = reader && reader.getRootProperty(), ret = me.callParent(arguments), response = {};
  if (root && Ext.isArray(page)) {
    response[root] = page;
    response[reader.getTotalProperty()] = data.length;
  } else {
    response = page;
  }
  if (ctx.groupSpec) {
    response.summaryData = me.getSummary(ctx, data, page);
  }
  ret.responseText = Ext.encode(response);
  return ret;
}, doPost:function(ctx) {
  return this.doGet(ctx);
}});
Ext.define('Ext.ux.ajax.PivotSimlet', {extend:'Ext.ux.ajax.JsonSimlet', alias:'simlet.pivot', lastPost:null, lastResponse:null, keysSeparator:'', grandTotalKey:'', doPost:function(ctx) {
  var me = this, ret = me.callParent(arguments);
  me.lastResponse = me.processData(me.getData(ctx), Ext.decode(ctx.xhr.body));
  ret.responseText = Ext.encode(me.lastResponse);
  return ret;
}, processData:function(data, params) {
  var me = this, len = data.length, response = {success:true, leftAxis:[], topAxis:[], results:[]}, leftAxis = new Ext.util.MixedCollection, topAxis = new Ext.util.MixedCollection, results = new Ext.util.MixedCollection, i, j, k, leftKeys, topKeys, item, agg;
  me.lastPost = params;
  me.keysSeparator = params.keysSeparator;
  me.grandTotalKey = params.grandTotalKey;
  for (i = 0; i < len; i++) {
    leftKeys = me.extractValues(data[i], params.leftAxis, leftAxis);
    topKeys = me.extractValues(data[i], params.topAxis, topAxis);
    me.addResult(data[i], me.grandTotalKey, me.grandTotalKey, results);
    for (j = 0; j < leftKeys.length; j++) {
      me.addResult(data[i], leftKeys[j], me.grandTotalKey, results);
      for (k = 0; k < topKeys.length; k++) {
        me.addResult(data[i], leftKeys[j], topKeys[k], results);
      }
    }
    for (j = 0; j < topKeys.length; j++) {
      me.addResult(data[i], me.grandTotalKey, topKeys[j], results);
    }
  }
  response.leftAxis = leftAxis.getRange();
  response.topAxis = topAxis.getRange();
  len = results.getCount();
  for (i = 0; i < len; i++) {
    item = results.getAt(i);
    item.values = {};
    for (j = 0; j < params.aggregate.length; j++) {
      agg = params.aggregate[j];
      item.values[agg.id] = me[agg.aggregator](item.records, agg.dataIndex, item.leftKey, item.topKey);
    }
    delete item.records;
    response.results.push(item);
  }
  leftAxis.clear();
  topAxis.clear();
  results.clear();
  return response;
}, getKey:function(value) {
  var me = this;
  me.keysMap = me.keysMap || {};
  if (!Ext.isDefined(me.keysMap[value])) {
    me.keysMap[value] = Ext.id();
  }
  return me.keysMap[value];
}, extractValues:function(record, dimensions, col) {
  var len = dimensions.length, keys = [], j, key, item, dim;
  key = '';
  for (j = 0; j < len; j++) {
    dim = dimensions[j];
    key += (j > 0 ? this.keysSeparator : '') + this.getKey(record[dim.dataIndex]);
    item = col.getByKey(key);
    if (!item) {
      item = col.add(key, {key:key, value:record[dim.dataIndex], dimensionId:dim.id});
    }
    keys.push(key);
  }
  return keys;
}, addResult:function(record, leftKey, topKey, results) {
  var item = results.getByKey(leftKey + '/' + topKey);
  if (!item) {
    item = results.add(leftKey + '/' + topKey, {leftKey:leftKey, topKey:topKey, records:[]});
  }
  item.records.push(record);
}, sum:function(records, measure, rowGroupKey, colGroupKey) {
  var length = records.length, total = 0, i;
  for (i = 0; i < length; i++) {
    total += Ext.Number.from(records[i][measure], 0);
  }
  return total;
}, avg:function(records, measure, rowGroupKey, colGroupKey) {
  var length = records.length, total = 0, i;
  for (i = 0; i < length; i++) {
    total += Ext.Number.from(records[i][measure], 0);
  }
  return length > 0 ? total / length : 0;
}, min:function(records, measure, rowGroupKey, colGroupKey) {
  var data = [], length = records.length, i, v;
  for (i = 0; i < length; i++) {
    data.push(records[i][measure]);
  }
  v = Ext.Array.min(data);
  return v;
}, max:function(records, measure, rowGroupKey, colGroupKey) {
  var data = [], length = records.length, i, v;
  for (i = 0; i < length; i++) {
    data.push(records[i][measure]);
  }
  v = Ext.Array.max(data);
  return v;
}, count:function(records, measure, rowGroupKey, colGroupKey) {
  return records.length;
}, variance:function(records, measure, rowGroupKey, colGroupKey) {
  var me = Ext.pivot.Aggregators, length = records.length, avg = me.avg.apply(me, arguments), total = 0, i;
  if (avg > 0) {
    for (i = 0; i < length; i++) {
      total += Math.pow(Ext.Number.from(records[i][measure], 0) - avg, 2);
    }
  }
  return total > 0 && length > 1 ? total / (length - 1) : 0;
}, varianceP:function(records, measure, rowGroupKey, colGroupKey) {
  var me = Ext.pivot.Aggregators, length = records.length, avg = me.avg.apply(me, arguments), total = 0, i;
  if (avg > 0) {
    for (i = 0; i < length; i++) {
      total += Math.pow(Ext.Number.from(records[i][measure], 0) - avg, 2);
    }
  }
  return total > 0 && length > 0 ? total / length : 0;
}, stdDev:function(records, measure, rowGroupKey, colGroupKey) {
  var me = Ext.pivot.Aggregators, v = me.variance.apply(me, arguments);
  return v > 0 ? Math.sqrt(v) : 0;
}, stdDevP:function(records, measure, rowGroupKey, colGroupKey) {
  var me = Ext.pivot.Aggregators, v = me.varianceP.apply(me, arguments);
  return v > 0 ? Math.sqrt(v) : 0;
}});
Ext.define('Ext.ux.ajax.SimXhr', {readyState:0, mgr:null, simlet:null, constructor:function(config) {
  var me = this;
  Ext.apply(me, config);
  me.requestHeaders = {};
}, abort:function() {
  var me = this;
  if (me.timer) {
    Ext.undefer(me.timer);
    me.timer = null;
  }
  me.aborted = true;
}, getAllResponseHeaders:function() {
  var headers = [];
  if (Ext.isObject(this.responseHeaders)) {
    Ext.Object.each(this.responseHeaders, function(name, value) {
      headers.push(name + ': ' + value);
    });
  }
  return headers.join('\r\n');
}, getResponseHeader:function(header) {
  var headers = this.responseHeaders;
  return headers && headers[header] || null;
}, open:function(method, url, async, user, password) {
  var me = this;
  me.method = method;
  me.url = url;
  me.async = async !== false;
  me.user = user;
  me.password = password;
  me.setReadyState(1);
}, overrideMimeType:function(mimeType) {
  this.mimeType = mimeType;
}, schedule:function() {
  var me = this, delay = me.simlet.delay || me.mgr.delay;
  if (delay) {
    me.timer = Ext.defer(function() {
      me.onTick();
    }, delay);
  } else {
    me.onTick();
  }
}, send:function(body) {
  var me = this;
  me.body = body;
  if (me.async) {
    me.schedule();
  } else {
    me.onComplete();
  }
}, setReadyState:function(state) {
  var me = this;
  if (me.readyState !== state) {
    me.readyState = state;
    me.onreadystatechange();
  }
}, setRequestHeader:function(header, value) {
  this.requestHeaders[header] = value;
}, onreadystatechange:Ext.emptyFn, onComplete:function() {
  var me = this, callback, text;
  me.readyState = 4;
  Ext.apply(me, me.simlet.exec(me));
  callback = me.jsonpCallback;
  if (callback) {
    text = callback + '(' + me.responseText + ')';
    eval(text);
  }
}, onTick:function() {
  var me = this;
  me.timer = null;
  me.onComplete();
  me.onreadystatechange && me.onreadystatechange();
}});
Ext.define('Ext.ux.ajax.SimManager', {singleton:true, requires:['Ext.data.Connection', 'Ext.ux.ajax.SimXhr', 'Ext.ux.ajax.Simlet', 'Ext.ux.ajax.JsonSimlet'], defaultType:'basic', delay:150, ready:false, constructor:function() {
  this.simlets = [];
}, getSimlet:function(url) {
  var me = this, index = url.indexOf('?'), simlets = me.simlets, len = simlets.length, i, simlet, simUrl, match;
  if (index < 0) {
    index = url.indexOf('#');
  }
  if (index > 0) {
    url = url.substring(0, index);
  }
  for (i = 0; i < len; ++i) {
    simlet = simlets[i];
    simUrl = simlet.url;
    if (simUrl instanceof RegExp) {
      match = simUrl.test(url);
    } else {
      match = simUrl === url;
    }
    if (match) {
      return simlet;
    }
  }
  return me.defaultSimlet;
}, getXhr:function(method, url, options, async) {
  var simlet = this.getSimlet(url);
  if (simlet) {
    return simlet.openRequest(method, url, options, async);
  }
  return null;
}, init:function(config) {
  var me = this;
  Ext.apply(me, config);
  if (!me.ready) {
    me.ready = true;
    if (!('defaultSimlet' in me)) {
      me.defaultSimlet = new Ext.ux.ajax.Simlet({status:404, statusText:'Not Found'});
    }
    me._openRequest = Ext.data.Connection.prototype.openRequest;
    Ext.data.request.Ajax.override({openRequest:function(options, requestOptions, async) {
      var xhr = !options.nosim && me.getXhr(requestOptions.method, requestOptions.url, options, async);
      if (!xhr) {
        xhr = this.callParent(arguments);
      }
      return xhr;
    }});
    if (Ext.data.JsonP) {
      Ext.data.JsonP.self.override({createScript:function(url, params, options) {
        var fullUrl = Ext.urlAppend(url, Ext.Object.toQueryString(params)), script = !options.nosim && me.getXhr('GET', fullUrl, options, true);
        if (!script) {
          script = this.callParent(arguments);
        }
        return script;
      }, loadScript:function(request) {
        var script = request.script;
        if (script.simlet) {
          script.jsonpCallback = request.params[request.callbackKey];
          script.send(null);
          request.script = document.createElement('script');
        } else {
          this.callParent(arguments);
        }
      }});
    }
  }
  return me;
}, openRequest:function(method, url, async) {
  var opt = {method:method, url:url};
  return this._openRequest.call(Ext.data.Connection.prototype, {}, opt, async);
}, register:function(simlet) {
  var me = this;
  me.init();
  function reg(one) {
    var simlet = one;
    if (!simlet.isSimlet) {
      simlet = Ext.create('simlet.' + (simlet.type || simlet.stype || me.defaultType), one);
    }
    me.simlets.push(simlet);
    simlet.manager = me;
  }
  if (Ext.isArray(simlet)) {
    Ext.each(simlet, reg);
  } else {
    if (simlet.isSimlet || simlet.url) {
      reg(simlet);
    } else {
      Ext.Object.each(simlet, function(url, s) {
        s.url = url;
        reg(s);
      });
    }
  }
  return me;
}});
Ext.define('Ext.ux.ajax.XmlSimlet', {extend:'Ext.ux.ajax.DataSimlet', alias:'simlet.xml', xmlTpl:['\x3c{root}\x3e\n', '\x3ctpl for\x3d"data"\x3e', '    \x3c{parent.record}\x3e\n', '\x3ctpl for\x3d"parent.fields"\x3e', '        \x3c{name}\x3e{[parent[values.name]]}\x3c/{name}\x3e\n', '\x3c/tpl\x3e', '    \x3c/{parent.record}\x3e\n', '\x3c/tpl\x3e', '\x3c/{root}\x3e'], doGet:function(ctx) {
  var me = this, data = me.getData(ctx), page = me.getPage(ctx, data), proxy = ctx.xhr.options.operation.getProxy(), reader = proxy && proxy.getReader(), model = reader && reader.getModel(), ret = me.callParent(arguments), response = {data:page, reader:reader, fields:model && model.fields, root:reader && reader.getRootProperty(), record:reader && reader.record}, tpl, xml, doc;
  if (ctx.groupSpec) {
    response.summaryData = me.getSummary(ctx, data, page);
  }
  if (me.xmlTpl) {
    tpl = Ext.XTemplate.getTpl(me, 'xmlTpl');
    xml = tpl.apply(response);
  } else {
    xml = data;
  }
  if (typeof DOMParser !== 'undefined') {
    doc = (new DOMParser).parseFromString(xml, 'text/xml');
  } else {
    doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.async = false;
    doc.loadXML(xml);
  }
  ret.responseText = xml;
  ret.responseXML = doc;
  return ret;
}, fixTree:function() {
  var buffer = [];
  this.callParent(arguments);
  this.buildTreeXml(this.data, buffer);
  this.data = buffer.join('');
}, buildTreeXml:function(nodes, buffer) {
  var rootProperty = this.rootProperty, recordProperty = this.recordProperty;
  buffer.push('\x3c', rootProperty, '\x3e');
  Ext.Array.forEach(nodes, function(node) {
    var key;
    buffer.push('\x3c', recordProperty, '\x3e');
    for (key in node) {
      if (key === 'children') {
        this.buildTreeXml(node.children, buffer);
      } else {
        buffer.push('\x3c', key, '\x3e', node[key], '\x3c/', key, '\x3e');
      }
    }
    buffer.push('\x3c/', recordProperty, '\x3e');
  });
  buffer.push('\x3c/', rootProperty, '\x3e');
}});
Ext.define('Ext.ux.event.Driver', {extend:'Ext.util.Observable', active:null, specialKeysByName:{PGUP:33, PGDN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40}, specialKeysByCode:{}, getTextSelection:function(el) {
  var doc = el.ownerDocument, range, range2, start, end;
  if (typeof el.selectionStart === 'number') {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    if (doc.selection) {
      range = doc.selection.createRange();
      range2 = el.createTextRange();
      range2.setEndPoint('EndToStart', range);
      start = range2.text.length;
      end = start + range.text.length;
    }
  }
  return [start, end];
}, getTime:function() {
  return (new Date).getTime();
}, getTimestamp:function() {
  var d = this.getTime();
  return d - this.startTime;
}, onStart:function() {
}, onStop:function() {
}, start:function() {
  var me = this;
  if (!me.active) {
    me.active = new Date;
    me.startTime = me.getTime();
    me.onStart();
    me.fireEvent('start', me);
  }
}, stop:function() {
  var me = this;
  if (me.active) {
    me.active = null;
    me.onStop();
    me.fireEvent('stop', me);
  }
}}, function() {
  var proto = this.prototype;
  Ext.Object.each(proto.specialKeysByName, function(name, value) {
    proto.specialKeysByCode[value] = name;
  });
});
Ext.define('Ext.ux.event.Maker', {eventQueue:[], startAfter:500, timerIncrement:500, currentTiming:0, constructor:function(config) {
  var me = this;
  me.currentTiming = me.startAfter;
  if (!Ext.isArray(config)) {
    config = [config];
  }
  Ext.Array.each(config, function(item) {
    item.el = item.el || 'el';
    Ext.Array.each(Ext.ComponentQuery.query(item.cmpQuery), function(cmp) {
      var event = {}, x, y, el;
      if (!item.domQuery) {
        el = cmp[item.el];
      } else {
        el = cmp.el.down(item.domQuery);
      }
      event.target = '#' + el.dom.id;
      event.type = item.type;
      event.button = config.button || 0;
      x = el.getX() + el.getWidth() / 2;
      y = el.getY() + el.getHeight() / 2;
      event.xy = [x, y];
      event.ts = me.currentTiming;
      me.currentTiming += me.timerIncrement;
      me.eventQueue.push(event);
    });
    if (item.screenshot) {
      me.eventQueue[me.eventQueue.length - 1].screenshot = true;
    }
  });
  return me.eventQueue;
}});
Ext.define('Ext.ux.event.Player', function(Player) {
  var defaults = {}, mouseEvents = {}, keyEvents = {}, doc, uiEvents = {}, bubbleEvents = {resize:1, reset:1, submit:1, change:1, select:1, error:1, abort:1};
  Ext.each(['click', 'dblclick', 'mouseover', 'mouseout', 'mousedown', 'mouseup', 'mousemove'], function(type) {
    bubbleEvents[type] = defaults[type] = mouseEvents[type] = {bubbles:true, cancelable:type !== 'mousemove', detail:1, screenX:0, screenY:0, clientX:0, clientY:0, ctrlKey:false, altKey:false, shiftKey:false, metaKey:false, button:0};
  });
  Ext.each(['keydown', 'keyup', 'keypress'], function(type) {
    bubbleEvents[type] = defaults[type] = keyEvents[type] = {bubbles:true, cancelable:true, ctrlKey:false, altKey:false, shiftKey:false, metaKey:false, keyCode:0, charCode:0};
  });
  Ext.each(['blur', 'change', 'focus', 'resize', 'scroll', 'select'], function(type) {
    defaults[type] = uiEvents[type] = {bubbles:type in bubbleEvents, cancelable:false, detail:1};
  });
  var inputSpecialKeys = {8:function(target, start, end) {
    if (start < end) {
      target.value = target.value.substring(0, start) + target.value.substring(end);
    } else {
      if (start > 0) {
        target.value = target.value.substring(0, --start) + target.value.substring(end);
      }
    }
    this.setTextSelection(target, start, start);
  }, 46:function(target, start, end) {
    if (start < end) {
      target.value = target.value.substring(0, start) + target.value.substring(end);
    } else {
      if (start < target.value.length - 1) {
        target.value = target.value.substring(0, start) + target.value.substring(start + 1);
      }
    }
    this.setTextSelection(target, start, start);
  }};
  return {extend:'Ext.ux.event.Driver', keyFrameEvents:{click:true}, pauseForAnimations:true, speed:1, stallTime:0, _inputSpecialKeys:{INPUT:inputSpecialKeys, TEXTAREA:Ext.apply({}, inputSpecialKeys)}, tagPathRegEx:/(\w+)(?:\[(\d+)\])?/, constructor:function(config) {
    var me = this;
    me.callParent(arguments);
    me.timerFn = function() {
      me.onTick();
    };
    me.attachTo = me.attachTo || window;
    doc = me.attachTo.document;
  }, getElementFromXPath:function(xpath) {
    var me = this, parts = xpath.split('/'), regex = me.tagPathRegEx, i, n, m, count, tag, child, el = me.attachTo.document;
    el = parts[0] === '~' ? el.body : el.getElementById(parts[0].substring(1));
    for (i = 1, n = parts.length; el && i < n; ++i) {
      m = regex.exec(parts[i]);
      count = m[2] ? parseInt(m[2], 10) : 1;
      tag = m[1].toUpperCase();
      for (child = el.firstChild; child; child = child.nextSibling) {
        if (child.tagName === tag) {
          if (count === 1) {
            break;
          }
          --count;
        }
      }
      el = child;
    }
    return el;
  }, offsetToRangeCharacterMove:function(el, offset) {
    return offset - (el.value.slice(0, offset).split('\r\n').length - 1);
  }, setTextSelection:function(el, startOffset, endOffset) {
    var range, startCharMove;
    if (startOffset < 0) {
      startOffset += el.value.length;
    }
    if (endOffset == null) {
      endOffset = startOffset;
    }
    if (endOffset < 0) {
      endOffset += el.value.length;
    }
    if (typeof el.selectionStart === 'number') {
      el.selectionStart = startOffset;
      el.selectionEnd = endOffset;
    } else {
      range = el.createTextRange();
      startCharMove = this.offsetToRangeCharacterMove(el, startOffset);
      range.collapse(true);
      if (startOffset === endOffset) {
        range.move('character', startCharMove);
      } else {
        range.moveEnd('character', this.offsetToRangeCharacterMove(el, endOffset));
        range.moveStart('character', startCharMove);
      }
      range.select();
    }
  }, getTimeIndex:function() {
    var t = this.getTimestamp() - this.stallTime;
    return t * this.speed;
  }, makeToken:function(eventDescriptor, signal) {
    var me = this, t0;
    eventDescriptor[signal] = true;
    eventDescriptor.defer = function() {
      eventDescriptor[signal] = false;
      t0 = me.getTime();
    };
    eventDescriptor.finish = function() {
      eventDescriptor[signal] = true;
      me.stallTime += me.getTime() - t0;
      me.schedule();
    };
  }, nextEvent:function(eventDescriptor) {
    var me = this, index = ++me.queueIndex;
    if (me.keyFrameEvents[eventDescriptor.type]) {
      Ext.Array.insert(me.eventQueue, index, [{keyframe:true, ts:eventDescriptor.ts}]);
    }
  }, peekEvent:function() {
    return this.eventQueue[this.queueIndex] || null;
  }, replaceEvent:function(index, events) {
    for (var t, i = 0, n = events.length; i < n; ++i) {
      if (i) {
        t = events[i - 1];
        delete t.afterplay;
        delete t.screenshot;
        delete events[i].beforeplay;
      }
    }
    Ext.Array.replace(this.eventQueue, index == null ? this.queueIndex : index, 1, events);
  }, processEvents:function() {
    var me = this, animations = me.pauseForAnimations && me.attachTo.Ext.fx.Manager.items, eventDescriptor;
    while ((eventDescriptor = me.peekEvent()) !== null) {
      if (animations && animations.getCount()) {
        return true;
      }
      if (eventDescriptor.keyframe) {
        if (!me.processKeyFrame(eventDescriptor)) {
          return false;
        }
        me.nextEvent(eventDescriptor);
      } else {
        if (eventDescriptor.ts <= me.getTimeIndex() && me.fireEvent('beforeplay', me, eventDescriptor) !== false && me.playEvent(eventDescriptor)) {
          me.nextEvent(eventDescriptor);
        } else {
          return true;
        }
      }
    }
    me.stop();
    return false;
  }, processKeyFrame:function(eventDescriptor) {
    var me = this;
    if (!eventDescriptor.defer) {
      me.makeToken(eventDescriptor, 'done');
      me.fireEvent('keyframe', me, eventDescriptor);
    }
    return eventDescriptor.done;
  }, injectEvent:function(target, event) {
    var me = this, type = event.type, options = Ext.apply({}, event, defaults[type]), handler;
    if (type === 'type') {
      handler = me._inputSpecialKeys[target.tagName];
      if (handler) {
        return me.injectTypeInputEvent(target, event, handler);
      }
      return me.injectTypeEvent(target, event);
    }
    if (type === 'focus' && target.focus) {
      target.focus();
      return true;
    }
    if (type === 'blur' && target.blur) {
      target.blur();
      return true;
    }
    if (type === 'scroll') {
      target.scrollLeft = event.pos[0];
      target.scrollTop = event.pos[1];
      return true;
    }
    if (type === 'mduclick') {
      return me.injectEvent(target, Ext.applyIf({type:'mousedown'}, event)) && me.injectEvent(target, Ext.applyIf({type:'mouseup'}, event)) && me.injectEvent(target, Ext.applyIf({type:'click'}, event));
    }
    if (mouseEvents[type]) {
      return Player.injectMouseEvent(target, options, me.attachTo);
    }
    if (keyEvents[type]) {
      return Player.injectKeyEvent(target, options, me.attachTo);
    }
    if (uiEvents[type]) {
      return Player.injectUIEvent(target, type, options.bubbles, options.cancelable, options.view || me.attachTo, options.detail);
    }
    return false;
  }, injectTypeEvent:function(target, event) {
    var me = this, text = event.text, xlat = [], ch, chUp, i, n, upper;
    if (text) {
      delete event.text;
      upper = text.toUpperCase();
      for (i = 0, n = text.length; i < n; ++i) {
        ch = text.charCodeAt(i);
        chUp = upper.charCodeAt(i);
        xlat.push(Ext.applyIf({type:'keydown', charCode:chUp, keyCode:chUp}, event), Ext.applyIf({type:'keypress', charCode:ch, keyCode:ch}, event), Ext.applyIf({type:'keyup', charCode:chUp, keyCode:chUp}, event));
      }
    } else {
      xlat.push(Ext.applyIf({type:'keydown', charCode:event.keyCode}, event), Ext.applyIf({type:'keyup', charCode:event.keyCode}, event));
    }
    for (i = 0, n = xlat.length; i < n; ++i) {
      me.injectEvent(target, xlat[i]);
    }
    return true;
  }, injectTypeInputEvent:function(target, event, handler) {
    var me = this, text = event.text, sel, n;
    if (handler) {
      sel = me.getTextSelection(target);
      if (text) {
        n = sel[0];
        target.value = target.value.substring(0, n) + text + target.value.substring(sel[1]);
        n += text.length;
        me.setTextSelection(target, n, n);
      } else {
        if (!(handler = handler[event.keyCode])) {
          if ('caret' in event) {
            me.setTextSelection(target, event.caret, event.caret);
          } else {
            if (event.selection) {
              me.setTextSelection(target, event.selection[0], event.selection[1]);
            }
          }
          return me.injectTypeEvent(target, event);
        }
        handler.call(this, target, sel[0], sel[1]);
        return true;
      }
    }
    return true;
  }, playEvent:function(eventDescriptor) {
    var me = this, target = me.getElementFromXPath(eventDescriptor.target), event;
    if (!target) {
      return false;
    }
    if (!me.playEventHook(eventDescriptor, 'beforeplay')) {
      return false;
    }
    if (!eventDescriptor.injected) {
      eventDescriptor.injected = true;
      event = me.translateEvent(eventDescriptor, target);
      me.injectEvent(target, event);
    }
    return me.playEventHook(eventDescriptor, 'afterplay');
  }, playEventHook:function(eventDescriptor, hookName) {
    var me = this, doneName = hookName + '.done', firedName = hookName + '.fired', hook = eventDescriptor[hookName];
    if (hook && !eventDescriptor[doneName]) {
      if (!eventDescriptor[firedName]) {
        eventDescriptor[firedName] = true;
        me.makeToken(eventDescriptor, doneName);
        if (me.eventScope && Ext.isString(hook)) {
          hook = me.eventScope[hook];
        }
        if (hook) {
          hook.call(me.eventScope || me, eventDescriptor);
        }
      }
      return false;
    }
    return true;
  }, schedule:function() {
    var me = this;
    if (!me.timer) {
      me.timer = Ext.defer(me.timerFn, 10);
    }
  }, _translateAcross:['type', 'button', 'charCode', 'keyCode', 'caret', 'pos', 'text', 'selection'], translateEvent:function(eventDescriptor, target) {
    var me = this, event = {}, modKeys = eventDescriptor.modKeys || '', names = me._translateAcross, i = names.length, name, xy;
    while (i--) {
      name = names[i];
      if (name in eventDescriptor) {
        event[name] = eventDescriptor[name];
      }
    }
    event.altKey = modKeys.indexOf('A') > 0;
    event.ctrlKey = modKeys.indexOf('C') > 0;
    event.metaKey = modKeys.indexOf('M') > 0;
    event.shiftKey = modKeys.indexOf('S') > 0;
    if (target && 'x' in eventDescriptor) {
      xy = Ext.fly(target).getXY();
      xy[0] += eventDescriptor.x;
      xy[1] += eventDescriptor.y;
    } else {
      if ('x' in eventDescriptor) {
        xy = [eventDescriptor.x, eventDescriptor.y];
      } else {
        if ('px' in eventDescriptor) {
          xy = [eventDescriptor.px, eventDescriptor.py];
        }
      }
    }
    if (xy) {
      event.clientX = event.screenX = xy[0];
      event.clientY = event.screenY = xy[1];
    }
    if (eventDescriptor.key) {
      event.keyCode = me.specialKeysByName[eventDescriptor.key];
    }
    if (eventDescriptor.type === 'wheel') {
      if ('onwheel' in me.attachTo.document) {
        event.wheelX = eventDescriptor.dx;
        event.wheelY = eventDescriptor.dy;
      } else {
        event.type = 'mousewheel';
        event.wheelDeltaX = -40 * eventDescriptor.dx;
        event.wheelDeltaY = event.wheelDelta = -40 * eventDescriptor.dy;
      }
    }
    return event;
  }, onStart:function() {
    var me = this;
    me.queueIndex = 0;
    me.schedule();
  }, onStop:function() {
    var me = this;
    if (me.timer) {
      Ext.undefer(me.timer);
      me.timer = null;
    }
  }, onTick:function() {
    var me = this;
    me.timer = null;
    if (me.processEvents()) {
      me.schedule();
    }
  }, statics:{ieButtonCodeMap:{0:1, 1:4, 2:2}, injectKeyEvent:function(target, options, view) {
    var type = options.type, customEvent = null;
    if (type === 'textevent') {
      type = 'keypress';
    }
    view = view || window;
    if (doc.createEvent) {
      try {
        customEvent = doc.createEvent('KeyEvents');
        customEvent.initKeyEvent(type, options.bubbles, options.cancelable, view, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);
      } catch (ex) {
        try {
          customEvent = doc.createEvent('Events');
        } catch (uierror) {
          customEvent = doc.createEvent('UIEvents');
        } finally {
          customEvent.initEvent(type, options.bubbles, options.cancelable);
          customEvent.view = view;
          customEvent.altKey = options.altKey;
          customEvent.ctrlKey = options.ctrlKey;
          customEvent.shiftKey = options.shiftKey;
          customEvent.metaKey = options.metaKey;
          customEvent.keyCode = options.keyCode;
          customEvent.charCode = options.charCode;
        }
      }
      target.dispatchEvent(customEvent);
    } else {
      if (doc.createEventObject) {
        customEvent = doc.createEventObject();
        customEvent.bubbles = options.bubbles;
        customEvent.cancelable = options.cancelable;
        customEvent.view = view;
        customEvent.ctrlKey = options.ctrlKey;
        customEvent.altKey = options.altKey;
        customEvent.shiftKey = options.shiftKey;
        customEvent.metaKey = options.metaKey;
        customEvent.keyCode = options.charCode > 0 ? options.charCode : options.keyCode;
        target.fireEvent('on' + type, customEvent);
      } else {
        return false;
      }
    }
    return true;
  }, injectMouseEvent:function(target, options, view) {
    var type = options.type, customEvent = null;
    view = view || window;
    if (doc.createEvent) {
      customEvent = doc.createEvent('MouseEvents');
      if (customEvent.initMouseEvent) {
        customEvent.initMouseEvent(type, options.bubbles, options.cancelable, view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, options.relatedTarget);
      } else {
        customEvent = doc.createEvent('UIEvents');
        customEvent.initEvent(type, options.bubbles, options.cancelable);
        customEvent.view = view;
        customEvent.detail = options.detail;
        customEvent.screenX = options.screenX;
        customEvent.screenY = options.screenY;
        customEvent.clientX = options.clientX;
        customEvent.clientY = options.clientY;
        customEvent.ctrlKey = options.ctrlKey;
        customEvent.altKey = options.altKey;
        customEvent.metaKey = options.metaKey;
        customEvent.shiftKey = options.shiftKey;
        customEvent.button = options.button;
        customEvent.relatedTarget = options.relatedTarget;
      }
      if (options.relatedTarget && !customEvent.relatedTarget) {
        if (type === 'mouseout') {
          customEvent.toElement = options.relatedTarget;
        } else {
          if (type === 'mouseover') {
            customEvent.fromElement = options.relatedTarget;
          }
        }
      }
      target.dispatchEvent(customEvent);
    } else {
      if (doc.createEventObject) {
        customEvent = doc.createEventObject();
        customEvent.bubbles = options.bubbles;
        customEvent.cancelable = options.cancelable;
        customEvent.view = view;
        customEvent.detail = options.detail;
        customEvent.screenX = options.screenX;
        customEvent.screenY = options.screenY;
        customEvent.clientX = options.clientX;
        customEvent.clientY = options.clientY;
        customEvent.ctrlKey = options.ctrlKey;
        customEvent.altKey = options.altKey;
        customEvent.metaKey = options.metaKey;
        customEvent.shiftKey = options.shiftKey;
        customEvent.button = Player.ieButtonCodeMap[options.button] || 0;
        customEvent.relatedTarget = options.relatedTarget;
        target.fireEvent('on' + type, customEvent);
      } else {
        return false;
      }
    }
    return true;
  }, injectUIEvent:function(target, options, view) {
    var customEvent = null;
    view = view || window;
    if (doc.createEvent) {
      customEvent = doc.createEvent('UIEvents');
      customEvent.initUIEvent(options.type, options.bubbles, options.cancelable, view, options.detail);
      target.dispatchEvent(customEvent);
    } else {
      if (doc.createEventObject) {
        customEvent = doc.createEventObject();
        customEvent.bubbles = options.bubbles;
        customEvent.cancelable = options.cancelable;
        customEvent.view = view;
        customEvent.detail = options.detail;
        target.fireEvent('on' + options.type, customEvent);
      } else {
        return false;
      }
    }
    return true;
  }}};
});
Ext.define('Ext.ux.event.Recorder', function(Recorder) {
  var eventsToRecord, eventKey;
  function apply() {
    var a = arguments, n = a.length, obj = {kind:'other'}, i;
    for (i = 0; i < n; ++i) {
      Ext.apply(obj, arguments[i]);
    }
    if (obj.alt && !obj.event) {
      obj.event = obj.alt;
    }
    return obj;
  }
  function key(extra) {
    return apply({kind:'keyboard', modKeys:true, key:true}, extra);
  }
  function mouse(extra) {
    return apply({kind:'mouse', button:true, modKeys:true, xy:true}, extra);
  }
  eventsToRecord = {keydown:key(), keypress:key(), keyup:key(), dragmove:mouse({alt:'mousemove', pageCoords:true, whileDrag:true}), mousemove:mouse({pageCoords:true}), mouseover:mouse(), mouseout:mouse(), click:mouse(), wheel:mouse({wheel:true}), mousedown:mouse({press:true}), mouseup:mouse({release:true}), scroll:apply({listen:false}), focus:apply(), blur:apply()};
  for (eventKey in eventsToRecord) {
    if (!eventsToRecord[eventKey].event) {
      eventsToRecord[eventKey].event = eventKey;
    }
  }
  eventsToRecord.wheel.event = null;
  return {extend:'Ext.ux.event.Driver', eventsToRecord:eventsToRecord, ignoreIdRegEx:/ext-gen(?:\d+)/, inputRe:/^(input|textarea)$/i, constructor:function(config) {
    var me = this, events = config && config.eventsToRecord;
    if (events) {
      me.eventsToRecord = Ext.apply(Ext.apply({}, me.eventsToRecord), events);
      delete config.eventsToRecord;
    }
    me.callParent(arguments);
    me.clear();
    me.modKeys = [];
    me.attachTo = me.attachTo || window;
  }, clear:function() {
    this.eventsRecorded = [];
  }, listenToEvent:function(event) {
    var me = this, el = me.attachTo.document.body, fn = function() {
      return me.onEvent.apply(me, arguments);
    }, cleaner = {};
    if (el.attachEvent && el.ownerDocument.documentMode < 10) {
      event = 'on' + event;
      el.attachEvent(event, fn);
      cleaner.destroy = function() {
        if (fn) {
          el.detachEvent(event, fn);
          fn = null;
        }
      };
    } else {
      el.addEventListener(event, fn, true);
      cleaner.destroy = function() {
        if (fn) {
          el.removeEventListener(event, fn, true);
          fn = null;
        }
      };
    }
    return cleaner;
  }, coalesce:function(rec, ev) {
    var me = this, events = me.eventsRecorded, length = events.length, tail = length && events[length - 1], tail2 = length > 1 && events[length - 2], tail3 = length > 2 && events[length - 3];
    if (!tail) {
      return false;
    }
    if (rec.type === 'mousemove') {
      if (tail.type === 'mousemove' && rec.ts - tail.ts < 200) {
        rec.ts = tail.ts;
        events[length - 1] = rec;
        return true;
      }
    } else {
      if (rec.type === 'click') {
        if (tail2 && tail.type === 'mouseup' && tail2.type === 'mousedown') {
          if (rec.button === tail.button && rec.button === tail2.button && rec.target === tail.target && rec.target === tail2.target && me.samePt(rec, tail) && me.samePt(rec, tail2)) {
            events.pop();
            tail2.type = 'mduclick';
            return true;
          }
        }
      } else {
        if (rec.type === 'keyup') {
          if (tail2 && tail.type === 'keypress' && tail2.type === 'keydown') {
            if (rec.target === tail.target && rec.target === tail2.target) {
              events.pop();
              tail2.type = 'type';
              tail2.text = String.fromCharCode(tail.charCode);
              delete tail2.charCode;
              delete tail2.keyCode;
              if (tail3 && tail3.type === 'type') {
                if (tail3.text && tail3.target === tail2.target) {
                  tail3.text += tail2.text;
                  events.pop();
                }
              }
              return true;
            }
          } else {
            if (me.completeKeyStroke(tail, rec)) {
              tail.type = 'type';
              me.completeSpecialKeyStroke(ev.target, tail, rec);
              return true;
            } else {
              if (tail.type === 'scroll' && me.completeKeyStroke(tail2, rec)) {
                tail2.type = 'type';
                me.completeSpecialKeyStroke(ev.target, tail2, rec);
                events.pop();
                events.pop();
                events.push(tail, tail2);
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }, completeKeyStroke:function(down, up) {
    if (down && down.type === 'keydown' && down.keyCode === up.keyCode) {
      delete down.charCode;
      return true;
    }
    return false;
  }, completeSpecialKeyStroke:function(target, down, up) {
    var key = this.specialKeysByCode[up.keyCode];
    if (key && this.inputRe.test(target.tagName)) {
      delete down.keyCode;
      down.key = key;
      down.selection = this.getTextSelection(target);
      if (down.selection[0] === down.selection[1]) {
        down.caret = down.selection[0];
        delete down.selection;
      }
      return true;
    }
    return false;
  }, getElementXPath:function(el) {
    var me = this, good = false, xpath = [], count, sibling, t, tag;
    for (t = el; t; t = t.parentNode) {
      if (t === me.attachTo.document.body) {
        xpath.unshift('~');
        good = true;
        break;
      }
      if (t.id && !me.ignoreIdRegEx.test(t.id)) {
        xpath.unshift('#' + t.id);
        good = true;
        break;
      }
      for (count = 1, sibling = t; !!(sibling = sibling.previousSibling);) {
        if (sibling.tagName === t.tagName) {
          ++count;
        }
      }
      tag = t.tagName.toLowerCase();
      if (count < 2) {
        xpath.unshift(tag);
      } else {
        xpath.unshift(tag + '[' + count + ']');
      }
    }
    return good ? xpath.join('/') : null;
  }, getRecordedEvents:function() {
    return this.eventsRecorded;
  }, onEvent:function(ev) {
    var me = this, e = new Ext.event.Event(ev), info = me.eventsToRecord[e.type], root, modKeys, elXY, rec = {type:e.type, ts:me.getTimestamp(), target:me.getElementXPath(e.target)}, xy;
    if (!info || !rec.target) {
      return;
    }
    root = e.target.ownerDocument;
    root = root.defaultView || root.parentWindow;
    if (root !== me.attachTo) {
      return;
    }
    if (me.eventsToRecord.scroll) {
      me.syncScroll(e.target);
    }
    if (info.xy) {
      xy = e.getXY();
      if (info.pageCoords || !rec.target) {
        rec.px = xy[0];
        rec.py = xy[1];
      } else {
        elXY = Ext.fly(e.getTarget()).getXY();
        xy[0] -= elXY[0];
        xy[1] -= elXY[1];
        rec.x = xy[0];
        rec.y = xy[1];
      }
    }
    if (info.button) {
      if ('buttons' in ev) {
        rec.button = ev.buttons;
      } else {
        rec.button = ev.button;
      }
      if (!rec.button && info.whileDrag) {
        return;
      }
    }
    if (info.wheel) {
      rec.type = 'wheel';
      if (info.event === 'wheel') {
        rec.dx = ev.deltaX;
        rec.dy = ev.deltaY;
      } else {
        if (typeof ev.wheelDeltaX === 'number') {
          rec.dx = -1 / 40 * ev.wheelDeltaX;
          rec.dy = -1 / 40 * ev.wheelDeltaY;
        } else {
          if (ev.wheelDelta) {
            rec.dy = -1 / 40 * ev.wheelDelta;
          } else {
            if (ev.detail) {
              rec.dy = ev.detail;
            }
          }
        }
      }
    }
    if (info.modKeys) {
      me.modKeys[0] = e.altKey ? 'A' : '';
      me.modKeys[1] = e.ctrlKey ? 'C' : '';
      me.modKeys[2] = e.metaKey ? 'M' : '';
      me.modKeys[3] = e.shiftKey ? 'S' : '';
      modKeys = me.modKeys.join('');
      if (modKeys) {
        rec.modKeys = modKeys;
      }
    }
    if (info.key) {
      rec.charCode = e.getCharCode();
      rec.keyCode = e.getKey();
    }
    if (me.coalesce(rec, e)) {
      me.fireEvent('coalesce', me, rec);
    } else {
      me.eventsRecorded.push(rec);
      me.fireEvent('add', me, rec);
    }
  }, onStart:function() {
    var me = this, ddm = me.attachTo.Ext.dd.DragDropManager, evproto = me.attachTo.Ext.EventObjectImpl.prototype, special = [];
    Recorder.prototype.eventsToRecord.wheel.event = 'onwheel' in me.attachTo.document ? 'wheel' : 'mousewheel';
    me.listeners = [];
    Ext.Object.each(me.eventsToRecord, function(name, value) {
      if (value && value.listen !== false) {
        if (!value.event) {
          value.event = name;
        }
        if (value.alt && value.alt !== name) {
          if (!me.eventsToRecord[value.alt]) {
            special.push(value);
          }
        } else {
          me.listeners.push(me.listenToEvent(value.event));
        }
      }
    });
    Ext.each(special, function(info) {
      me.eventsToRecord[info.alt] = info;
      me.listeners.push(me.listenToEvent(info.alt));
    });
    me.ddmStopEvent = ddm.stopEvent;
    ddm.stopEvent = Ext.Function.createSequence(ddm.stopEvent, function(e) {
      me.onEvent(e);
    });
    me.evStopEvent = evproto.stopEvent;
    evproto.stopEvent = Ext.Function.createSequence(evproto.stopEvent, function() {
      me.onEvent(this);
    });
  }, onStop:function() {
    var me = this;
    Ext.destroy(me.listeners);
    me.listeners = null;
    me.attachTo.Ext.dd.DragDropManager.stopEvent = me.ddmStopEvent;
    me.attachTo.Ext.EventObjectImpl.prototype.stopEvent = me.evStopEvent;
  }, samePt:function(pt1, pt2) {
    return pt1.x === pt2.x && pt1.y === pt2.y;
  }, syncScroll:function(el) {
    var me = this, ts = me.getTimestamp(), oldX, oldY, x, y, scrolled, rec, p;
    for (p = el; p; p = p.parentNode) {
      oldX = p.$lastScrollLeft;
      oldY = p.$lastScrollTop;
      x = p.scrollLeft;
      y = p.scrollTop;
      scrolled = false;
      if (oldX !== x) {
        if (x) {
          scrolled = true;
        }
        p.$lastScrollLeft = x;
      }
      if (oldY !== y) {
        if (y) {
          scrolled = true;
        }
        p.$lastScrollTop = y;
      }
      if (scrolled) {
        me.eventsRecorded.push(rec = {type:'scroll', target:me.getElementXPath(p), ts:ts, pos:[x, y]});
        me.fireEvent('add', me, rec);
      }
      if (p.tagName === 'BODY') {
        break;
      }
    }
  }};
});
Ext.define('Ext.ux.gauge.needle.Abstract', {mixins:['Ext.mixin.Factoryable'], alias:'gauge.needle.abstract', isNeedle:true, config:{path:null, innerRadius:25, outerRadius:'100% - 20', style:null, radius:0, gauge:null}, constructor:function(config) {
  this.initConfig(config);
}, applyInnerRadius:function(innerRadius) {
  return this.getGauge().getRadiusFn(innerRadius);
}, applyOuterRadius:function(outerRadius) {
  return this.getGauge().getRadiusFn(outerRadius);
}, updateRadius:function() {
  this.regeneratePath();
}, setTransform:function(centerX, centerY, rotation) {
  var needleGroup = this.getNeedleGroup();
  needleGroup.setStyle('transform', 'translate(' + centerX + 'px,' + centerY + 'px) ' + 'rotate(' + rotation + 'deg)');
}, applyPath:function(path) {
  return Ext.isFunction(path) ? path : null;
}, updatePath:function(path) {
  this.regeneratePath(path);
}, regeneratePath:function(path) {
  path = path || this.getPath();
  var me = this, radius = me.getRadius(), inner = me.getInnerRadius()(radius), outer = me.getOuterRadius()(radius), d = outer > inner ? path(inner, outer) : '';
  me.getNeedlePath().dom.setAttribute('d', d);
}, getNeedleGroup:function() {
  var gauge = this.getGauge(), group = this.needleGroup;
  if (!group) {
    group = this.needleGroup = Ext.get(document.createElementNS(gauge.svgNS, 'g'));
    gauge.getSvg().appendChild(group);
  }
  return group;
}, getNeedlePath:function() {
  var me = this, pathElement = me.pathElement;
  if (!pathElement) {
    pathElement = me.pathElement = Ext.get(document.createElementNS(me.getGauge().svgNS, 'path'));
    pathElement.dom.setAttribute('class', Ext.baseCSSPrefix + 'gauge-needle');
    me.getNeedleGroup().appendChild(pathElement);
  }
  return pathElement;
}, updateStyle:function(style) {
  var pathElement = this.getNeedlePath();
  if (Ext.isObject(style)) {
    pathElement.setStyle(style);
  } else {
    pathElement.dom.removeAttribute('style');
  }
}, destroy:function() {
  var me = this;
  me.pathElement = Ext.destroy(me.pathElement);
  me.needleGroup = Ext.destroy(me.needleGroup);
  me.setGauge(null);
}});
Ext.define('Ext.ux.gauge.Gauge', {alternateClassName:'Ext.ux.Gauge', extend:'Ext.Gadget', xtype:'gauge', requires:['Ext.ux.gauge.needle.Abstract', 'Ext.util.Region'], config:{padding:10, trackStart:135, trackLength:270, angleOffset:0, minValue:0, maxValue:100, value:50, needle:null, needleDefaults:{cached:true, $value:{type:'diamond'}}, clockwise:true, textTpl:['\x3ctpl\x3e{value:number("0.00")}%\x3c/tpl\x3e'], textAlign:'c-c', textOffset:{dx:0, dy:0}, trackStyle:{outerRadius:'100%', innerRadius:'100% - 20', 
round:false}, valueStyle:{outerRadius:'100% - 2', innerRadius:'100% - 18', round:false}, animation:true}, baseCls:Ext.baseCSSPrefix + 'gauge', template:[{reference:'bodyElement', children:[{reference:'textElement', cls:Ext.baseCSSPrefix + 'gauge-text'}]}], defaultBindProperty:'value', pathAttributes:{fill:true, fillOpacity:true, stroke:true, strokeOpacity:true, strokeWidth:true}, easings:{linear:Ext.identityFn, 'in':function(t) {
  return t * t * t;
}, out:function(t) {
  return --t * t * t + 1;
}, inOut:function(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}}, resizeDelay:0, resizeTimerId:0, size:null, svgNS:'http://www.w3.org/2000/svg', svg:null, defs:null, trackArc:null, valueArc:null, trackGradient:null, valueGradient:null, fx:null, fxValue:0, fxAngleOffset:0, constructor:function(config) {
  var me = this;
  me.fitSectorInRectCache = {startAngle:null, lengthAngle:null, minX:null, maxX:null, minY:null, maxY:null};
  me.interpolator = me.createInterpolator();
  me.callParent([config]);
  me.el.on('resize', 'onElementResize', me);
}, doDestroy:function() {
  var me = this;
  Ext.undefer(me.resizeTimerId);
  me.el.un('resize', 'onElementResize', me);
  me.stopAnimation();
  me.setNeedle(null);
  me.trackGradient = Ext.destroy(me.trackGradient);
  me.valueGradient = Ext.destroy(me.valueGradient);
  me.defs = Ext.destroy(me.defs);
  me.svg = Ext.destroy(me.svg);
  me.callParent();
}, onElementResize:function(element, size) {
  this.handleResize(size);
}, handleResize:function(size, instantly) {
  var me = this, el = me.element;
  if (!(el && (size = size || el.getSize()) && size.width && size.height)) {
    return;
  }
  me.resizeTimerId = Ext.undefer(me.resizeTimerId);
  if (!instantly && me.resizeDelay) {
    me.resizeTimerId = Ext.defer(me.handleResize, me.resizeDelay, me, [size, true]);
    return;
  }
  me.size = size;
  me.resizeHandler(size);
}, updateMinValue:function(minValue) {
  var me = this;
  me.interpolator.setDomain(minValue, me.getMaxValue());
  if (!me.isConfiguring) {
    me.render();
  }
}, updateMaxValue:function(maxValue) {
  var me = this;
  me.interpolator.setDomain(me.getMinValue(), maxValue);
  if (!me.isConfiguring) {
    me.render();
  }
}, updateAngleOffset:function(angleOffset, oldAngleOffset) {
  var me = this, animation = me.getAnimation();
  me.fxAngleOffset = angleOffset;
  if (me.isConfiguring) {
    return;
  }
  if (animation.duration) {
    me.animate(oldAngleOffset, angleOffset, animation.duration, me.easings[animation.easing], function(angleOffset) {
      me.fxAngleOffset = angleOffset;
      me.render();
    });
  } else {
    me.render();
  }
}, applyTrackStart:function(trackStart) {
  if (trackStart < 0 || trackStart >= 360) {
    Ext.raise("'trackStart' should be within [0, 360).");
  }
  return trackStart;
}, applyTrackLength:function(trackLength) {
  if (trackLength <= 0 || trackLength > 360) {
    Ext.raise("'trackLength' should be within (0, 360].");
  }
  return trackLength;
}, updateTrackStart:function(trackStart) {
  var me = this;
  if (!me.isConfiguring) {
    me.render();
  }
}, updateTrackLength:function(trackLength) {
  var me = this;
  me.interpolator.setRange(0, trackLength);
  if (!me.isConfiguring) {
    me.render();
  }
}, applyPadding:function(padding) {
  var ratio;
  if (typeof padding === 'string') {
    ratio = parseFloat(padding) / 100;
    return function(x) {
      return x * ratio;
    };
  }
  return function() {
    return padding;
  };
}, updatePadding:function() {
  if (!this.isConfiguring) {
    this.render();
  }
}, applyValue:function(value) {
  var minValue = this.getMinValue(), maxValue = this.getMaxValue();
  return Math.min(Math.max(value, minValue), maxValue);
}, updateValue:function(value, oldValue) {
  var me = this, animation = me.getAnimation();
  me.fxValue = value;
  if (me.isConfiguring) {
    return;
  }
  me.writeText();
  if (animation.duration) {
    me.animate(oldValue, value, animation.duration, me.easings[animation.easing], function(value) {
      me.fxValue = value;
      me.render();
    });
  } else {
    me.render();
  }
}, applyTextTpl:function(textTpl) {
  if (textTpl && !textTpl.isTemplate) {
    textTpl = new Ext.XTemplate(textTpl);
  }
  return textTpl;
}, applyTextOffset:function(offset) {
  offset = offset || {};
  offset.dx = offset.dx || 0;
  offset.dy = offset.dy || 0;
  return offset;
}, updateTextTpl:function() {
  this.writeText();
  if (!this.isConfiguring) {
    this.centerText();
  }
}, writeText:function(options) {
  var me = this, value = me.getValue(), minValue = me.getMinValue(), maxValue = me.getMaxValue(), delta = maxValue - minValue, textTpl = me.getTextTpl();
  textTpl.overwrite(me.textElement, {value:value, percent:(value - minValue) / delta * 100, minValue:minValue, maxValue:maxValue, delta:delta});
}, centerText:function(cx, cy, sectorRegion, innerRadius, outerRadius) {
  var textElement = this.textElement, textAlign = this.getTextAlign(), alignedRegion, textBox;
  if (Ext.Number.isEqual(innerRadius, 0, 0.1) || sectorRegion.isOutOfBound({x:cx, y:cy})) {
    alignedRegion = textElement.getRegion().alignTo({align:textAlign, target:sectorRegion});
    textElement.setLeft(alignedRegion.left);
    textElement.setTop(alignedRegion.top);
  } else {
    textBox = textElement.getBox();
    textElement.setLeft(cx - textBox.width / 2);
    textElement.setTop(cy - textBox.height / 2);
  }
}, camelCaseRe:/([a-z])([A-Z])/g, camelToHyphen:function(name) {
  return name.replace(this.camelCaseRe, '$1-$2').toLowerCase();
}, applyTrackStyle:function(trackStyle) {
  var me = this, trackGradient;
  trackStyle.innerRadius = me.getRadiusFn(trackStyle.innerRadius);
  trackStyle.outerRadius = me.getRadiusFn(trackStyle.outerRadius);
  if (Ext.isArray(trackStyle.fill)) {
    trackGradient = me.getTrackGradient();
    me.setGradientStops(trackGradient, trackStyle.fill);
    trackStyle.fill = 'url(#' + trackGradient.dom.getAttribute('id') + ')';
  }
  return trackStyle;
}, updateTrackStyle:function(trackStyle) {
  var me = this, trackArc = Ext.fly(me.getTrackArc()), name;
  for (name in trackStyle) {
    if (name in me.pathAttributes) {
      trackArc.setStyle(me.camelToHyphen(name), trackStyle[name]);
    } else {
      trackArc.setStyle(name, trackStyle[name]);
    }
  }
}, applyValueStyle:function(valueStyle) {
  var me = this, valueGradient;
  valueStyle.innerRadius = me.getRadiusFn(valueStyle.innerRadius);
  valueStyle.outerRadius = me.getRadiusFn(valueStyle.outerRadius);
  if (Ext.isArray(valueStyle.fill)) {
    valueGradient = me.getValueGradient();
    me.setGradientStops(valueGradient, valueStyle.fill);
    valueStyle.fill = 'url(#' + valueGradient.dom.getAttribute('id') + ')';
  }
  return valueStyle;
}, updateValueStyle:function(valueStyle) {
  var me = this, valueArc = Ext.fly(me.getValueArc()), name;
  for (name in valueStyle) {
    if (name in me.pathAttributes) {
      valueArc.setStyle(me.camelToHyphen(name), valueStyle[name]);
    } else {
      valueArc.setStyle(name, valueStyle[name]);
    }
  }
}, getRadiusFn:function(radius) {
  var result, pos, ratio, increment = 0;
  if (Ext.isNumber(radius)) {
    result = function() {
      return radius;
    };
  } else {
    if (Ext.isString(radius)) {
      radius = radius.replace(/ /g, '');
      ratio = parseFloat(radius) / 100;
      pos = radius.search('%');
      if (pos < radius.length - 1) {
        increment = parseFloat(radius.substr(pos + 1));
      }
      result = function(radius) {
        return radius * ratio + increment;
      };
      result.ratio = ratio;
    }
  }
  return result;
}, getSvg:function() {
  var me = this, svg = me.svg;
  if (!svg) {
    svg = me.svg = Ext.get(document.createElementNS(me.svgNS, 'svg'));
    me.bodyElement.append(svg);
  }
  return svg;
}, getTrackArc:function() {
  var me = this, trackArc = me.trackArc;
  if (!trackArc) {
    trackArc = me.trackArc = document.createElementNS(me.svgNS, 'path');
    me.getSvg().append(trackArc, true);
    trackArc.setAttribute('class', Ext.baseCSSPrefix + 'gauge-track');
  }
  return trackArc;
}, getValueArc:function() {
  var me = this, valueArc = me.valueArc;
  me.getTrackArc();
  if (!valueArc) {
    valueArc = me.valueArc = document.createElementNS(me.svgNS, 'path');
    me.getSvg().append(valueArc, true);
    valueArc.setAttribute('class', Ext.baseCSSPrefix + 'gauge-value');
  }
  return valueArc;
}, applyNeedle:function(needle, oldNeedle) {
  this.getValueArc();
  return Ext.Factory.gaugeNeedle.update(oldNeedle, needle, this, 'createNeedle', 'needleDefaults');
}, createNeedle:function(config) {
  return Ext.apply({gauge:this}, config);
}, getDefs:function() {
  var me = this, defs = me.defs;
  if (!defs) {
    defs = me.defs = Ext.get(document.createElementNS(me.svgNS, 'defs'));
    me.getSvg().appendChild(defs);
  }
  return defs;
}, setGradientSize:function(gradient, x1, y1, x2, y2) {
  gradient.setAttribute('x1', x1);
  gradient.setAttribute('y1', y1);
  gradient.setAttribute('x2', x2);
  gradient.setAttribute('y2', y2);
}, resizeGradients:function(size) {
  var me = this, trackGradient = me.getTrackGradient(), valueGradient = me.getValueGradient(), x1 = 0, y1 = size.height / 2, x2 = size.width, y2 = size.height / 2;
  me.setGradientSize(trackGradient.dom, x1, y1, x2, y2);
  me.setGradientSize(valueGradient.dom, x1, y1, x2, y2);
}, setGradientStops:function(gradient, stops) {
  var ln = stops.length, i, stopCfg, stopEl;
  while (gradient.firstChild) {
    gradient.removeChild(gradient.firstChild);
  }
  for (i = 0; i < ln; i++) {
    stopCfg = stops[i];
    stopEl = document.createElementNS(this.svgNS, 'stop');
    gradient.appendChild(stopEl);
    stopEl.setAttribute('offset', stopCfg.offset);
    stopEl.setAttribute('stop-color', stopCfg.color);
    'opacity' in stopCfg && stopEl.setAttribute('stop-opacity', stopCfg.opacity);
  }
}, getTrackGradient:function() {
  var me = this, trackGradient = me.trackGradient;
  if (!trackGradient) {
    trackGradient = me.trackGradient = Ext.get(document.createElementNS(me.svgNS, 'linearGradient'));
    trackGradient.dom.setAttribute('gradientUnits', 'userSpaceOnUse');
    me.getDefs().appendChild(trackGradient);
    Ext.get(trackGradient);
  }
  return trackGradient;
}, getValueGradient:function() {
  var me = this, valueGradient = me.valueGradient;
  if (!valueGradient) {
    valueGradient = me.valueGradient = Ext.get(document.createElementNS(me.svgNS, 'linearGradient'));
    valueGradient.dom.setAttribute('gradientUnits', 'userSpaceOnUse');
    me.getDefs().appendChild(valueGradient);
    Ext.get(valueGradient);
  }
  return valueGradient;
}, getArcPoint:function(centerX, centerY, radius, degrees) {
  var radians = degrees / 180 * Math.PI;
  return [centerX + radius * Math.cos(radians), centerY + radius * Math.sin(radians)];
}, isCircle:function(startAngle, endAngle) {
  return Ext.Number.isEqual(Math.abs(endAngle - startAngle), 360, 0.001);
}, getArcPath:function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, round) {
  var me = this, isCircle = me.isCircle(startAngle, endAngle), endAngle = endAngle - 0.01, innerStartPoint = me.getArcPoint(centerX, centerY, innerRadius, startAngle), innerEndPoint = me.getArcPoint(centerX, centerY, innerRadius, endAngle), outerStartPoint = me.getArcPoint(centerX, centerY, outerRadius, startAngle), outerEndPoint = me.getArcPoint(centerX, centerY, outerRadius, endAngle), large = endAngle - startAngle <= 180 ? 0 : 1, path = ['M', innerStartPoint[0], innerStartPoint[1], 'A', innerRadius, 
  innerRadius, 0, large, 1, innerEndPoint[0], innerEndPoint[1]], capRadius = (outerRadius - innerRadius) / 2;
  if (isCircle) {
    path.push('M', outerEndPoint[0], outerEndPoint[1]);
  } else {
    if (round) {
      path.push('A', capRadius, capRadius, 0, 0, 0, outerEndPoint[0], outerEndPoint[1]);
    } else {
      path.push('L', outerEndPoint[0], outerEndPoint[1]);
    }
  }
  path.push('A', outerRadius, outerRadius, 0, large, 0, outerStartPoint[0], outerStartPoint[1]);
  if (round && !isCircle) {
    path.push('A', capRadius, capRadius, 0, 0, 0, innerStartPoint[0], innerStartPoint[1]);
  }
  path.push('Z');
  return path.join(' ');
}, resizeHandler:function(size) {
  var me = this, svg = me.getSvg();
  svg.setSize(size);
  me.resizeGradients(size);
  me.render();
}, createInterpolator:function(rangeCheck) {
  var domainStart = 0, domainDelta = 1, rangeStart = 0, rangeEnd = 1, interpolator = function(x, invert) {
    var t = 0;
    if (domainDelta) {
      t = (x - domainStart) / domainDelta;
      if (rangeCheck) {
        t = Math.max(0, t);
        t = Math.min(1, t);
      }
      if (invert) {
        t = 1 - t;
      }
    }
    return (1 - t) * rangeStart + t * rangeEnd;
  };
  interpolator.setDomain = function(a, b) {
    domainStart = a;
    domainDelta = b - a;
    return this;
  };
  interpolator.setRange = function(a, b) {
    rangeStart = a;
    rangeEnd = b;
    return this;
  };
  interpolator.getDomain = function() {
    return [domainStart, domainStart + domainDelta];
  };
  interpolator.getRange = function() {
    return [rangeStart, rangeEnd];
  };
  return interpolator;
}, applyAnimation:function(animation) {
  if (true === animation) {
    animation = {};
  } else {
    if (false === animation) {
      animation = {duration:0};
    }
  }
  if (!('duration' in animation)) {
    animation.duration = 1000;
  }
  if (!(animation.easing in this.easings)) {
    animation.easing = 'out';
  }
  return animation;
}, updateAnimation:function() {
  this.stopAnimation();
}, animate:function(from, to, duration, easing, fn, scope) {
  var me = this, start = Ext.now(), interpolator = me.createInterpolator().setRange(from, to);
  function frame() {
    var now = Ext.AnimationQueue.frameStartTime, t = Math.min(now - start, duration) / duration, value = interpolator(easing(t));
    if (scope) {
      if (typeof fn === 'string') {
        scope[fn].call(scope, value);
      } else {
        fn.call(scope, value);
      }
    } else {
      fn(value);
    }
    if (t >= 1) {
      Ext.AnimationQueue.stop(frame, scope);
      me.fx = null;
    }
  }
  me.stopAnimation();
  Ext.AnimationQueue.start(frame, scope);
  me.fx = {frame:frame, scope:scope};
}, stopAnimation:function() {
  var me = this;
  if (me.fx) {
    Ext.AnimationQueue.stop(me.fx.frame, me.fx.scope);
    me.fx = null;
  }
}, unitCircleExtrema:{0:[1, 0], 90:[0, 1], 180:[-1, 0], 270:[0, -1], 360:[1, 0], 450:[0, 1], 540:[-1, 0], 630:[0, -1]}, getUnitSectorExtrema:function(startAngle, lengthAngle) {
  var extrema = this.unitCircleExtrema, points = [], angle;
  for (angle in extrema) {
    if (angle > startAngle && angle < startAngle + lengthAngle) {
      points.push(extrema[angle]);
    }
  }
  return points;
}, fitSectorInRect:function(width, height, startAngle, lengthAngle, ratio) {
  if (Ext.Number.isEqual(lengthAngle, 360, 0.001)) {
    return {cx:width / 2, cy:height / 2, radius:Math.min(width, height) / 2, region:new Ext.util.Region(0, width, height, 0)};
  }
  var me = this, points, xx, yy, minX, maxX, minY, maxY, cache = me.fitSectorInRectCache, sameAngles = cache.startAngle === startAngle && cache.lengthAngle === lengthAngle;
  if (sameAngles) {
    minX = cache.minX;
    maxX = cache.maxX;
    minY = cache.minY;
    maxY = cache.maxY;
  } else {
    points = me.getUnitSectorExtrema(startAngle, lengthAngle).concat([me.getArcPoint(0, 0, 1, startAngle), me.getArcPoint(0, 0, ratio, startAngle), me.getArcPoint(0, 0, 1, startAngle + lengthAngle), me.getArcPoint(0, 0, ratio, startAngle + lengthAngle)]);
    xx = points.map(function(point) {
      return point[0];
    });
    yy = points.map(function(point) {
      return point[1];
    });
    minX = Math.min.apply(null, xx);
    maxX = Math.max.apply(null, xx);
    minY = Math.min.apply(null, yy);
    maxY = Math.max.apply(null, yy);
    cache.startAngle = startAngle;
    cache.lengthAngle = lengthAngle;
    cache.minX = minX;
    cache.maxX = maxX;
    cache.minY = minY;
    cache.maxY = maxY;
  }
  var sectorWidth = maxX - minX, sectorHeight = maxY - minY, scaleX = width / sectorWidth, scaleY = height / sectorHeight, scale = Math.min(scaleX, scaleY), sectorRegion = new Ext.util.Region(minY * scale, maxX * scale, maxY * scale, minX * scale), rectRegion = new Ext.util.Region(0, width, height, 0), alignedRegion = sectorRegion.alignTo({align:'c-c', target:rectRegion}), dx = alignedRegion.left - minX * scale, dy = alignedRegion.top - minY * scale;
  return {cx:dx, cy:dy, radius:scale, region:alignedRegion};
}, fitSectorInPaddedRect:function(width, height, padding, startAngle, lengthAngle, ratio) {
  var result = this.fitSectorInRect(width - padding * 2, height - padding * 2, startAngle, lengthAngle, ratio);
  result.cx += padding;
  result.cy += padding;
  result.region.translateBy(padding, padding);
  return result;
}, normalizeAngle:function(angle) {
  return (angle % 360 + 360) % 360;
}, render:function() {
  if (!this.size) {
    return;
  }
  var me = this, textOffset = me.getTextOffset(), trackArc = me.getTrackArc(), valueArc = me.getValueArc(), needle = me.getNeedle(), clockwise = me.getClockwise(), value = me.fxValue, angleOffset = me.fxAngleOffset, trackLength = me.getTrackLength(), width = me.size.width, height = me.size.height, paddingFn = me.getPadding(), padding = paddingFn(Math.min(width, height)), trackStart = me.normalizeAngle(me.getTrackStart() + angleOffset), trackEnd = trackStart + trackLength, valueLength = me.interpolator(value), 
  trackStyle = me.getTrackStyle(), valueStyle = me.getValueStyle(), sector = me.fitSectorInPaddedRect(width, height, padding, trackStart, trackLength, trackStyle.innerRadius.ratio), cx = sector.cx, cy = sector.cy, radius = sector.radius, trackInnerRadius = Math.max(0, trackStyle.innerRadius(radius)), trackOuterRadius = Math.max(0, trackStyle.outerRadius(radius)), valueInnerRadius = Math.max(0, valueStyle.innerRadius(radius)), valueOuterRadius = Math.max(0, valueStyle.outerRadius(radius)), trackPath = 
  me.getArcPath(cx, cy, trackInnerRadius, trackOuterRadius, trackStart, trackEnd, trackStyle.round), valuePath = me.getArcPath(cx, cy, valueInnerRadius, valueOuterRadius, clockwise ? trackStart : trackEnd - valueLength, clockwise ? trackStart + valueLength : trackEnd, valueStyle.round);
  me.centerText(cx + textOffset.dx, cy + textOffset.dy, sector.region, trackInnerRadius, trackOuterRadius);
  trackArc.setAttribute('d', trackPath);
  valueArc.setAttribute('d', valuePath);
  if (needle) {
    needle.setRadius(radius);
    needle.setTransform(cx, cy, -90 + trackStart + valueLength);
  }
  me.fireEvent('render', me);
}});
Ext.define('Ext.ux.gauge.needle.Arrow', {extend:'Ext.ux.gauge.needle.Abstract', alias:'gauge.needle.arrow', config:{path:function(ir, or) {
  return or - ir > 30 ? 'M0,' + (ir + 5) + ' L-4,' + ir + ' L-4,' + (ir + 10) + ' L-1,' + (ir + 15) + ' L-1,' + (or - 7) + ' L-5,' + (or - 10) + ' L0,' + or + ' L5,' + (or - 10) + ' L1,' + (or - 7) + ' L1,' + (ir + 15) + ' L4,' + (ir + 10) + ' L4,' + ir + ' Z' : '';
}}});
Ext.define('Ext.ux.gauge.needle.Diamond', {extend:'Ext.ux.gauge.needle.Abstract', alias:'gauge.needle.diamond', config:{path:function(ir, or) {
  return or - ir > 10 ? 'M0,' + ir + ' L-4,' + (ir + 5) + ' L0,' + or + ' L4,' + (ir + 5) + ' Z' : '';
}}});
Ext.define('Ext.ux.gauge.needle.Rectangle', {extend:'Ext.ux.gauge.needle.Abstract', alias:'gauge.needle.rectangle', config:{path:function(ir, or) {
  return or - ir > 10 ? 'M-2,' + ir + ' L2,' + ir + ' L2,' + or + ' L-2,' + or + ' Z' : '';
}}});
Ext.define('Ext.ux.gauge.needle.Spike', {extend:'Ext.ux.gauge.needle.Abstract', alias:'gauge.needle.spike', config:{path:function(ir, or) {
  return or - ir > 10 ? 'M0,' + (ir + 5) + ' L-4,' + ir + ' L0,' + or + ' L4,' + ir + ' Z' : '';
}}});
Ext.define('Ext.ux.gauge.needle.Wedge', {extend:'Ext.ux.gauge.needle.Abstract', alias:'gauge.needle.wedge', config:{path:function(ir, or) {
  return or - ir > 10 ? 'M-4,' + ir + ' L0,' + or + ' L4,' + ir + ' Z' : '';
}}});
Ext.define('Ext.ux.rating.Picker', {extend:'Ext.Gadget', xtype:'rating', focusable:true, cachedConfig:{family:'monospace', glyphs:'☆★', minimum:1, limit:5, overStyle:null, rounding:1, scale:'125%', selectedStyle:null, tip:null, trackOver:true, value:null, tooltipText:null, trackingValue:null}, config:{animate:null}, element:{cls:'u' + Ext.baseCSSPrefix + 'rating-picker', reference:'element', children:[{reference:'innerEl', cls:'u' + Ext.baseCSSPrefix + 'rating-picker-inner', listeners:{click:'onClick', 
mousemove:'onMouseMove', mouseenter:'onMouseEnter', mouseleave:'onMouseLeave'}, children:[{reference:'valueEl', cls:'u' + Ext.baseCSSPrefix + 'rating-picker-value'}, {reference:'trackerEl', cls:'u' + Ext.baseCSSPrefix + 'rating-picker-tracker'}]}]}, defaultBindProperty:'value', twoWayBindable:'value', overCls:'u' + Ext.baseCSSPrefix + 'rating-picker-over', trackOverCls:'u' + Ext.baseCSSPrefix + 'rating-picker-track-over', applyGlyphs:function(value) {
  if (typeof value === 'string') {
    if (value.length !== 2) {
      Ext.raise('Expected 2 characters for "glyphs" not "' + value + '".');
    }
    value = [value.charAt(0), value.charAt(1)];
  } else {
    if (typeof value[0] === 'number') {
      value = [String.fromCharCode(value[0]), String.fromCharCode(value[1])];
    }
  }
  return value;
}, applyOverStyle:function(style) {
  this.trackerEl.applyStyles(style);
}, applySelectedStyle:function(style) {
  this.valueEl.applyStyles(style);
}, applyTip:function(tip) {
  if (tip && typeof tip !== 'function') {
    if (!tip.isTemplate) {
      tip = new Ext.XTemplate(tip);
    }
    tip = tip.apply.bind(tip);
  }
  return tip;
}, applyTrackingValue:function(value) {
  return this.applyValue(value);
}, applyValue:function(v) {
  var rounding, limit, min;
  if (v !== null) {
    rounding = this.getRounding();
    limit = this.getLimit();
    min = this.getMinimum();
    v = Math.round(Math.round(v / rounding) * rounding * 1000) / 1000;
    v = v < min ? min : v > limit ? limit : v;
  }
  return v;
}, onClick:function(event) {
  var value = this.valueFromEvent(event);
  this.setValue(value);
}, onMouseEnter:function() {
  this.element.addCls(this.overCls);
}, onMouseLeave:function() {
  this.element.removeCls(this.overCls);
}, onMouseMove:function(event) {
  var value = this.valueFromEvent(event);
  this.setTrackingValue(value);
}, updateFamily:function(family) {
  this.element.setStyle('fontFamily', "'" + family + "'");
}, updateGlyphs:function() {
  this.refreshGlyphs();
}, updateLimit:function() {
  this.refreshGlyphs();
}, updateScale:function(size) {
  this.element.setStyle('fontSize', size);
}, updateTip:function() {
  this.refreshTip();
}, updateTooltipText:function(text) {
  this.setTooltip(text);
}, updateTrackingValue:function(value) {
  var me = this, trackerEl = me.trackerEl, newWidth = me.valueToPercent(value);
  trackerEl.setStyle('width', newWidth);
  me.refreshTip();
}, updateTrackOver:function(trackOver) {
  this.element.toggleCls(this.trackOverCls, trackOver);
}, updateValue:function(value, oldValue) {
  var me = this, animate = me.getAnimate(), valueEl = me.valueEl, newWidth = me.valueToPercent(value), column, record;
  if (me.isConfiguring || !animate) {
    valueEl.setStyle('width', newWidth);
  } else {
    valueEl.stopAnimation();
    valueEl.animate(Ext.merge({from:{width:me.valueToPercent(oldValue)}, to:{width:newWidth}}, animate));
  }
  me.refreshTip();
  if (!me.isConfiguring) {
    if (me.hasListeners.change) {
      me.fireEvent('change', me, value, oldValue);
    }
    column = me.getWidgetColumn && me.getWidgetColumn();
    record = column && me.getWidgetRecord && me.getWidgetRecord();
    if (record && column.dataIndex) {
      record.set(column.dataIndex, value);
    }
  }
}, afterCachedConfig:function() {
  this.refresh();
  return this.callParent(arguments);
}, initConfig:function(instanceConfig) {
  this.isConfiguring = true;
  this.callParent([instanceConfig]);
  this.refresh();
}, setConfig:function() {
  var me = this;
  me.isReconfiguring = true;
  me.callParent(arguments);
  me.isReconfiguring = false;
  me.refresh();
  return me;
}, privates:{getGlyphTextNode:function(dom) {
  var node = dom.lastChild;
  if (!node || node.nodeType !== 3) {
    node = dom.ownerDocument.createTextNode('');
    dom.appendChild(node);
  }
  return node;
}, getTooltipData:function() {
  var me = this;
  return {component:me, tracking:me.getTrackingValue(), trackOver:me.getTrackOver(), value:me.getValue()};
}, refresh:function() {
  var me = this;
  if (me.invalidGlyphs) {
    me.refreshGlyphs(true);
  }
  if (me.invalidTip) {
    me.refreshTip(true);
  }
}, refreshGlyphs:function(now) {
  var me = this, later = !now && (me.isConfiguring || me.isReconfiguring), el, glyphs, limit, on, off, trackerEl, valueEl;
  if (!later) {
    el = me.getGlyphTextNode(me.innerEl.dom);
    valueEl = me.getGlyphTextNode(me.valueEl.dom);
    trackerEl = me.getGlyphTextNode(me.trackerEl.dom);
    glyphs = me.getGlyphs();
    limit = me.getLimit();
    for (on = off = ''; limit--;) {
      off += glyphs[0];
      on += glyphs[1];
    }
    el.nodeValue = off;
    valueEl.nodeValue = on;
    trackerEl.nodeValue = on;
  }
  me.invalidGlyphs = later;
}, refreshTip:function(now) {
  var me = this, later = !now && (me.isConfiguring || me.isReconfiguring), data, text, tooltip;
  if (!later) {
    tooltip = me.getTip();
    if (tooltip) {
      data = me.getTooltipData();
      text = tooltip(data);
      me.setTooltipText(text);
    }
  }
  me.invalidTip = later;
}, valueFromEvent:function(event) {
  var me = this, el = me.innerEl, ex = event.getX(), rounding = me.getRounding(), cx = el.getX(), x = ex - cx, w = el.getWidth(), limit = me.getLimit(), v;
  if (me.getInherited().rtl) {
    x = w - x;
  }
  v = x / w * limit;
  v = Math.ceil(v / rounding) * rounding;
  return v;
}, valueToPercent:function(value) {
  value = value / this.getLimit() * 100;
  return value + '%';
}}});
Ext.define('Ext.ux.colorpick.Selection', {mixinId:'colorselection', config:{format:'hex6', value:'FF0000', color:null, previousColor:null, alphaDecimalFormat:'#.##'}, applyColor:function(color) {
  var c = color;
  if (Ext.isString(c)) {
    c = Ext.ux.colorpick.ColorUtils.parseColor(color, this.getAlphaDecimalFormat());
  }
  return c;
}, applyValue:function(color) {
  var c = Ext.ux.colorpick.ColorUtils.parseColor(color || '#000000', this.getAlphaDecimalFormat());
  return this.formatColor(c);
}, formatColor:function(color) {
  return Ext.ux.colorpick.ColorUtils.formats[this.getFormat()](color);
}, updateColor:function(color) {
  var me = this;
  if (!me.syncing) {
    me.syncing = true;
    me.setValue(me.formatColor(color));
    me.syncing = false;
  }
}, updateValue:function(value, oldValue) {
  var me = this;
  if (!me.syncing) {
    me.syncing = true;
    me.setColor(value);
    me.syncing = false;
  }
  this.fireEvent('change', me, value, oldValue);
}});
Ext.define('Ext.ux.colorpick.ColorUtils', function(ColorUtils) {
  return {singleton:true, constructor:function() {
    ColorUtils = this;
  }, backgroundTpl:'background: {rgba};', setBackground:function(el, color) {
    var tpl, data, bgStyle;
    if (el) {
      tpl = Ext.XTemplate.getTpl(ColorUtils, 'backgroundTpl');
      data = {rgba:ColorUtils.getRGBAString(color)};
      bgStyle = tpl.apply(data);
      el.applyStyles(bgStyle);
    }
  }, formats:{HEX6:function(colorO) {
    return ColorUtils.rgb2hex(colorO && colorO.r, colorO && colorO.g, colorO && colorO.b);
  }, HEX8:function(colorO) {
    var hex = ColorUtils.rgb2hex(colorO.r, colorO.g, colorO.b), opacityHex = Math.round(colorO.a * 255).toString(16);
    if (opacityHex.length < 2) {
      hex += '0';
    }
    hex += opacityHex.toUpperCase();
    return hex;
  }, rgb:function(color) {
    return ColorUtils.getRGBString(color);
  }, rgba:function(color) {
    return ColorUtils.getRGBAString(color);
  }}, hexRe:/^#?([0-9a-f]{3,8})/i, rgbaAltRe:/rgba\(\s*([\w#\d]+)\s*,\s*([\d\.]+)\s*\)/, rgbaRe:/rgba\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*\)/, rgbRe:/rgb\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*\)/, parseColor:function(color, alphaFormat) {
    var me = this, rgb, match, ret, hsv;
    if (!color) {
      return null;
    }
    rgb = me.colorMap[color];
    if (rgb) {
      ret = {r:rgb[0], g:rgb[1], b:rgb[2], a:1};
    } else {
      if (color === 'transparent') {
        ret = {r:0, g:0, b:0, a:0};
      } else {
        match = me.hexRe.exec(color);
        if (match) {
          match = match[1];
          switch(match.length) {
            default:
              return null;
            case 3:
              ret = {r:parseInt(match[0] + match[0], 16), g:parseInt(match[1] + match[1], 16), b:parseInt(match[2] + match[2], 16), a:1};
              break;
            case 6:
            case 8:
              ret = {r:parseInt(match.substr(0, 2), 16), g:parseInt(match.substr(2, 2), 16), b:parseInt(match.substr(4, 2), 16), a:parseInt(match.substr(6, 2) || 'ff', 16) / 255};
              break;
          }
        } else {
          match = me.rgbaRe.exec(color);
          if (match) {
            ret = {r:parseFloat(match[1]), g:parseFloat(match[2]), b:parseFloat(match[3]), a:parseFloat(match[4])};
          } else {
            match = me.rgbaAltRe.exec(color);
            if (match) {
              ret = me.parseColor(match[1]);
              ret.a = parseFloat(match[2]);
              return ret;
            }
            match = me.rgbRe.exec(color);
            if (match) {
              ret = {r:parseFloat(match[1]), g:parseFloat(match[2]), b:parseFloat(match[3]), a:1};
            } else {
              return null;
            }
          }
        }
      }
    }
    if (alphaFormat) {
      ret.a = Ext.util.Format.number(ret.a, alphaFormat);
    }
    hsv = this.rgb2hsv(ret.r, ret.g, ret.b);
    return Ext.apply(ret, hsv);
  }, isValid:function(color) {
    return ColorUtils.parseColor(color) !== null;
  }, getRGBAString:function(rgba) {
    rgba = rgba === null ? {r:0, g:0, b:0, h:1, s:1, v:1, a:'1'} : rgba;
    return 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
  }, getRGBString:function(rgb) {
    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
  }, hsv2rgb:function(h, s, v) {
    var c, hprime, x, rgb, m;
    h = h > 1 ? 1 : h;
    s = s > 1 ? 1 : s;
    v = v > 1 ? 1 : v;
    h = h === undefined ? 1 : h;
    h = h * 360;
    if (h === 360) {
      h = 0;
    }
    c = v * s;
    hprime = h / 60;
    x = c * (1 - Math.abs(hprime % 2 - 1));
    rgb = [0, 0, 0];
    switch(Math.floor(hprime)) {
      case 0:
        rgb = [c, x, 0];
        break;
      case 1:
        rgb = [x, c, 0];
        break;
      case 2:
        rgb = [0, c, x];
        break;
      case 3:
        rgb = [0, x, c];
        break;
      case 4:
        rgb = [x, 0, c];
        break;
      case 5:
        rgb = [c, 0, x];
        break;
      default:
        console.error('unknown color ' + h + ' ' + s + ' ' + v);
        break;
    }
    m = v - c;
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;
    rgb[0] = Math.round(rgb[0] * 255);
    rgb[1] = Math.round(rgb[1] * 255);
    rgb[2] = Math.round(rgb[2] * 255);
    return {r:rgb[0], g:rgb[1], b:rgb[2]};
  }, rgb2hsv:function(r, g, b) {
    var M, m, c, hprime, h, v, s;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    M = Math.max(r, g, b);
    m = Math.min(r, g, b);
    c = M - m;
    hprime = 0;
    if (c !== 0) {
      if (M === r) {
        hprime = (g - b) / c % 6;
      } else {
        if (M === g) {
          hprime = (b - r) / c + 2;
        } else {
          if (M === b) {
            hprime = (r - g) / c + 4;
          }
        }
      }
    }
    h = hprime * 60;
    if (h === 360) {
      h = 0;
    }
    v = M;
    s = 0;
    if (c !== 0) {
      s = c / v;
    }
    h = h / 360;
    if (h < 0) {
      h = h + 1;
    }
    return {h:h, s:s, v:v};
  }, rgb2hex:function(r, g, b) {
    r = r === null ? r : r.toString(16);
    g = g === null ? g : g.toString(16);
    b = b === null ? b : b.toString(16);
    if (r === null || r.length < 2) {
      r = '0' + r || '0';
    }
    if (g === null || g.length < 2) {
      g = '0' + g || '0';
    }
    if (b === null || b.length < 2) {
      b = '0' + b || '0';
    }
    if (r === null || r.length > 2) {
      r = 'ff';
    }
    if (g === null || g.length > 2) {
      g = 'ff';
    }
    if (b === null || b.length > 2) {
      b = 'ff';
    }
    return (r + g + b).toUpperCase();
  }, colorMap:{aliceblue:[240, 248, 255], antiquewhite:[250, 235, 215], aqua:[0, 255, 255], aquamarine:[127, 255, 212], azure:[240, 255, 255], beige:[245, 245, 220], bisque:[255, 228, 196], black:[0, 0, 0], blanchedalmond:[255, 235, 205], blue:[0, 0, 255], blueviolet:[138, 43, 226], brown:[165, 42, 42], burlywood:[222, 184, 135], cadetblue:[95, 158, 160], chartreuse:[127, 255, 0], chocolate:[210, 105, 30], coral:[255, 127, 80], cornflowerblue:[100, 149, 237], cornsilk:[255, 248, 220], crimson:[220, 
  20, 60], cyan:[0, 255, 255], darkblue:[0, 0, 139], darkcyan:[0, 139, 139], darkgoldenrod:[184, 132, 11], darkgray:[169, 169, 169], darkgreen:[0, 100, 0], darkgrey:[169, 169, 169], darkkhaki:[189, 183, 107], darkmagenta:[139, 0, 139], darkolivegreen:[85, 107, 47], darkorange:[255, 140, 0], darkorchid:[153, 50, 204], darkred:[139, 0, 0], darksalmon:[233, 150, 122], darkseagreen:[143, 188, 143], darkslateblue:[72, 61, 139], darkslategray:[47, 79, 79], darkslategrey:[47, 79, 79], darkturquoise:[0, 
  206, 209], darkviolet:[148, 0, 211], deeppink:[255, 20, 147], deepskyblue:[0, 191, 255], dimgray:[105, 105, 105], dimgrey:[105, 105, 105], dodgerblue:[30, 144, 255], firebrick:[178, 34, 34], floralwhite:[255, 255, 240], forestgreen:[34, 139, 34], fuchsia:[255, 0, 255], gainsboro:[220, 220, 220], ghostwhite:[248, 248, 255], gold:[255, 215, 0], goldenrod:[218, 165, 32], gray:[128, 128, 128], green:[0, 128, 0], greenyellow:[173, 255, 47], grey:[128, 128, 128], honeydew:[240, 255, 240], hotpink:[255, 
  105, 180], indianred:[205, 92, 92], indigo:[75, 0, 130], ivory:[255, 255, 240], khaki:[240, 230, 140], lavender:[230, 230, 250], lavenderblush:[255, 240, 245], lawngreen:[124, 252, 0], lemonchiffon:[255, 250, 205], lightblue:[173, 216, 230], lightcoral:[240, 128, 128], lightcyan:[224, 255, 255], lightgoldenrodyellow:[250, 250, 210], lightgray:[211, 211, 211], lightgreen:[144, 238, 144], lightgrey:[211, 211, 211], lightpink:[255, 182, 193], lightsalmon:[255, 160, 122], lightseagreen:[32, 178, 170], 
  lightskyblue:[135, 206, 250], lightslategray:[119, 136, 153], lightslategrey:[119, 136, 153], lightsteelblue:[176, 196, 222], lightyellow:[255, 255, 224], lime:[0, 255, 0], limegreen:[50, 205, 50], linen:[250, 240, 230], magenta:[255, 0, 255], maroon:[128, 0, 0], mediumaquamarine:[102, 205, 170], mediumblue:[0, 0, 205], mediumorchid:[186, 85, 211], mediumpurple:[147, 112, 219], mediumseagreen:[60, 179, 113], mediumslateblue:[123, 104, 238], mediumspringgreen:[0, 250, 154], mediumturquoise:[72, 
  209, 204], mediumvioletred:[199, 21, 133], midnightblue:[25, 25, 112], mintcream:[245, 255, 250], mistyrose:[255, 228, 225], moccasin:[255, 228, 181], navajowhite:[255, 222, 173], navy:[0, 0, 128], oldlace:[253, 245, 230], olive:[128, 128, 0], olivedrab:[107, 142, 35], orange:[255, 165, 0], orangered:[255, 69, 0], orchid:[218, 112, 214], palegoldenrod:[238, 232, 170], palegreen:[152, 251, 152], paleturquoise:[175, 238, 238], palevioletred:[219, 112, 147], papayawhip:[255, 239, 213], peachpuff:[255, 
  218, 185], peru:[205, 133, 63], pink:[255, 192, 203], plum:[221, 160, 203], powderblue:[176, 224, 230], purple:[128, 0, 128], red:[255, 0, 0], rosybrown:[188, 143, 143], royalblue:[65, 105, 225], saddlebrown:[139, 69, 19], salmon:[250, 128, 114], sandybrown:[244, 164, 96], seagreen:[46, 139, 87], seashell:[255, 245, 238], sienna:[160, 82, 45], silver:[192, 192, 192], skyblue:[135, 206, 235], slateblue:[106, 90, 205], slategray:[119, 128, 144], slategrey:[119, 128, 144], snow:[255, 255, 250], springgreen:[0, 
  255, 127], steelblue:[70, 130, 180], tan:[210, 180, 140], teal:[0, 128, 128], thistle:[216, 191, 216], tomato:[255, 99, 71], turquoise:[64, 224, 208], violet:[238, 130, 238], wheat:[245, 222, 179], white:[255, 255, 255], whitesmoke:[245, 245, 245], yellow:[255, 255, 0], yellowgreen:[154, 205, 5]}};
}, function(ColorUtils) {
  var formats = ColorUtils.formats, lowerized = {};
  formats['#HEX6'] = function(color) {
    return '#' + formats.HEX6(color);
  };
  formats['#HEX8'] = function(color) {
    return '#' + formats.HEX8(color);
  };
  Ext.Object.each(formats, function(name, fn) {
    lowerized[name.toLowerCase()] = function(color) {
      var ret = fn(color);
      return ret.toLowerCase();
    };
  });
  Ext.apply(formats, lowerized);
});
Ext.define('Ext.ux.colorpick.ColorMapController', {extend:'Ext.app.ViewController', alias:'controller.colorpickercolormapcontroller', requires:['Ext.ux.colorpick.ColorUtils'], init:function() {
  var me = this, colorMap = me.getView();
  me.mon(colorMap.bodyElement, {mousedown:me.onMouseDown, mouseup:me.onMouseUp, mousemove:me.onMouseMove, scope:me});
}, onHandleDrag:function(componentDragger, e) {
  var me = this, container = me.getView(), dragHandle = container.down('#dragHandle').element, x = dragHandle.getX() - container.element.getX(), y = dragHandle.getY() - container.element.getY(), containerEl = container.bodyElement, containerWidth = containerEl.getWidth(), containerHeight = containerEl.getHeight(), xRatio = x / containerWidth, yRatio = y / containerHeight;
  if (xRatio > 0.99) {
    xRatio = 1;
  }
  if (yRatio > 0.99) {
    yRatio = 1;
  }
  if (xRatio < 0) {
    xRatio = 0;
  }
  if (yRatio < 0) {
    yRatio = 0;
  }
  container.fireEvent('handledrag', xRatio, yRatio);
}, onMouseDown:function(e) {
  var me = this;
  me.onMapClick(e);
  me.onHandleDrag();
  me.isDragging = true;
}, onMouseUp:function(e) {
  var me = this;
  me.onMapClick(e);
  me.onHandleDrag();
  me.isDragging = false;
}, onMouseMove:function(e) {
  var me = this;
  if (me.isDragging) {
    me.onMapClick(e);
    me.onHandleDrag();
  }
}, onMapClick:function(e) {
  var me = this, container = me.getView(), dragHandle = container.down('#dragHandle'), cXY = container.element.getXY(), eXY = e.getXY(), left, top;
  left = eXY[0] - cXY[0];
  top = eXY[1] - cXY[1];
  dragHandle.element.setStyle({left:left + 'px', top:top + 'px'});
  e.preventDefault();
  me.onHandleDrag();
}, onColorBindingChanged:function(selectedColor) {
  var me = this, vm = me.getViewModel(), rgba = vm.get('selectedColor'), hsv, container = me.getView(), dragHandle = container.down('#dragHandle'), containerEl = container.bodyElement, containerWidth = containerEl.getWidth(), containerHeight = containerEl.getHeight(), xRatio, yRatio, left, top;
  rgba = rgba === null ? {r:0, g:0, b:0, h:1, s:1, v:1, a:'1'} : rgba;
  hsv = Ext.ux.colorpick.ColorUtils.rgb2hsv(rgba.r, rgba.g, rgba.b);
  xRatio = hsv.s;
  left = containerWidth * xRatio;
  yRatio = 1 - hsv.v;
  top = containerHeight * yRatio;
  dragHandle.element.setStyle({left:left + 'px', top:top + 'px'});
}, onHueBindingChanged:function(hue) {
  var me = this, fullColorRGB, hex;
  fullColorRGB = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
  hex = Ext.ux.colorpick.ColorUtils.rgb2hex(fullColorRGB.r, fullColorRGB.g, fullColorRGB.b);
  me.getView().element.applyStyles({'background-color':'#' + hex});
}});
Ext.define('Ext.ux.colorpick.ColorMap', {extend:'Ext.container.Container', alias:'widget.colorpickercolormap', controller:'colorpickercolormapcontroller', requires:['Ext.ux.colorpick.ColorMapController'], cls:Ext.baseCSSPrefix + 'colorpicker-colormap', items:[{xtype:'component', cls:Ext.baseCSSPrefix + 'colorpicker-colormap-draghandle-container', itemId:'dragHandle', width:1, height:1, style:{position:'relative'}, html:'\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'colorpicker-colormap-draghandle"\x3e\x3c/div\x3e'}], 
listeners:{colorbindingchanged:{fn:'onColorBindingChanged', scope:'controller'}, huebindingchanged:{fn:'onHueBindingChanged', scope:'controller'}}, afterRender:function() {
  var me = this, src = me.mapGradientUrl, el = me.el;
  me.callParent();
  if (!src) {
    src = el.getStyle('background-image');
    src = src.substring(4, src.length - 1);
    if (src.indexOf('"') === 0) {
      src = src.substring(1, src.length - 1);
    }
    Ext.ux.colorpick.ColorMap.prototype.mapGradientUrl = src;
  }
  el.setStyle('background-image', 'none');
  el = me.bodyElement;
  el.createChild({tag:'img', cls:Ext.baseCSSPrefix + 'colorpicker-colormap-blender', src:src});
}, setPosition:function(data) {
  var me = this, dragHandle = me.down('#dragHandle');
  if (dragHandle.isDragging) {
    return;
  }
  this.fireEvent('colorbindingchanged', data);
}, setHue:function(hue) {
  var me = this;
  me.fireEvent('huebindingchanged', hue);
}});
Ext.define('Ext.ux.colorpick.SelectorModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.colorpick-selectormodel', requires:['Ext.ux.colorpick.ColorUtils'], data:{selectedColor:{r:255, g:255, b:255, h:0, s:1, v:1, a:1}, previousColor:{r:0, g:0, b:0, h:0, s:1, v:1, a:1}}, formulas:{hex:{get:function(get) {
  var r = get('selectedColor.r') === null ? get('selectedColor.r') : get('selectedColor.r').toString(16), g = get('selectedColor.g') === null ? get('selectedColor.g') : get('selectedColor.g').toString(16), b = get('selectedColor.b') === null ? get('selectedColor.b') : get('selectedColor.b').toString(16), result;
  result = Ext.ux.colorpick.ColorUtils.rgb2hex(r, g, b);
  return '#' + result;
}, set:function(hex) {
  var rgb;
  if (!Ext.isEmpty(hex)) {
    rgb = Ext.ux.colorpick.ColorUtils.parseColor(hex);
    this.changeRGB(rgb);
  }
}}, red:{get:function(get) {
  return get('selectedColor.r');
}, set:function(r) {
  this.changeRGB({r:r});
}}, green:{get:function(get) {
  return get('selectedColor.g');
}, set:function(g) {
  this.changeRGB({g:g});
}}, blue:{get:function(get) {
  return get('selectedColor.b');
}, set:function(b) {
  this.changeRGB({b:b});
}}, hue:{get:function(get) {
  return get('selectedColor.h') * 360;
}, set:function(hue) {
  this.changeHSV({h:hue && hue / 360});
}}, saturation:{get:function(get) {
  return get('selectedColor.s') * 100;
}, set:function(saturation) {
  this.changeHSV({s:saturation && saturation / 100});
}}, value:{get:function(get) {
  var v = get('selectedColor.v');
  return v * 100;
}, set:function(value) {
  this.changeHSV({v:value && value / 100});
}}, alpha:{get:function(data) {
  var a = data('selectedColor.a');
  return a * 100;
}, set:function(alpha) {
  if (alpha !== null) {
    this.set('selectedColor', Ext.applyIf({a:alpha / 100}, this.data.selectedColor));
  }
}}}, changeHSV:function(hsv) {
  var rgb;
  if (hsv.h !== null && hsv.s !== null && hsv.v !== null) {
    Ext.applyIf(hsv, this.data.selectedColor);
    rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hsv.h, hsv.s, hsv.v);
    hsv.r = rgb.r;
    hsv.g = rgb.g;
    hsv.b = rgb.b;
    this.set('selectedColor', hsv);
  }
}, changeRGB:function(rgb) {
  var hsv;
  Ext.applyIf(rgb, this.data.selectedColor);
  if (rgb) {
    if (rgb.r !== null && rgb.g !== null && rgb.b !== null) {
      hsv = Ext.ux.colorpick.ColorUtils.rgb2hsv(rgb.r, rgb.g, rgb.b);
      rgb.h = hsv.h;
      rgb.s = hsv.s;
      rgb.v = hsv.v;
      this.set('selectedColor', rgb);
    }
  }
}});
Ext.define('Ext.ux.colorpick.SelectorController', {extend:'Ext.app.ViewController', alias:'controller.colorpick-selectorcontroller', requires:['Ext.ux.colorpick.ColorUtils'], destroy:function() {
  var me = this, view = me.getView(), childViewModel = view.childViewModel;
  if (childViewModel) {
    childViewModel.destroy();
    view.childViewModel = null;
  }
  me.callParent();
}, changeHSV:function(hsv) {
  var view = this.getView(), color = view.getColor(), rgb;
  Ext.applyIf(hsv, color);
  rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hsv.h, hsv.s, hsv.v);
  Ext.apply(hsv, rgb);
  view.setColor(hsv);
}, onColorMapHandleDrag:function(xPercent, yPercent) {
  this.changeHSV({s:xPercent, v:1 - yPercent});
}, onValueSliderHandleDrag:function(yPercent) {
  this.changeHSV({v:1 - yPercent});
}, onSaturationSliderHandleDrag:function(yPercent) {
  this.changeHSV({s:1 - yPercent});
}, onHueSliderHandleDrag:function(yPercent) {
  this.changeHSV({h:1 - yPercent});
}, onAlphaSliderHandleDrag:function(yPercent) {
  var view = this.getView(), color = view.getColor(), newColor = Ext.applyIf({a:1 - yPercent}, color);
  view.setColor(newColor);
  view.el.repaint();
}, onPreviousColorSelected:function(comp, color) {
  var view = this.getView();
  view.setColor(color);
}, onOK:function() {
  var me = this, view = me.getView();
  view.fireEvent('ok', view, view.getValue());
}, onCancel:function() {
  this.fireViewEvent('cancel', this.getView());
}, onResize:function() {
  var me = this, view = me.getView(), vm = view.childViewModel, refs = me.getReferences(), h, s, v, a;
  h = vm.get('hue');
  s = vm.get('saturation');
  v = vm.get('value');
  a = vm.get('alpha');
  refs.colorMap.setPosition(vm.getData());
  refs.hueSlider.setHue(h);
  refs.satSlider.setSaturation(s);
  refs.valueSlider.setValue(v);
  refs.alphaSlider.setAlpha(a);
}});
Ext.define('Ext.ux.colorpick.ColorPreview', {extend:'Ext.Component', alias:'widget.colorpickercolorpreview', requires:['Ext.util.Format'], cls:Ext.baseCSSPrefix + 'colorpreview', getTemplate:function() {
  return [{reference:'filterElement', cls:Ext.baseCSSPrefix + 'colorpreview-filter-el'}, {reference:'btnElement', cls:Ext.baseCSSPrefix + 'colorpreview-btn-el', tag:'a'}];
}, onRender:function() {
  var me = this;
  me.callParent(arguments);
  me.mon(me.btnElement, 'click', me.onClick, me);
}, onClick:function(e) {
  e.preventDefault();
  this.fireEvent('click', this, this.color);
}, setColor:function(color) {
  this.color = color;
  this.applyBgStyle(color);
}, applyBgStyle:function(color) {
  var me = this, colorUtils = Ext.ux.colorpick.ColorUtils, el = me.filterElement, rgba;
  rgba = colorUtils.getRGBAString(color);
  el.applyStyles({background:rgba});
}});
Ext.define('Ext.ux.colorpick.SliderController', {extend:'Ext.app.ViewController', alias:'controller.colorpick-slidercontroller', getDragHandle:function() {
  return this.view.lookupReference('dragHandle');
}, getDragContainer:function() {
  return this.view.lookupReference('dragHandleContainer');
}, onHandleDrag:function(e) {
  var me = this, view = me.getView(), container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.bodyElement, top = containerEl.getY(), y = e.getY() - containerEl.getY(), containerHeight = containerEl.getHeight(), yRatio = y / containerHeight;
  if (y >= 0 && y < containerHeight) {
    dragHandle.element.setY(y + top);
  } else {
    return;
  }
  if (yRatio > 0.99) {
    yRatio = 1;
  }
  e.preventDefault();
  view.fireEvent('handledrag', yRatio);
  dragHandle.el.repaint();
}, onMouseDown:function(e) {
  var me = this, dragHandle = me.getDragHandle();
  dragHandle.isDragging = true;
  me.onHandleDrag(e);
}, onMouseMove:function(e) {
  var me = this, dragHandle = me.getDragHandle();
  if (dragHandle.isDragging) {
    me.onHandleDrag(e);
  }
}, onMouseUp:function(e) {
  var me = this, dragHandle = me.getDragHandle();
  if (dragHandle.isDragging) {
    me.onHandleDrag(e);
  }
  dragHandle.isDragging = false;
}});
Ext.define('Ext.ux.colorpick.Slider', {extend:'Ext.container.Container', xtype:'colorpickerslider', controller:'colorpick-slidercontroller', afterRender:function() {
  var width, dragCt, dragWidth;
  this.callParent(arguments);
  width = this.getWidth();
  dragCt = this.lookupReference('dragHandleContainer');
  dragWidth = dragCt.getWidth();
  dragCt.el.setStyle('left', (width - dragWidth) / 4 + 'px');
}, baseCls:Ext.baseCSSPrefix + 'colorpicker-slider', requires:['Ext.ux.colorpick.SliderController'], referenceHolder:true, listeners:{element:'element', touchstart:'onMouseDown', touchend:'onMouseUp', touchmove:'onMouseMove'}, autoSize:false, items:{xtype:'container', cls:Ext.baseCSSPrefix + 'colorpicker-draghandle-container', reference:'dragHandleContainer', height:'100%', items:{xtype:'component', cls:Ext.baseCSSPrefix + 'colorpicker-draghandle-outer', style:{position:'relative'}, reference:'dragHandle', 
width:'100%', height:1, html:'\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'colorpicker-draghandle"\x3e\x3c/div\x3e'}}, setHue:function() {
  Ext.raise('Must implement setHue() in a child class!');
}, getDragHandle:function() {
  return this.lookupReference('dragHandle');
}, getDragContainer:function() {
  return this.lookupReference('dragHandleContainer');
}});
Ext.define('Ext.ux.colorpick.SliderAlpha', {extend:'Ext.ux.colorpick.Slider', alias:'widget.colorpickerslideralpha', cls:Ext.baseCSSPrefix + 'colorpicker-alpha', requires:['Ext.XTemplate'], gradientStyleTpl:Ext.create('Ext.XTemplate', 'background: -moz-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + 'background: -webkit-linear-gradient(top,rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + 'background: -o-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + 
'background: -ms-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + 'background: linear-gradient(to bottom, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);'), setAlpha:function(value) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.bodyElement, containerHeight = containerEl.getHeight(), el, top;
  value = Math.max(value, 0);
  value = Math.min(value, 100);
  if (dragHandle.isDragging) {
    return;
  }
  top = containerHeight * (1 - value / 100);
  el = dragHandle.element;
  el.setStyle({top:top + 'px'});
}, setColor:function(color) {
  var me = this, container = me.getDragContainer(), hex, el;
  color = color === null ? {r:0, g:0, b:0, h:1, s:1, v:1, a:'1'} : color;
  hex = Ext.ux.colorpick.ColorUtils.rgb2hex(color.r, color.g, color.b);
  el = container.bodyElement;
  el.applyStyles(me.gradientStyleTpl.apply({hex:hex, r:color.r, g:color.g, b:color.b}));
}});
Ext.define('Ext.ux.colorpick.SliderSaturation', {extend:'Ext.ux.colorpick.Slider', alias:'widget.colorpickerslidersaturation', cls:Ext.baseCSSPrefix + 'colorpicker-saturation', gradientStyleTpl:Ext.create('Ext.XTemplate', 'background: -mox-linear-gradient(top,#{hex} 0%, #ffffff 100%);' + 'background: -webkit-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + 'background: -o-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + 'background: -ms-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + 'background: linear-gradient(to bottom, #{hex} 0%,#ffffff 100%);'), 
setSaturation:function(saturation) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.bodyElement, containerHeight = containerEl.getHeight(), yRatio, top;
  saturation = Math.max(saturation, 0);
  saturation = Math.min(saturation, 100);
  if (dragHandle.isDragging) {
    return;
  }
  yRatio = 1 - saturation / 100;
  top = containerHeight * yRatio;
  dragHandle.element.setStyle({top:top + 'px'});
}, setHue:function(hue) {
  var me = this, container = me.getDragContainer(), rgb, hex;
  rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
  hex = Ext.ux.colorpick.ColorUtils.rgb2hex(rgb.r, rgb.g, rgb.b);
  container.element.applyStyles(me.gradientStyleTpl.apply({hex:hex}));
}});
Ext.define('Ext.ux.colorpick.SliderValue', {extend:'Ext.ux.colorpick.Slider', alias:'widget.colorpickerslidervalue', cls:Ext.baseCSSPrefix + 'colorpicker-value', requires:['Ext.XTemplate'], gradientStyleTpl:Ext.create('Ext.XTemplate', 'background: -mox-linear-gradient(top, #{hex} 0%, #000000 100%);' + 'background: -webkit-linear-gradient(top, #{hex} 0%,#000000 100%);' + 'background: -o-linear-gradient(top, #{hex} 0%,#000000 100%);' + 'background: -ms-linear-gradient(top, #{hex} 0%,#000000 100%);' + 
'background: linear-gradient(to bottom, #{hex} 0%,#000000 100%);'), setValue:function(value) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.bodyElement, containerHeight = containerEl.getHeight(), yRatio, top;
  value = Math.max(value, 0);
  value = Math.min(value, 100);
  if (dragHandle.isDragging) {
    return;
  }
  yRatio = 1 - value / 100;
  top = containerHeight * yRatio;
  dragHandle.element.setStyle({top:top + 'px'});
}, setHue:function(hue) {
  var me = this, container = me.getDragContainer(), rgb, hex;
  if (!me.element) {
    return;
  }
  rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
  hex = Ext.ux.colorpick.ColorUtils.rgb2hex(rgb.r, rgb.g, rgb.b);
  container.bodyElement.applyStyles(me.gradientStyleTpl.apply({hex:hex}));
}});
Ext.define('Ext.ux.colorpick.SliderHue', {extend:'Ext.ux.colorpick.Slider', alias:'widget.colorpickersliderhue', cls:Ext.baseCSSPrefix + 'colorpicker-hue', afterRender:function() {
  var me = this, src = me.gradientUrl, el = me.el;
  me.callParent();
  if (!src) {
    src = el.getStyle('background-image');
    src = src.substring(4, src.length - 1);
    if (src.indexOf('"') === 0) {
      src = src.substring(1, src.length - 1);
    }
    Ext.ux.colorpick.SliderHue.prototype.gradientUrl = src;
  }
  el.setStyle('background-image', 'none');
  el = me.getDragContainer().el;
  el.createChild({tag:'img', cls:Ext.baseCSSPrefix + 'colorpicker-hue-gradient', src:src});
}, setHue:function(hue) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.bodyElement, containerHeight = containerEl.getHeight(), top, yRatio;
  hue = hue > 1 ? hue / 360 : hue;
  if (dragHandle.isDragging) {
    return;
  }
  yRatio = 1 - hue;
  top = containerHeight * yRatio;
  dragHandle.element.setStyle({top:top + 'px'});
}});
Ext.define('Ext.ux.colorpick.Selector', {extend:'Ext.panel.Panel', xtype:'colorselector', mixins:['Ext.ux.colorpick.Selection'], controller:'colorpick-selectorcontroller', requires:['Ext.field.Text', 'Ext.field.Number', 'Ext.ux.colorpick.ColorMap', 'Ext.ux.colorpick.SelectorModel', 'Ext.ux.colorpick.SelectorController', 'Ext.ux.colorpick.ColorPreview', 'Ext.ux.colorpick.Slider', 'Ext.ux.colorpick.SliderAlpha', 'Ext.ux.colorpick.SliderSaturation', 'Ext.ux.colorpick.SliderValue', 'Ext.ux.colorpick.SliderHue'], 
config:{hexReadOnly:false}, width:Ext.platformTags.phone ? 'auto' : 580, height:337, cls:Ext.baseCSSPrefix + 'colorpicker', padding:10, layout:{type:Ext.platformTags.phone ? 'vbox' : 'hbox', align:'stretch'}, defaultBindProperty:'value', twoWayBindable:['value', 'hidden'], fieldWidth:50, fieldPad:5, showPreviousColor:false, okButtonText:'OK', cancelButtonText:'Cancel', showOkCancelButtons:false, listeners:{resize:'onResize', show:'onResize'}, initConfig:function(config) {
  var me = this, childViewModel = Ext.Factory.viewModel('colorpick-selectormodel');
  me.childViewModel = childViewModel;
  if (Ext.platformTags.phone && !(Ext.Viewport.getOrientation() === 'landscape')) {
    me.fieldWidth = 35;
  }
  if (Ext.platformTags.phone) {
    config.items = [me.getPreviewForMobile(childViewModel, config), {xtype:'container', padding:'4px 0 0 0', layout:{type:'hbox', align:'stretch'}, flex:1, items:[me.getMapAndHexRGBFields(childViewModel), me.getSliderAndHField(childViewModel), me.getSliderAndSField(childViewModel), me.getSliderAndVField(childViewModel), me.getSliderAndAField(childViewModel)]}, me.getButtonForMobile(childViewModel, config)];
  } else {
    config.items = [me.getMapAndHexRGBFields(childViewModel), me.getSliderAndHField(childViewModel), me.getSliderAndSField(childViewModel), me.getSliderAndVField(childViewModel), me.getSliderAndAField(childViewModel), me.getPreviewAndButtons(childViewModel, config)];
  }
  me.childViewModel.bind('{selectedColor}', function(color) {
    me.setColor(color);
  });
  this.callParent(arguments);
}, updateColor:function(color) {
  var me = this;
  me.mixins.colorselection.updateColor.call(me, color);
  me.childViewModel.set('selectedColor', color);
}, updatePreviousColor:function(color) {
  this.childViewModel.set('previousColor', color);
}, getMapAndHexRGBFields:function(childViewModel) {
  var me = this, fieldMargin = '0 ' + me.fieldPad + ' 0 0', fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-escape-overflow', flex:1, autoSize:false, layout:{type:'vbox', constrainAlign:true}, margin:'0 10 0 0', items:[{xtype:'colorpickercolormap', reference:'colorMap', flex:1, bind:{position:{bindTo:'{selectedColor}', deep:true}, hue:'{selectedColor.h}'}, listeners:{handledrag:'onColorMapHandleDrag'}}, {xtype:'container', layout:'hbox', autoSize:null, defaults:{labelAlign:'top', allowBlank:false}, items:[{xtype:'textfield', 
  label:'HEX', flex:1, bind:'{hex}', clearable:Ext.platformTags.phone ? false : true, margin:fieldMargin, validators:/^#[0-9a-f]{6}$/i, readOnly:me.getHexReadOnly(), required:true}, {xtype:'numberfield', clearable:false, label:'R', bind:'{red}', width:fieldWidth, hideTrigger:true, validators:/^(0|[1-9]\d*)$/i, maxValue:255, minValue:0, margin:fieldMargin, required:true}, {xtype:'numberfield', clearable:false, label:'G', bind:'{green}', width:fieldWidth, hideTrigger:true, validators:/^(0|[1-9]\d*)$/i, 
  maxValue:255, minValue:0, margin:fieldMargin, required:true}, {xtype:'numberfield', clearable:false, label:'B', bind:'{blue}', width:fieldWidth, hideTrigger:true, validators:/^(0|[1-9]\d*)$/i, maxValue:255, minValue:0, margin:0, required:true}]}]};
}, getSliderAndHField:function(childViewModel) {
  var me = this, fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-escape-overflow', width:fieldWidth, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'colorpickersliderhue', reference:'hueSlider', flex:1, bind:{hue:'{selectedColor.h}'}, width:fieldWidth, listeners:{handledrag:'onHueSliderHandleDrag'}}, {xtype:'numberfield', reference:'hnumberfield', clearable:false, label:'H', labelAlign:'top', bind:'{hue}', hideTrigger:true, maxValue:360, minValue:0, allowBlank:false, 
  margin:0, required:true}]};
}, getSliderAndSField:function(childViewModel) {
  var me = this, fieldWidth = me.fieldWidth, fieldPad = me.fieldPad;
  return {xtype:'container', viewModel:childViewModel, cls:[Ext.baseCSSPrefix + 'colorpicker-escape-overflow', Ext.baseCSSPrefix + 'colorpicker-column-sslider'], width:fieldWidth, layout:{type:'vbox', align:'stretch'}, margin:'0 ' + fieldPad + ' 0 ' + fieldPad, items:[{xtype:'colorpickerslidersaturation', reference:'satSlider', flex:1, bind:{saturation:'{saturation}', hue:'{selectedColor.h}'}, width:fieldWidth, listeners:{handledrag:'onSaturationSliderHandleDrag'}}, {xtype:'numberfield', reference:'snumberfield', 
  clearable:false, label:'S', labelAlign:'top', bind:'{saturation}', hideTrigger:true, maxValue:100, minValue:0, allowBlank:false, margin:0, required:true}]};
}, getSliderAndVField:function(childViewModel) {
  var me = this, fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:[Ext.baseCSSPrefix + 'colorpicker-escape-overflow', Ext.baseCSSPrefix + 'colorpicker-column-vslider'], width:fieldWidth, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'colorpickerslidervalue', reference:'valueSlider', flex:1, bind:{value:'{value}', hue:'{selectedColor.h}'}, width:fieldWidth, listeners:{handledrag:'onValueSliderHandleDrag'}}, {xtype:'numberfield', reference:'vnumberfield', clearable:false, label:'V', labelAlign:'top', 
  bind:'{value}', hideTrigger:true, maxValue:100, minValue:0, allowBlank:false, margin:0, required:true}]};
}, getSliderAndAField:function(childViewModel) {
  var me = this, fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-escape-overflow', width:fieldWidth, layout:{type:'vbox', align:'stretch'}, margin:'0 0 0 ' + me.fieldPad, items:[{xtype:'colorpickerslideralpha', reference:'alphaSlider', flex:1, bind:{alpha:'{alpha}', color:{bindTo:'{selectedColor}', deep:true}}, width:fieldWidth, listeners:{handledrag:'onAlphaSliderHandleDrag'}}, {xtype:'numberfield', reference:'anumberfield', clearable:false, label:'A', labelAlign:'top', 
  bind:'{alpha}', hideTrigger:true, maxValue:100, minValue:0, allowBlank:false, margin:0, required:true}]};
}, getPreviewAndButtons:function(childViewModel, config) {
  var items = [{xtype:'colorpickercolorpreview', flex:1, bind:{color:{bindTo:'{selectedColor}', deep:true}}}];
  if (config.showPreviousColor) {
    items.push({xtype:'colorpickercolorpreview', flex:1, bind:{color:{bindTo:'{previousColor}', deep:true}}, listeners:{click:'onPreviousColorSelected'}});
  }
  if (config.showOkCancelButtons) {
    items.push({xtype:'button', text:this.okButtonText, margin:'10 0 0 0', handler:'onOK'}, {xtype:'button', text:this.cancelButtonText, margin:'10 0 0 0', handler:'onCancel'});
  }
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-column-preview', width:70, margin:'0 0 0 10', items:items, layout:{type:'vbox', align:'stretch'}};
}, getPreviewForMobile:function(childViewModel, config) {
  var items = [{xtype:'colorpickercolorpreview', flex:1, bind:{color:{bindTo:'{selectedColor}', deep:true}}}];
  if (config.showPreviousColor) {
    items.push({xtype:'colorpickercolorpreview', flex:1, bind:{color:{bindTo:'{previousColor}', deep:true}}, listeners:{click:'onPreviousColorSelected'}});
  }
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-column-mobile-preview', height:40, margin:'10 0 10 0', items:items, layout:{type:'hbox', align:'stretch'}};
}, getButtonForMobile:function(childViewModel, config) {
  var items = [];
  if (config.showOkCancelButtons) {
    items.push({xtype:'container', flex:1}, {xtype:'button', text:this.cancelButtonText, minWidth:70, margin:'5 5 0 5', handler:'onCancel'}, {xtype:'button', text:this.okButtonText, margin:'5 5 0 5', minWidth:50, handler:'onOK'});
    return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-column-mobile-button', width:'100%', height:40, margin:'0', align:'right', items:items, layout:{type:'hbox', align:'stretch'}};
  }
  return {};
}});
Ext.define('Ext.ux.colorpick.ButtonController', {extend:'Ext.app.ViewController', alias:'controller.colorpick-buttoncontroller', requires:['Ext.Dialog', 'Ext.ux.colorpick.Selector', 'Ext.ux.colorpick.ColorUtils'], afterRender:function(view) {
  view.updateColor(view.getColor());
}, destroy:function() {
  var view = this.getView(), colorPickerWindow = view.colorPickerWindow;
  if (colorPickerWindow) {
    colorPickerWindow.destroy();
    view.colorPickerWindow = view.colorPicker = null;
  }
  this.callParent();
}, getPopup:function() {
  var view = this.getView(), popup = view.colorPickerWindow, selector;
  if (!popup) {
    popup = Ext.create(view.getPopup());
    view.colorPickerWindow = popup;
    popup.colorPicker = view.colorPicker = selector = popup.lookupReference('selector');
    selector.setFormat(view.getFormat());
    selector.on({ok:'onColorPickerOK', cancel:'onColorPickerCancel', scope:this});
    popup.on({close:'onColorPickerCancel', scope:this});
  }
  return popup;
}, onClick:function() {
  var me = this, view = me.getView(), color = view.getColor(), popup = me.getPopup(), colorPicker = popup.colorPicker;
  colorPicker.setColor(color);
  colorPicker.setPreviousColor(color);
  popup.show();
}, onColorPickerOK:function(picker) {
  var view = this.getView(), color = picker.getColor(), cpWin = view.colorPickerWindow;
  cpWin.hide();
  view.setColor(color);
}, onColorPickerCancel:function() {
  var view = this.getView(), cpWin = view.colorPickerWindow;
  cpWin.hide();
}, syncColor:function(color) {
  var view = this.getView();
  Ext.ux.colorpick.ColorUtils.setBackground(view.filterEl, color);
}});
Ext.define('Ext.ux.colorpick.Button', {extend:'Ext.Component', xtype:'colorbutton', controller:'colorpick-buttoncontroller', mixins:['Ext.ux.colorpick.Selection'], requires:['Ext.ux.colorpick.ButtonController'], baseCls:Ext.baseCSSPrefix + 'colorpicker-button', width:20, height:20, childEls:['btnEl', 'filterEl'], config:{popup:{lazy:true, $value:{xtype:'dialog', closeAction:'hide', referenceHolder:true, header:false, resizable:true, scrollable:true, items:{xtype:'colorselector', reference:'selector', 
flex:'1 1 auto', showPreviousColor:true, showOkCancelButtons:true}}}}, defaultBindProperty:'value', twoWayBindable:'value', getTemplate:function() {
  return [{reference:'filterEl', cls:Ext.baseCSSPrefix + 'colorbutton-filter-el'}, {reference:'btnEl', tag:'a', cls:Ext.baseCSSPrefix + 'colorbutton-btn-el'}];
}, listeners:{click:'onClick', element:'btnEl'}, updateColor:function(color) {
  var me = this, cp = me.colorPicker;
  me.mixins.colorselection.updateColor.call(me, color);
  Ext.ux.colorpick.ColorUtils.setBackground(me.filterEl, color);
  if (cp) {
    cp.setColor(color);
  }
}, updateFormat:function(format) {
  var cp = this.colorPicker;
  if (cp) {
    cp.setFormat(format);
  }
}});
Ext.define('Ext.ux.colorpick.Field', {extend:'Ext.field.Picker', xtype:'colorfield', mixins:['Ext.ux.colorpick.Selection'], requires:['Ext.window.Window', 'Ext.ux.colorpick.Selector', 'Ext.ux.colorpick.ColorUtils'], editable:false, focusable:true, matchFieldWidth:false, html:['\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'colorpicker-field-swatch"\x3e' + '\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'colorpicker-field-swatch-inner"\x3e\x3c/div\x3e' + '\x3c/div\x3e'], cls:Ext.baseCSSPrefix + 'colorpicker-field', 
config:{popup:{lazy:true, $value:{xtype:'window', closeAction:'hide', modal:Ext.platformTags.phone ? true : false, referenceHolder:true, width:Ext.platformTags.phone ? '100%' : 'auto', layout:Ext.platformTags.phone ? 'hbox' : 'vbox', header:false, resizable:true, scrollable:true, items:{xtype:'colorselector', reference:'selector', flex:'1 1 auto', showPreviousColor:true, showOkCancelButtons:true}}}}, afterRender:function() {
  this.callParent();
  this.updateValue(this.value);
}, createFloatedPicker:function() {
  var me = this, popup = me.getPopup(), picker;
  me.colorPickerWindow = popup = Ext.create(popup);
  picker = me.colorPicker = popup.lookupReference('selector');
  picker.setColor(me.getColor());
  picker.setHexReadOnly(!me.editable);
  picker.on({ok:'onColorPickerOK', cancel:'onColorPickerCancel', close:'onColorPickerCancel', scope:me});
  me.colorPicker.ownerCmp = me;
  return me.colorPickerWindow;
}, createEdgePicker:function() {
  var me = this, popup = me.getPopup(), picker;
  me.colorPickerWindow = popup = Ext.create(popup);
  picker = me.colorPicker = popup.lookupReference('selector');
  me.pickerType = 'floated';
  picker.setColor(me.getColor());
  picker.on({ok:'onColorPickerOK', cancel:'onColorPickerCancel', close:'onColorPickerCancel', scope:me});
  me.colorPicker.ownerCmp = me;
  return me.colorPickerWindow;
}, collapse:function() {
  var picker = this.getPicker();
  if (this.expanded) {
    picker.hide();
  }
}, showPicker:function() {
  var me = this, alignTarget = me[me.alignTarget], picker = me.getPicker(), color = this.getColor();
  if (this.colorPicker) {
    this.colorPicker.setColor(this.getColor());
    this.colorPicker.setPreviousColor(color);
  }
  if (me.getMatchFieldWidth()) {
    picker.setWidth(alignTarget.getWidth());
  }
  if (Ext.platformTags.phone) {
    picker.show();
  } else {
    picker.showBy(alignTarget, me.getFloatedPickerAlign(), {minHeight:100});
  }
  me.touchListeners = Ext.getDoc().on({translate:false, touchstart:me.collapseIf, scope:me, delegated:false, destroyable:true});
}, onFocusLeave:function(e) {
  if (e.type !== 'focusenter') {
    this.callParent(arguments);
  }
}, onColorPickerOK:function(colorPicker) {
  this.setColor(colorPicker.getColor());
  this.collapse();
}, onColorPickerCancel:function() {
  this.collapse();
}, onExpandTap:function() {
  var color = this.getColor();
  if (this.colorPicker) {
    this.colorPicker.setPreviousColor(color);
  }
  this.callParent(arguments);
}, setValue:function(color) {
  var me = this, c;
  if (Ext.ux.colorpick.ColorUtils.isValid(color)) {
    c = me.mixins.colorselection.applyValue.call(me, color);
    me.callParent([c]);
  }
}, updateFormat:function(format) {
  var cp = this.colorPicker;
  if (cp) {
    cp.setFormat(format);
  }
}, updateValue:function(color) {
  var me = this, swatchEl = this.element.down('.x-colorpicker-field-swatch-inner'), c;
  if (!me.syncing) {
    me.syncing = true;
    me.setColor(color);
    me.syncing = false;
  }
  c = me.getColor();
  Ext.ux.colorpick.ColorUtils.setBackground(swatchEl, c);
  if (me.colorPicker) {
    me.colorPicker.setColor(c);
  }
  me.inputElement.dom.value = me.getValue();
}, validator:function(val) {
  if (!Ext.ux.colorpick.ColorUtils.isValid(val)) {
    return this.invalidText;
  }
  return true;
}, updateColor:function(color) {
  var me = this, cp = me.colorPicker, swatchEl = this.element.down('.x-colorpicker-field-swatch-inner');
  me.mixins.colorselection.updateColor.call(me, color);
  Ext.ux.colorpick.ColorUtils.setBackground(swatchEl, color);
  if (cp) {
    cp.setColor(color);
  }
}});
