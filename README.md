# react-google-invisible-recaptcha #

A React component which is simply interested in Google invisible reCAPTCHA.

* Support multiple reCAPTCHA widgets on one page.
* Vallina JS.

## [Demo][demo] ##

Type something in an input box and click the button to submit data. The value is then checked to make up example client-side validation. Only valid input triggers reCAPTCHA. Since the reCAPTCHA is invisible, it proceeds most likely as if none is attached. You will only be present the figure of the reCAPTCHA when Google hesitates to tell your identity.

When reCAPTCHA is resolved, the demo page shows the result token for demo purpose. In a real application, it should be used with a HTTP request targeting at `https://www.google.com/recaptcha/api/siteverify?secret=<secret>&response=<token>` on the server to validate the reCAPTCHA result before any sensitive operation is performed. Checking input values derived from clients on the server imporves security as well.

## Example ##

Below is a component which coordinates the procedure.

```js
class Example extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { value: '' };
    this.onSubmit = this.onSubmit.bind( this );
    this.onResolved = this.onResolved.bind( this );
  }
  render() {
    return (
      <div>
        <input
          type="text"
          value={ this.state.value }
          onChange={ event => this.setState( { value: event.target.value } ) } />
        <button onClick={ this.onSubmit }>Submit</button>
        <Recaptcha
          ref={ ref => this.recaptcha = ref }
          sitekey="<sitekey>"
          onResolved={ this.onResolved } />
      </div>
    );
  }
  onSubmit() {
    if ( '' == this.state.value ) {
      alert( 'Validation failed! Input cannot be empty.' );
      this.recaptcha.reset();
    } else {
      this.recaptcha.execute();
    }
  }
  onResolved() {
    alert( 'Recaptcha resolved with response: ' + this.recaptcha.getResponse() );
  }
}
```

## Install ##

```sh
npm install react-google-invisible-recaptcha --save
```

## Usage ##

```js
import Recaptcha from 'react-google-invisible-recaptcha';

<Recaptcha
  ref={ ref => this.recaptcha = ref }
  sitekey={ <sitekey> }
  onResolved={ () => console.log( 'Human detected.' ) } />
```

## Configuration ##

Set required props to get going.

* sitekey: sitekey for your recaptcha. **Required.**

A few optional props you can tweak.

* locale: in which language it speaks. **Default: en.**
* badge: `bottomright`, `bottomleft`, or `inline`. **Default: bottomright.**
* tabindex: tabindex of the challenge. **Default: 0.**
* onResolved: callback when the recaptcha is resolved. **Default: noop.**
* onError: callback when the recaptcha encounters an error. **Default: noop.**
* onExpired: callback when the recaptcha response expires. **Default: noop.**
* onLoaded: callback when the recaptcha is loaded. **Default: noop.**
* style: custom CSS applied to the root node. **Default: undefined.**

## APIs ##

```js
<Recaptcha ref={ ref => this.recaptcha = ref } ... />
```

* _this.recaptcha.execute_ function which invokes the reCAPTCHA check.
* _this.recaptcha.reset_ function which resets the reCAPTCHA widget.
* _this.recaptcha.getResponse_ function which returns the response token.

## License ##

MIT. See [LICENSE.md](http://github.com/szchenghuang/react-google-invisible-recaptcha/blob/master/LICENSE.md) for details.

[demo]: https://szchenghuang.github.io/react-google-invisible-recaptcha/
