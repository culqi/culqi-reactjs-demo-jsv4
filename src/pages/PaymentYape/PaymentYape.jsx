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

export default class PaymentYape extends Component {
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
      const { publicKey, xculqirsaid, rsapublickey, amount, currency, order_id } = localStorage;
      console.log(rsapublickey);  
      this.setState({
        pk: publicKey,
        order_id: order_id,
      });

      const Culqi = window.Culqi;
      Culqi.publicKey = publicKey;
      if(xculqirsaid == '' || rsapublickey == '')
      {
        Culqi.settings({
          currency: currency,
          amount: amount,
          order: order_id            
        });
      }
      else{
        Culqi.settings({
          currency: currency,
          amount: amount,
          order: order_id,
          xculqirsaid: xculqirsaid,
          rsapublickey: rsapublickey,       
        });
      }  
     
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
          Culqi.token 
        ) {
          this.setState({
            isBtnDisabled: false,
            isLoading: {
              ...this.state.isLoading,
              btnCip: false,
            },          
            textSuccess: { ...this.state.textSuccess, cip: "Códgio CIP" },
            isGenerate: {
              ...this.state.isGenerate,
              cip: true,
            },
          });
          console.log("Yape Generado", Culqi.token.id)
          alert(
            `Yape Generado: \n ${
              Culqi.token.id
            }`
          );
        } else {
          alert(
            `Hubo un error al generar el token: \n ${
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
  generateYapeCode = async () => {
    this.setState({
      isBtnDisabled: true,
      isLoading: {
        ...this.state.isLoading,
        btnCip: true,
      },
    });
    const Culqi = window.Culqi;
    Culqi.validationPaymentMethods();
    const { available, generate, message } = Culqi.paymentOptionsAvailable.yape;
    if (available) {
      console.log("Se genero el codigo Yape");
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
          </div>
          <div className="m-auto w-80">
            <div className="grid items-center h-auto grid-cols-1 gap-8 py-10 place-content-center">
            <form>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ marginRight: '10px' }}>
                  <span>Teléfono: </span>
                  <input type="text" size="9" data-culqi="yape[phone]" id="yape[phone]" />
                </label>
                <label>
                  <span>Código: </span>
                  <input type="text" size="6" data-culqi="yape[code]" id="yape[code]" />
                </label>
              </div>
            </form>
            <button id="btn_pagar" onClick={this.generateYapeCode}>Pagar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
