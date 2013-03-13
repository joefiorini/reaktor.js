function extract(value){
  return value();
}

function Behavior(type, selector){
  var element = document.querySelector(selector),
      p = new promise.Promise(),
      origThen = p.then,
      bindEvent = function(){
        element.addEventListener(type, function(){
          p.done();
        });
      };

  p.then = function(fn){
    origThen.call(p, function(){
      fn.apply(this, arguments);
      Behavior(type, selector).then(fn);
    });
  }

  bindEvent();

  return p;
}

function Value(selector){
  var element = document.querySelector(selector),
      _value,
      value = function(){
        return _value;
      }
  element.addEventListener("change", function(){
    _value = this.value;
  });
  return value;
}

function Reaktor(reactor){
  var value = reactor.with,
      listener = reactor.on,
      handler = reactor.then,
      arg,
      origThen;

  if(listener){
    listener.then(function(){
      arg = value ? extract(value) : arguments[1];
      handler.call(this, arg);
    });
  } else {
    // value.then(function(){ handler.call(this, extract(value)); });
  }
}

Reaktor.Ajax = function(url, ajax){
  var handler = ajax.then;
  var reactor =
    Reaktor({
      on: promise.get(url),
      then: function(result){
        handler.call(this, JSON.parse(result));
      }
    });
}


