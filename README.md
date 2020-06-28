# React Invisible Recaptcha

A simple React component to create Google invisible recaptchas

## Install

```sh
npm install react-invisible-recaptcha --save
```

Or use Yarn:
```sh
yarn add react-invisible-recaptcha
```

## Example

Below is a component which implements the recaptcha.

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

## Usage

```js
import Recaptcha from 'react-google-invisible-recaptcha';

<Recaptcha
  ref={ ref => this.recaptcha = ref }
  sitekey={ <sitekey> }
  onResolved={ () => console.log( 'Human detected.' ) } />
```

## Configuration

Set required props to get going.

* sitekey: sitekey for your recaptcha. **Required.**

A few optional props you can tweak.

* badge: `bottomright`, `bottomleft`, or `inline`. **Default: bottomright.**
* locale: in which language it speaks. **Default: en.**
* nonce: nonce included in the reCAPTCHA script tag. **Default: undefined.**
* onResolved: callback when the recaptcha is resolved. **Default: noop.**
* onError: callback when the recaptcha encounters an error. **Default: noop.**
* onExpired: callback when the recaptcha response expires. **Default: noop.**
* onLoaded: callback when the recaptcha is loaded. **Default: noop.**
* style: custom CSS applied to the root node. **Default: undefined.**
* tabindex: tabindex of the challenge. **Default: 0.**
* trustedTypesPolicy: the Trusted Types policy to use for the script url. **Default: null.**

## APIs

```js
<Recaptcha ref={ ref => this.recaptcha = ref } ... />
```

* _this.recaptcha.execute_ function which invokes the reCAPTCHA check.
* _this.recaptcha.reset_ function which resets the reCAPTCHA widget.
* _this.recaptcha.getResponse_ function which returns the response token.

## License

MIT. See [LICENSE.md](http://github.com/teamtofu/react-google-invisible-recaptcha/blob/master/LICENSE.md) for details.
