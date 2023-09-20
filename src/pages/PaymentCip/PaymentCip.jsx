import React, { Component } from "react";
import { Link } from "react-router-dom";

import ButtonLoader from "components/Atoms/ButtonLoading";
import { URL_CLI } from "config/api";
import { AddingScript } from "hooks/useScripts";

class ComponenteGenerate extends Component {
  render() {
    const {
      isGenerate,
      result,
      textSuccess,
      actionClick,
      labelText,
      isLoading,
      btnText,
      btnTextLoading,
      isDisabled,
    } = this.props;
    return (
      <>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <span>{labelText}</span>
              <ButtonLoader
                bgClass="bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 px-3 py-2 text-white rounded-lg cursor-pointer hover:text-black disabled:bg-red-400 disabled:from-purple-300 disabled:to-blue-300 disabled:hover:from-purple-300 disabled:hover:to-blue-300 disabled:hover:text-white disabled:cursor-not-allowed"
                onClickButton={actionClick}
                isLoading={isLoading}
                isDisabled={isDisabled}
                text={btnText}
                textLoading={btnTextLoading}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="grid w-full h-full grid-rows-2 gap-0 p-2 text-center border-2">
              <span
                className={`flex items-center justify-center w-full font-sans font-bold text-center text-black `}
              >
                {isGenerate ? textSuccess : ""}
              </span>
              <span
                className={`p-2 px-4 my-4 font-sans font-bold text-center ${
                  isGenerate
                    ? "text-blue-500 bg-blue-100 border-2 rounded-lg"
                    : ""
                }`}
              >
                {result !== null ? result : ""}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default class PaymentCip extends Component {
  state = {
    order_id: null,
    errorMessage: null,
    isBtnDisabled: true,
    pk: null,
    isLoading: {
      btnCip: false,
      btnCuotealo: false,
    },
    isGenerate: {
      cip: false,
      cuotealo: false,
    },
    textSuccess: {
      cip: null,
      cuotealo: null,
    },
    cipCode: null,
    linkCouotealo: null,
  };

  async componentDidMount() {
    await AddingScript(URL_CLI);
    setTimeout(() => {
      const { publicKey, amount, currency, order_id } = localStorage;

      this.setState({
        pk: publicKey,
        order_id: order_id,
      });

      const Culqi = window.Culqi;
      Culqi.publicKey = publicKey;
      Culqi.settings({
        currency: currency,
        amount: amount,
        order: order_id,
        xculqirsaid: 'de35e120-e297-4b96-97ef-10a43423ddec',
        rsapublickey: `-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDswQycch0x/7GZ0oFojkWCYv+g
        r5CyfBKXc3Izq+btIEMCrkDrIsz4Lnl5E3FSD7/htFn1oE84SaDKl5DgbNoev3pM
        C7MDDgdCFrHODOp7aXwjG8NaiCbiymyBglXyEN28hLvgHpvZmAn6KFo0lMGuKnz8
        HiuTfpBl6HpD6+02SQIDAQAB
        -----END PUBLIC KEY-----`,       
      });
      Culqi.options({
        lang: "auto",
        paymentMethods: {
          billetera: true,
          bancaMovil: true,
          agente: true,
          cuotealo: true,
        },
      });
      Culqi.init();
      setTimeout(() => {
        this.setState({
          isBtnDisabled: false,
        });
      }, 2000);
      window.culqi = () => {
        if (
          Culqi.order &&
          Culqi.order.payment_code &&
          Culqi.order.payment_code !== null
        ) {
          this.setState({
            isBtnDisabled: false,
            isLoading: {
              ...this.state.isLoading,
              btnCip: false,
            },
            cipCode: Culqi.order.payment_code,
            textSuccess: { ...this.state.textSuccess, cip: "Códgio CIP" },
            isGenerate: {
              ...this.state.isGenerate,
              cip: true,
            },
          });
        } else {
          alert(
            `Hubo un error al generar el código CIP: \n ${
              Culqi.error.user_message ?? Culqi.error.merchant_message ?? ""
            }`
          );
        }
        if (this.state.isGenerate.cuotealo) {
          this.setState({
            isBtnDisabled: false,
            isLoading: {
              ...this.state.isLoading,
              btnCuotealo: false,
            },
            linkCouotealo:
              Culqi.order.cuotealo ?? "https://este-link-es-cuotealo.xyz",
            textSuccess: {
              ...this.state.textSuccess,
              cuotealo: "Link Cuotéalo",
            },
            isGenerate: { ...this.state.isGenerate, cuotealo: true },
          });
        }
      };
    }, 2000);
  }
  generateCipCode = async () => {
    this.setState({
      isBtnDisabled: true,
      isLoading: {
        ...this.state.isLoading,
        btnCip: true,
      },
    });
    const Culqi = window.Culqi;
    Culqi.validationPaymentMethods();
    const { available, generate, message } = Culqi.paymentOptionsAvailable.cip;
    if (available) {
      generate();
    } else {
      alert("Error al generar el código CIP: ", message);
    }
    this.setState({
      isBtnDisabled: false,
    });
  };

  logout() {
    localStorage.clear();
    window.location.reload();
  }

  generateLinkCuotealo = async () => {
    this.setState({
      isBtnDisabled: true,
      isLoading: {
        ...this.state.isLoading,
        btnCuotealo: true,
      },
      isGenerate: {
        ...this.state.isGenerate,
        cuotealo: true,
      },
    });
    const Culqi = window.Culqi;
    Culqi.validationPaymentMethods();
    const { available, generate, message } =
      Culqi.paymentOptionsAvailable.cuotealo;
    if (available) {
      generate();
    } else {
      alert(`Error al generar link cuotealo:  ${message}`);
    }
    this.setState({
      isGenerate: {
        isBtnDisabled: false,
        ...this.state.isGenerate,
        cuotealo: true,
      },
    });
  };
  render() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-700">
        <div className="relative w-2/5 h-full py-5 m-auto shadow-xl rounded-3xl bg-gray-50">
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
              <h1 className="text-3xl font-bold text-center text-gray-600 md:text-5xl">
                Confirmar Orden
              </h1>
            </div>
          </div>
          <div className="grid w-full grid-rows-2 gap-10 px-5 py-10 text-gray-800 bg-white border-t border-b border-gray-200">
            <ComponenteGenerate
              labelText="Crear código Cip"
              actionClick={this.generateCipCode}
              isLoading={this.state.isLoading.btnCip}
              btnText="Generar"
              btnTextLoading="Generando CIP"
              isGenerate={this.state.isGenerate.cip}
              textSuccess={this.state.textSuccess.cip}
              result={this.state.cipCode}
              isDisabled={this.state.isBtnDisabled}
            />
            <ComponenteGenerate
              labelText="Crear link Cuotéalo"
              actionClick={this.generateLinkCuotealo}
              isLoading={this.state.isLoading.btnCuotealo}
              btnText="Generar"
              btnTextLoading="Generando Link"
              isGenerate={this.state.isGenerate.cuotealo}
              textSuccess={this.state.textSuccess.cuotealo}
              result={this.state.linkCouotealo}
              isDisabled={this.state.isBtnDisabled}
            />
          </div>
        </div>
      </div>
    );
  }
}
