const feather = require("feather-icons");
// const Application = require('./application');

// const app = new Application();
// app.render();

feather.replace({
  width: 18,
  height: 18,
});

const $ = require('jquery');
const { defaults, isString, isElement, isPlainObject, uniqueId } = require("lodash");

class Element {
  get element() {
    return this._element;
  }

  set element(value) {
    this._element = value;
  }

  get $element() {
    return $(this.element);
  }

  set $element(value) {
    this.element = value[0];
  }

  get id() {
    return this.element.getAttribute('id');
  }

  set id(value) {
    this.element.setAttribute('id', value);
  }

  get name() {
    return this.element.getAttribute('name');
  }

  set name(value) {
    this.element.setAttribute('name', value);
  }

  get className() {
    return this.element.getAttribute('class');
  }

  set className(value) {
    return this.element.setAttribute('class', value);
  }

  get classList() {
    return this.element.classList;
  }

  constructor(options = {}) {

    this.cid = uniqueId('element');
    options = this.preinitialize(options) || options || {};

    if (isString(options)) {
      options = { element: document.querySelector(options) };
    }

    if (options && options.constructor === Element) {
      options = { element: options.element };
    }

    if (isElement(options)) {
      options = { element: options };
    }

    if (isString(options.selector)) {
      options.element = document.querySelector(options.selector);
    }

    let element = options.element;
    let attributes = defaults({}, options.attributes);
    delete options.element;

    if (!element) {
      element = document.createElement(options.tagName || "div");
    }

    for(let key in attributes) {
      element.setAttribute(key, attributes[key]);
    }

    this.element = element;
    this.options = options;
    this.initialize(element, options);
    this.postinitialize(element, options);
  }

  preinitialize(options) {
    return options;
  }

  initialize(element, options) {
    return this;
  }

  postinitialize(element, options) {
    return this;
  }

  render() {
    return this;
  }
}

var elem1 = new Element("#header");
var elem2 = new Element({
  selector: ".footer",
});
var elem3 = new Element(document.createElement("p"));
var elem4 = new Element({
  element: document.createElement("h1"),
});
var elem5 = new Element(elem3);
var elem6 = new Element({ tagName: "h3", attributes: { class: "title" } });

console.log(elem1);
console.log(elem2);
console.log(elem3);
console.log(elem4);
console.log(elem5);
console.log(elem6);
