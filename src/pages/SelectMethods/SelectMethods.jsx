import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders } from 'utils/checkout'
import { formatOrderNumber } from 'utils/common/padToZeros';
import ButtonLoader from 'components/Atoms/ButtonLoading';
import { createOrder } from 'utils/checkout'

const SelectMethods = () => {
  const [isLoadingCard, setLoadingCard] = useState(false);
  const [isLoadingOther, setLoadingOther] = useState(false);


  const currency = localStorage.getItem('currency');
  const amountFormat = () => {
    const amount = localStorage.getItem('amount') ? localStorage.getItem('amount').toString() : 21000;
    const decimal = amount.substring(amount.length - 2, amount.length);
    const _int = amount.substring(0, amount.length - 2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const currencyFormat = currency === 'PEN' ? 'S/' : '$';
    const format = `${currencyFormat} ${_int}.${decimal}`;

    const amountBase = `${_int}.${decimal}`.replace(',', '')
    const withIgv = amountBase * 1.18;
    const withOutIgv = withIgv / 1.18;
    const igv = withIgv - withOutIgv;

    return { currencyFormat, format, withOutIgv, withIgv, igv }
  }
  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  const actionClickButtonCard = () => {
    setLoadingCard(true);
    setTimeout(() => {
      setLoadingCard(false);
      window.location.href = '/payment-card';
    }, 200);
  }

  const actionClickButtonYape = () => {
    setLoadingCard(true);
    setTimeout(() => {
      setLoadingCard(false);
      window.location.href = '/payment-yape';
    }, 200);
  }


  const actionClickButtonOtherMethods = async () => {
    setLoadingOther(true);
    const sk = localStorage.getItem('secretKey')
    const response = await getAllOrders({ sk });

    if (!response.success) {
      setLoadingOther(false);
      alert('La llave privada ingresada no es correcta, \n por favor ingrese uno válido')
      localStorage.clear();
      window.location.href = '/';
    }
    let order_number = 'demo_test_checkout-00000000001'
    let subNumber = ''
    const r = /demo_test_checkout-[0-9]*/g;
    response.res.data.forEach(e => {
      if (e.order_number.match(r)) {
        if (e.order_number.substr(-11) > subNumber) {
          subNumber = e.order_number.substr(-11)
          order_number = e.order_number
        }
      }
    });
    localStorage.setItem('order_number', formatOrderNumber(order_number))

    const amount = localStorage.getItem('amount')
    const currency = localStorage.getItem('currency')
    const newOrder_number = localStorage.getItem('order_number')

    const postResponse = await createOrder({ amount: amount, currency: currency, order_number: newOrder_number, sk })
    console.log('postResponse: ', postResponse);
    if (postResponse.success) {
      setLoadingOther(false);
      localStorage.setItem('order_id', postResponse.res.id)
      window.location.href = '/payment-cip';
      return;
    }
    setLoadingOther(false);
    alert(`Hugo un error \n ${postResponse.res.merchant_message}`);
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-slate-700' >
      <div className="relative w-4/5 h-full py-5 m-auto shadow-xl rounded-3xl bg-gray-50">
        <div className="px-5">
          <div className="flex items-center justify-between mb-2">
            <Link className='px-3 relative py-2 ml-2 font-semibold text-white bg-indigo-500 rounded-tr-lg rounded-br-lg hover:bg-indigo-700 hover:before:border-r-indigo-700 focus:bg-indigo-700 before:content-[""] before:absolute before:top-0 before:-left-2 before:h-full before:border-r-indigo-500 before:border-r-8 before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent' to='/'>
              Back</Link>
            <button onClick={logout} className='px-3 relative py-2 ml-2 font-semibold text-white bg-indigo-500 rounded-tl-lg rounded-bl-lg hover:bg-indigo-700 hover:before:border-r-indigo-700 focus:bg-indigo-700 before:content-[""] before:absolute before:top-0 before:-right-2 before:h-full before:border-l-indigo-500 before:border-l-8 before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent' to='/select-methods'>
              Cerrar</button>
          </div>
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-600 md:text-5xl">Checkout</h1>
          </div>
        </div>
        <div className="w-full px-5 py-10 text-gray-800 bg-white border-t border-b border-gray-200">
          <div className="w-full">
            <div className="items-start -mx-3 md:flex">
              <div className="px-3 md:w-7/12 lg:pr-10">
                <div className="w-full pb-6 mx-auto mb-6 font-light text-gray-800 border-b border-gray-200">
                  <div className="flex items-center w-full">
                    <div className="w-16 h-16 overflow-hidden border border-gray-200 rounded-lg bg-gray-50">
                      <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80" alt="" />
                    </div>
                    <div className="flex-grow pl-3">
                      <h6 className="font-semibold text-gray-600 uppercase">Gafas de sol Ray Ban</h6>
                      <p className="text-gray-400">x 1</p>
                    </div>
                    <div>
                      <span className="text-xl font-semibold text-gray-600">{amountFormat().format}</span><span className="text-sm font-semibold text-gray-600">.00</span>
                    </div>
                  </div>
                </div>
                <div className="pb-6 mb-6 text-gray-800 border-b border-gray-200">
                  <div className="flex items-center w-full mb-3">
                    <div className="flex-grow">
                      <span className="text-gray-600">Subtotal</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">{amountFormat().currencyFormat + amountFormat().withOutIgv}</span>
                    </div>
                  </div>
                  <div className="flex items-center w-full">
                    <div className="flex-grow">
                      <span className="text-gray-600">IGV</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">{amountFormat().currencyFormat + amountFormat().igv}</span>
                    </div>
                  </div>
                </div>
                <div className="pb-6 mb-6 text-xl text-gray-800 border-b border-gray-200 md:border-none">
                  <div className="flex items-center w-full">
                    <div className="flex-grow">
                      <span className="text-gray-600">Total</span>
                    </div>
                    <div className="pl-3">
                      <span className="text-sm font-semibold text-gray-400">{currency} </span> <span className="font-semibold">{amountFormat().format}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 md:w-5/12">
                <div className="w-full p-3 mx-auto mb-6 font-light text-gray-800 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center w-full mb-3">
                    <div className="w-32">
                      <span className="font-semibold text-gray-600">Contact</span>
                    </div>
                    <div className="flex-grow pl-3">
                      <span>Scott Windon</span>
                    </div>
                  </div>
                  <div className="flex items-center w-full">
                    <div className="w-32">
                      <span className="font-semibold text-gray-600">Billing Address</span>
                    </div>
                    <div className="flex-grow pl-3">
                      <span>123 George Street, Sydney, NSW 2000 Australia</span>
                    </div>
                  </div>
                </div>
                <div className="w-full mx-auto mb-6 font-light text-gray-800 bg-white border border-gray-200 rounded-lg">
                  <div className="w-full p-3 border-b border-gray-200">
                    <div className="mb-5">
                      <span htmlFor="type1" className="flex items-center font-bold text-black cursor-pointer">
                        Métodos de pago
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between w-3/5 mb-3">
                        <span className="mb-2 ml-1 text-sm font-semibold text-gray-600">Pagar con Tarjeta</span>
                        <div>
                          <ButtonLoader onClickButton={actionClickButtonCard} isLoading={isLoadingCard} text='Pagar' textLoading='Pagar' />
                        </div>
                      </div>
                      <div className="flex justify-between w-3/5 mb-3">
                        <span className="mb-2 ml-1 text-sm font-semibold text-gray-600">Pagar con Yape</span>
                        <div>
                          <ButtonLoader onClickButton={actionClickButtonYape} isLoading={isLoadingCard} text='Pagar' textLoading='Pagar' />
                        </div>
                      </div>
                      <div className="flex justify-between w-3/5 mb-3">
                        <span className="mb-2 ml-1 text-sm font-semibold text-gray-600">Pagar con otro método de pago</span>
                        <div>
                          <ButtonLoader onClickButton={actionClickButtonOtherMethods} isLoading={isLoadingOther} text='Pagar' textLoading='Pagar' />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectMethods;
