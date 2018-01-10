'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Recaptcha from '../';

class Form extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { value: '', resolved: false };
    this.onRestart = this.onRestart.bind( this );
    this.onSubmit = this.onSubmit.bind( this );
    this.onResolved = this.onResolved.bind( this );
  }
  render() {
    return this.state.resolved ? (
      <div>
        Human detected!
        <button onClick={ this.onRestart }>Restart</button>
      </div>
    ) : (
      <div>
        <input
          type="text"
          value={ this.state.value }
          onChange={ event => this.setState( { value: event.target.value } ) } />
        <button onClick={ this.onSubmit }>Submit</button>
        <Recaptcha
          ref={ ref => this.recaptcha = ref }
          sitekey="6LeH_x8UAAAAAKKuaaod4GsENkTJTHdeQIm8l6y2"
          onResolved={ this.onResolved } />
      </div>
    );
  }
  onRestart() {
    this.setState( { value: '', resolved: false } );
  }
  onSubmit() {
    if ( '' == this.state.value ) {
      alert( this.props.name + ': Validation failed! Input cannot be empty.' );
      this.recaptcha.reset();
    } else {
      this.recaptcha.execute();
    }
  }
  onResolved() {
    this.setState( { resolved: true } );
    alert( this.props.name + ': Recaptcha resolved with response: ' + this.recaptcha.getResponse() );
  }
}

window.onload = () => {
  ReactDOM.render(
    <div>
      <label>Form 1</label>
      <Form name="Form-1" />
      <label>Form 2</label>
      <Form name="Form-2" />
    </div>,
    document.querySelector( '#container' )
  );
};
