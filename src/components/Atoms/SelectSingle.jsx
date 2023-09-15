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
    this.props.values(this.props.input, this.state)
  }
  addText = async e => {
    await this.setState({ [this.props.input]: e.target.innerHTML })
    this.props.values(this.props.input, this.state)
  }

  render() {
    const { input } = this.props
    return (
      <>
        <label htmlFor={this.props.input}>{this.props.label}</label>
        <select
          id={input}
          name={input}
          onChange={this.onChange}
          value={this.props.name}
          className="w-full p-3 mt-2 mb-4 border-2 rounded bg-slate-200 border-slate-200 focus:border-slate-600 focus:outline-none" >
          {
            this.props.options.map(opt => {
              return <option key={opt.value} value={opt.value}>{opt.text}</option>
            })
          }
        </select>
      </>
    )
  }
}
