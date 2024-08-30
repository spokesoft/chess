const $ = require("jquery");
const { EventEmitter } = require("events");
const _uniqueId = require("lodash/uniqueId");

class Element extends EventEmitter {
  constructor(element, options) {
    super(); // Initialize the event emitter
    this.preinitialize(options);
    this.element = element;
    this.cid = _uniqueId("element");
    this.initialize(options);
    this.postinitialize(options);
  }

  get id() {
    return this.element.id;
  }

  set id(value) {
    this.element.id = value;
  }

  get classList() {
    return this.element.classList;
  }

  get element() {
    return this._element;
  }

  set element(value) {
    this._element = value;
    this._$element = $(this._element);
  }

  get $element() {
    return this._$element;
  }

  set $element(value) {
    this._$element = value;
    this._element = value[0];
  }

  preinitialize(options) {
    return this;
  }

  initialize(options) {
    return this;
  }

  postinitialize(options) {
    return this;
  }

  render() {
    return this;
  }
}

module.exports = Element;
