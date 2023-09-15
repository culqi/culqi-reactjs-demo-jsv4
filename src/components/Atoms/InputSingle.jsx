import React, { Component } from 'react'

export default class InputSingle extends Component {

  constructor(props) {
    super(props)
    this.state = { [props.input]: '' }
  }

  onChange = async e => {
    await this.setState({
      [this.props.input]: e.target.value
    })
    this.props.values(this.props.input, this.state, e.target)
  }
  addText = async e => {
    await this.setState({ [this.props.input]: e.target.innerHTML })
    this.props.values(this.props.input, this.state)
  }

  onFocus = (e) => {
    const el = e.target
    el.removeAttribute('style');
  }

  render() {
    const { input, label, types, placeholder, data, maxlength = 50 } = this.props
    return (
      <>
        {
          label !== false ? <label htmlFor={input}>{label}</label> : ''
        }

        {
          !data ? <input
            type={types}
            id={input}
            name={input}
            placeholder={placeholder}
            onChange={this.onChange}
            maxLength={maxlength}
            onFocus={this.onFocus}
            className="w-full p-3 mt-2 mb-4 border-2 rounded bg-slate-200 border-slate-200 focus:border-blue-500 focus:outline-none" />
            : <input
              type={types}
              id={input}
              name={input}
              placeholder={placeholder}
              data-culqi={data}
              onChange={this.onChange}
              maxLength={maxlength}
              onFocus={this.onFocus}
              className="w-full p-3 mt-2 mb-4 border-2 rounded bg-slate-200 border-slate-200 focus:border-blue-500 focus:outline-none" />
        }
      </>
    )
  }
}
