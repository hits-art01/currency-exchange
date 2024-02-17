import React, { useEffect, useState } from "react";

import "./App.css";
import CurrentExchangeRate from "./components/translators/CurrentExangeRate/CurrentExchangeRate";
import ExchangeCrypto from "./components/translators/ExchangeCrypto/ExchangeCrypto";

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <header className="header">
          <div className="header__container _container">
            <div className="header__content">
              <div className="header__main-info">
                <div className="header__title">Currency Translator</div>
                <div className="header__text">by Artur Zadniprovskyi</div>
              </div>
            </div>
          </div>
        </header>
        <CurrentExchangeRate />
        <ExchangeCrypto />
      </div>
    </div>
  );
}

export default App;
