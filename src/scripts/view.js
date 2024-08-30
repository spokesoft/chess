const { EventEmitter } = require('events');
const { isString, isElement, isObject } = require('lodash');

class Element extends EventEmitter {
  
  static constructFromString() {

  }

  static constructFromElement() {
    
  }

  static constructDefault() {
    
  }
  
  constructor(element, options) {

    super(); // Initialize the event emitter

    if (!isString(element) && !isElement(element)) {
      options = element;
      element = undefined;
      if (isObject(options)) {
        element = options.element;
        delete options.element;
      }
    }

    if (isString(elem)) {
      elem = document.querySelector(elem);
    } else if (!isElement(elem)) {
      throw new Error('Element must be a string or an Element');
    }
  }

  constructFromString() {

  }

  constructFromElement() {
    
  }

  constructDefault() {
    
  }
}

class Button extends Element {

}

class Form extends Element {

}

class Field extends Element {
  
}

class Component extends Element {

}

class Navbar extends Component {

}

class Page extends Component {

}