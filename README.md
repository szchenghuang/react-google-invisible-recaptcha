# react-google-invisible-recaptcha #

A React component which is interested in only Google invisible reCAPTCHA.

* Support multiple reCAPTCHA widgets on one page.
* Support React hooks.
* Support Typescript.

## Migration from 0.x to 1.0.0

```js
// Version 0.x
<Recaptcha ref={ref => this.recaptcha = ref} ... />
// this.recaptcha.execute invokes the reCAPTCHA check.

// Version 1.0.0
const refCaptcha = React.useRef(null) // or React.createRef().
<Recaptcha ref={refRecaptcha} ... />
// refRecaptcha.current.callbacks.execute invokes the reCAPTCHA check.
//             ^^^^^^^^^^^^^^^^^^
```

## [Demo][demo] ##

Type something in an input box and click the button to submit data. The value is then checked to make up example client-side validation. Only valid input triggers reCAPTCHA. Since the reCAPTCHA is invisible, it proceeds most likely as if none is attached. You will only be present the figure of the reCAPTCHA when Google hesitates to tell your identity.

When reCAPTCHA is resolved, the demo page shows the result token for demo purpose. In a real application, it should be used with a HTTP request targeting at `https://www.google.com/recaptcha/api/siteverify?secret=<secret>&response=<token>` on the server to validate the reCAPTCHA result before any sensitive operation is performed. Checking input values derived from clients on the server imporves security as well.

## Example ##

See the `example/` folder for an example.

## Install ##

```sh
// 1.0.0 prerelease.
npm install react-google-invisible-recaptcha@next --save
```

```sh
npm install react-google-invisible-recaptcha --save
```

## Usage ##

```js
import Recaptcha from 'react-google-invisible-recaptcha';

<Recaptcha
  onResolved={() => console.log('Human detected.')} />
  ref={refRecaptcha}
  sitekey={<sitekey>}
```

## Configuration ##

Set required props to get going.

* sitekey: sitekey for your recaptcha. **Required.**

A few optional props you can tweak.

* badge: `bottomright`, `bottomleft`, or `inline`. **Default: bottomright.**
* locale: in which language it speaks. **Default: en.**
* nonce: nonce included in the reCAPTCHA script tag. **Default: undefined.**
* onExpired: callback when the recaptcha response expires. **Default: noop.**
* onError: callback when the recaptcha encounters an error. **Default: noop.**
* onLoaded: callback when the recaptcha is loaded. **Default: noop.**
* onResolved: callback when the recaptcha is resolved. **Default: noop.**
* style: custom CSS applied to the root node. **Default: undefined.**
* tabindex: tabindex of the challenge. **Default: 0.**

## APIs ##

```js
// Functional component with React hooks.
const refRecaptcha = React.useRef(null);
<Recaptcha ref={refRecaptcha} ... />

// Class component.
this.refRecaptcha = React.createRef();
<Recaptcha ref={refRecaptcha} ... />

// refRecaptcha.current.callbacks.execute function which invokes the reCAPTCHA check.
// refRecaptcha.current.callbacks.reset function which resets the reCAPTCHA widget.
// refRecaptcha.current.callbacks.getResponse function which returns the response token.
```

## License ##

MIT. See [LICENSE.md](http://github.com/szchenghuang/react-google-invisible-recaptcha/blob/master/LICENSE.md) for details.

[demo]: https://szchenghuang.github.io/react-google-invisible-recaptcha/
