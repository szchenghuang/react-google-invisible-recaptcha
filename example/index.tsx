'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Recaptcha from '../dist';

import type { Callbacks } from '../dist';

type Props = {
  name: string;
}

function FunctionalComponent(props: Props) {
  const { name } = props;

  const [value, setValue] = React.useState('');
  const [resolved, setResolved] = React.useState(false);

  const refRecaptcha = React.useRef(null);

  const onResolved = () => {
    alert(name
      + ': Recaptcha resolved with response: '
      + refRecaptcha.current.callbacks.getResponse());
    setResolved(true);
  };

  const onRestart = () => {
    setValue('');
    setResolved(false);
  };

  const onSubmit = () => {
    if ('' == value) {
      alert( name + ': Validation failed! Input cannot be empty.' );
      refRecaptcha.current.callbacks.reset();
    } else {
      refRecaptcha.current.callbacks.execute();
    }
  };

  return resolved ? (
    <div>
      Human detected!
      <button onClick={onRestart}>Restart</button>
    </div>
  ) : (
    <div>
      <input
        type="text"
        value={value}
        onChange={event => setValue(event.target.value)}
      />
      <button onClick={onSubmit}>Submit</button>
      <Recaptcha
        onResolved={onResolved}
        ref={refRecaptcha}
        sitekey="6LeH_x8UAAAAAKKuaaod4GsENkTJTHdeQIm8l6y2"
      />
    </div>
  );
}

type State = {
  resolved: boolean;
  value: string;
};

class ClassComponent extends React.Component<Props, State> {
  refRecaptcha: React.RefObject<HTMLDivElement & { callbacks?: Callbacks }>;

  constructor(props: Props) {
    super(props);
    this.state = { value: '', resolved: false };
    this.refRecaptcha = React.createRef();
    this.onResolved = this.onResolved.bind(this);
    this.onRestart = this.onRestart.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onResolved() {
    alert(
      this.props.name
      + ': Recaptcha resolved with response: '
      + this.refRecaptcha.current.callbacks.getResponse()
    );
    this.setState({ resolved: true });
  }
  onRestart() {
    this.setState({ value: '', resolved: false });
  }
  onSubmit() {
    if ('' == this.state.value) {
      alert(this.props.name + ': Validation failed! Input cannot be empty.');
      this.refRecaptcha.current.callbacks.reset();
    } else {
      this.refRecaptcha.current.callbacks.execute();
    }
  }
  render() {
    return this.state.resolved ? (
      <div>
        Human detected!
        <button onClick={this.onRestart}>Restart</button>
      </div>
    ) : (
      <div>
        <input
          type="text"
          value={this.state.value}
          onChange={event => this.setState({ value: event.target.value })} />
        <button onClick={this.onSubmit}>Submit</button>
        <Recaptcha
          onResolved={this.onResolved}
          ref={this.refRecaptcha}
          sitekey="6LeH_x8UAAAAAKKuaaod4GsENkTJTHdeQIm8l6y2"
        />
      </div>
    );
  }
}

window.onload = () => {
  ReactDOM.render(
    <div>
      <label>Functional Form</label>
      <FunctionalComponent name="Functional Form" />
      <label>Class Form</label>
      <ClassComponent name="Class Form" />
    </div>,
    document.querySelector('#container')
  );
};
