import React, { Component } from 'react';

export default class TextareaSingle extends Component {
  constructor(props) {
    super(props);
    this.state = { [props.input]: '' };
  }

  onChange = async (e) => {
    await this.setState({
      [this.props.input]: e.target.value,
    });
    this.props.values(this.props.input, this.state, e.target);
  };

  onFocus = (e) => {
    const el = e.target;
    el.removeAttribute('style');
  };

  render() {
    const {
      input,
      label,
      placeholder,
      data,
      maxlength = 500,
      rows = 4, // Número de filas en el textarea (ajústalo según tus necesidades)
    } = this.props;
    return (
      <>
        {label !== false ? <label htmlFor={input}>{label}</label> : ''}
        {!data ? (
          <textarea
            id={input}
            name={input}
            placeholder={placeholder}
            onChange={this.onChange}
            maxLength={maxlength}
            onFocus={this.onFocus}
            rows={rows} // Número de filas
            className="w-full p-3 mt-2 mb-4 border-2 rounded bg-slate-200 border-slate-200 focus:border-blue-500 focus:outline-none"
          ></textarea>
        ) : (
          <textarea
            id={input}
            name={input}
            placeholder={placeholder}
            data-culqi={data}
            onChange={this.onChange}
            maxLength={maxlength}
            onFocus={this.onFocus}
            rows={rows} // Número de filas
            className="w-full p-3 mt-2 mb-4 border-2 rounded bg-slate-200 border-slate-200 focus:border-blue-500 focus:outline-none"
          ></textarea>
        )}
      </>
    );
  }
}
