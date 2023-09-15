import React from 'react'
import * as views from './pages/index'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

const App = () => {

  const pkExist = localStorage.getItem('publicKey');
  const order_id = localStorage.getItem('order_id');

  // }
  return (
    <BrowserRouter>
      <div className='w-full h-full'>
        <Switch>
          <Route exact path="/" component={views.Home} />

          <Route
            path="/select-methods"
            render={() => { return pkExist ? <views.SelectMethods /> : <Redirect to='/' /> }}
          />
          <Route
            path="/payment-card"
            render={() => { return pkExist ? <views.PaymentCard /> : <Redirect to='/' /> }}
          />
          <Route
            path="/payment-cip"
            render={() => { return pkExist && order_id ? <views.PaymentCip /> : <Redirect to='/' /> }}
          />
        </Switch>
      </div>
    </BrowserRouter>

  )
}

export default App;
