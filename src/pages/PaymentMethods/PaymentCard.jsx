import React, { Component } from "react";
import { Link } from "react-router-dom";
import { URL_CLI } from "config/api";
import { AddingScript } from "hooks/useScripts";
import InputSingle from "components/Atoms/InputSingle";
import TextareaSingle from "components/Atoms/TextareaSingle";

class PaymentMethods extends Component {
  state = {
    token: null,
    form: {},
    isBtnDisabled: true
  };

  addOnChange = async (name, value, element) => {
    await this.setState({
      form: {
        ...this.state.form,
        [name]: Object.values(value),
      },
    });
  };
  logout() {
    localStorage.clear();
    window.location.reload();
  }
  _validateForm = (inputs) => {
    let isError = false,
      message = null;

    Array.from(inputs).forEach((el) => {
      if (el.value === "") {
        el.style.border = "1px solid red";
        isError = true;
        message = `Debe llenar todos los campos`;
      }
    });
    return { isError, message };
  };
  clearField() {
    const inputs = document.getElementsByTagName("input");
    Array.from(inputs).forEach((el) => {
      el.value = "";
    });
  }

  async componentDidMount() {
    await AddingScript(URL_CLI);
    setTimeout(() => {
      const {publicKey, xculqirsaid, rsapublickey, amount, currency } = localStorage;
      const Culqi = window.Culqi;
      Culqi.publicKey = publicKey;
      Culqi.init();
      Culqi.settings({
        currency: currency,
        amount: amount,
        xculqirsaid: xculqirsaid,
        rsapublickey: rsapublickey,        
      });
      setTimeout(() => {
        this.setState({
          isBtnDisabled: false
        })
      }, 2000);
      window.culqi = () => {
        if (Culqi.token && Culqi.token.object === "token") {
          let token = Culqi.token.id;
          this.setState({ token: Culqi.token.id });
          alert(`Se ha creado el objeto Token: ${token}.`);
          this.clearField();
        } else {
          alert(
            `Hubo un error al generar el código CIP: \n ${Culqi.error.user_message ?? Culqi.error.merchant_message ?? ""
            }`
          );
          this.clearField();
        }
        this.setState({
          isBtnDisabled: false
        })
      };
    }, 2000);
  }

  _handleActiveCheckout = async (e) => {
    e.preventDefault();
    const Culqi = window.Culqi;
    Culqi.token = undefined;
    const inputs = e.target.getElementsByTagName("input");
    this.setState({
      isBtnDisabled: true
    })
    const { isError } = this._validateForm(inputs);
    if (isError) {
      alert("Debes llenar los campos");
      return;
    }
    Culqi.validationPaymentMethods();
    const { available, generate, message } =
      Culqi.paymentOptionsAvailable.token;
    if (available) {
      generate();
    } else {
      alert(`Error al generar el token:  ${message}`);
      this.setState({
        isBtnDisabled: false
      })
    }
  };

  render() {
    console.log(this.state.isBtnDisabled)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-700">
        <div className="relative h-auto py-5 m-auto shadow-xl w-96 rounded-3xl bg-gray-50">
          <div className="px-5">
            <div className="flex items-center justify-between mb-2">
              <Link
                className='px-3 relative py-2 ml-2 font-semibold text-white bg-indigo-500 rounded-tr-lg rounded-br-lg hover:bg-indigo-700 hover:before:border-r-indigo-700 focus:bg-indigo-700 before:content-[""] before:absolute before:top-0 before:-left-2 before:h-full before:border-r-indigo-500 before:border-r-8 before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent'
                to="/select-methods"
              >
                Back
              </Link>
              <button
                onClick={this.logout}
                className='px-3 relative py-2 ml-2 font-semibold text-white bg-indigo-500 rounded-tl-lg rounded-bl-lg hover:bg-indigo-700 hover:before:border-r-indigo-700 focus:bg-indigo-700 before:content-[""] before:absolute before:top-0 before:-right-2 before:h-full before:border-l-indigo-500 before:border-l-8 before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent'
                to="/select-methods"
              >
                Cerrar
              </button>
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-600 md:text-5xl">
                Checkout
              </h1>
            </div>
          </div>
          <div className="m-auto w-80">
            <div className="grid items-center h-auto grid-cols-1 gap-8 py-10 place-content-center">
              <form className="max-w-lg " onSubmit={this._handleActiveCheckout}>
                <div className="flex flex-wrap mb-6 -mx-3">
                  <div className="w-full px-3">
                    <InputSingle
                      input="card[email]"
                      types="text"
                      label="Correo Electrónico"
                      placeholder="email@email.com"
                      values={this.addOnChange}
                    />
                    <p className="text-xs italic text-gray-600">
                      Make it as long and as crazy as you'd like
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap mb-6 -mx-3">
                  <div className="w-full px-3">
                    <InputSingle
                      input="card[number]"
                      types="text"
                      maxlength="16"
                      label="Número de tarjeta"
                      placeholder="4111 1111 1111 1111"
                      values={this.addOnChange}
                    />
                    <p className="text-xs italic text-gray-600">
                      Make it as long and as crazy as you'd like
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap mb-2 -mx-3">
                  <div className="w-full px-3 mb-6 md:w-3/4 md:mb-0">
                    <label
                      className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                      htmlFor="grid-city"
                    >
                      Fecha expiración (MM/YYYY)
                    </label>
                    <div className="flex items-center">
                      <InputSingle
                        input="card[exp_month]"
                        types="number"
                        label={false}
                        maxlength="2"
                        placeholder="MM"
                        values={this.addOnChange}
                      />
                      <span>/</span>

                      <InputSingle
                        input="card[exp_year]"
                        types="number"
                        label={false}
                        maxlength="2"
                        placeholder="AA"
                        values={this.addOnChange}
                      />
                    </div>
                  </div>
                  <div className="w-full px-3 mb-6 md:w-1/4 md:mb-0">
                    <InputSingle
                      input="card[cvv]"
                      types="text"
                      label="CVV"
                      maxlength="3"
                      placeholder="123"
                      values={this.addOnChange}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center mt-4 mb-2 -mx-3">
                  <button
                    className="px-3 py-2 text-white bg-purple-600 rounded-lg cursor-pointer hover:text-black disabled:bg-purple-300 disabled:hover:bg-purple-300 disabled:hover:text-white disabled:cursor-not-allowed"
                    type="submit"
                    disabled={this.state.isBtnDisabled}
                  >
                    Pagar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentMethods;
