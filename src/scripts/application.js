const { EventEmitter } = require("events");
const Element = require('./element');



class Application extends EventEmitter {

  constructor() {
    super(); // Initialize the event emitter
    this.user = null;
    this.page = null;
    this.header = new Header(document.querySelector('#header'));
    this.footer = new Footer(document.querySelector('#footer'));
    this.content = new Content(document.querySelector('#content'));
  }

  render() {
    this.header.render();
    this.footer.render();
    this.content.render();
  }

}



class Header extends Element {
  initialize() {
    super.initialize();
    this.navbar = new Navbar(this.element.querySelector('.navbar'));
    console.info('Header initialized');
  }
}



class Footer extends Element {
  initialize() {
    super.initialize();
    console.info('Footer initialized');
  }
}



class Content extends Element {
  initialize() {
    super.initialize();
    this.page = null;
    console.info('Content initialized');
  }
  render() {
    this.element.innerHTML = '';
    if (!this.page) {
      if (!this.user) {
        this.page = new LoginPage(document.createElement('div'));
      } else {
        this.page = new GamePage(document.createElement('div'));
      }
    }
    this.page.render();
    if (!this.page.element.isConnected) {
      this.element.appendChild(this.page.element);
    }
  }
}

class Navbar extends Element {
  initialize() {
    super.initialize();
    this.guest = new NavbarGuest(document.createElement('div'));
    this.player = new NavbarPlayer(document.createElement('div'));
    this.score = new NavbarScore(document.createElement('div'));
    this.element.appendChild(this.guest.element);
    this.element.appendChild(this.player.element);
    this.element.appendChild(this.score.element);
  }
}



class NavbarGuest extends Element {}

class NavbarPlayer extends Element {}

class NavbarScore extends Element {}

class LoginPage extends Element {
  render() {
    const template = document.querySelector('template[name="login"]');
    const clone = template.content.cloneNode(true);
    this.element.style.height = '100%';
    this.classList.add('is-flex');
    this.classList.add('is-align-items-center');
    this.classList.add('is-justify-content-center');
    this.element.appendChild(clone);
  }
}

class GamePage extends Element {
  render() {
    this.element.innerHTML = 'Game Page';
  }
}

module.exports = Application;