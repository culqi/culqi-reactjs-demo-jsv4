import React, { Component } from 'react'

import InputSingle from 'components/Atoms/InputSingle'
import SelectSingle from 'components/Atoms/SelectSingle'
import TextareaSingle from "components/Atoms/TextareaSingle";

class HomeView extends Component {

  state = {
    setting: {
      publicKey: '',
      secretKey: '',
      xculqirsaid: '',
      rsapublickey: '',
      currency: 'PEN',
      amount: ''
    },
    regex: {
      publicKey: 'pk_test_',
      secretKey: 'sk_test_',
      xculqirsaid: 'a233d',
      rsapublickey: 'RSA',
      amount: '[0-9]{1,6}'
    },
  }
  addOnChange = async (name, value, element) => {
    await this.setState({
      setting: {
        ...this.state.setting,
        [name]: Object.values(value)
      }
    })
  }
  _handleSubmit = async (e) => {
    e.preventDefault()
    const inputs = e.target.getElementsByTagName('input');
    const _settings = this.state.setting;
    const { isError } = this._validateForm(inputs)
    if (isError) {
      alert('Debes llenar los campos')
      return;
    }
    for (const item in _settings) {
      this.state.isLoading = true;
      localStorage.setItem(item, _settings[item].toString())
      window.location.href = `/select-methods`;
    }
  }

  _validateForm = (inputs) => {
    const { setting } = this.state
    let isError = false, message = null;
    for (const item in setting) {
      const input = Array.from(inputs).find(x => x.id === item);
      if (setting[item] === '') {
        input.style.border = '1px solid red';
        isError = true;
        message = `Debe agregar su ${item}`
      }
    }
    return { isError, message };
  }

  showMessageError = prop => {
    return <p className="text-xs italic text-red-500">Por favor, el campo {prop} no debe ser vació</p>
  }

  render() {

    return (
      <div className='flex items-center justify-center min-h-screen bg-slate-700' >
        <div className='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
          <div className='max-w-md mx-auto space-y-6'>
            <form onSubmit={this._handleSubmit}>
              <h2 className="text-2xl font-bold ">Flujo de checkout personalizado</h2>
              <p className="my-4 opacity-70">Para realizar pruebas debes ingresar tus 'pk_test' y 'sk_test'.
                <br />
                El campo moneda y precio son opcionales
              </p>
              <hr className="my-6" />
              <InputSingle
                input='publicKey'
                types='text'
                label='Public Key (pk)'
                placeholder="pk_test_****************"
                values={this.addOnChange}
              />
              <InputSingle
                input='secretKey'
                types='text'
                label='Secret Key (sk)'
                placeholder="sk_test_****************"
                values={this.addOnChange}
              />
              <InputSingle
                input='xculqirsaid'
                types='text'
                label='Rsa ID'
                placeholder="a12dsds****************"
                values={this.addOnChange}
              />
               <TextareaSingle
                input='rsapublickey'
                types='textarea'
                label='Rsa PublicKey'
                placeholder="RSA *******"
                values={this.addOnChange}
              />
              <SelectSingle
                input="currency"
                label='Moneda'
                values={this.addOnChange}
                options={[{ value: 'PEN', text: 'PEN' }, { value: 'USD', text: 'USD' }]}
              />
              <InputSingle
                input='amount'
                types='text'
                label='Monto'
                placeholder="11000"
                values={this.addOnChange}
              />
              <button type="submit" className="w-full px-6 py-3 my-2 font-medium text-white duration-300 ease-in-out rounded cursor-pointer bg-emerald-500 hover:bg-indigo-500">
                {
                  this.state.isLoading ? <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg> : ''
                }
                Realizar pruebas
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default HomeView;
