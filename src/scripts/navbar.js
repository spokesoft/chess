const Element = require('./element');

class NavbarUser extends Element {

}

class Navbar extends Element {
  initialize() {
    console.log('Initializing navbar');
    this.user = new NavbarUser();
  }
  render() {
    
  }
}

module.exports = Navbar;