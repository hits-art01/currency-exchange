import React, { FC, useEffect, useRef, useState } from "react";
import "../translators.scss";
import { cryptoCurrencies } from "../../../currency";

const ExchangeCrypto: FC = () => {
  interface SelectType {
    firstCurrency: string;
    secondCurrency: string;
  }

  const [currenciesData, setCurenciesData] = useState<any>([]);
  const [selectValue, setSelectValue] = useState<SelectType>({
    firstCurrency: "",
    secondCurrency: "",
  });
  const [inputValue, setInputValue] = useState<string>("");
  const [exchangeResult, setExchangeResult] = useState<number>(0);
  const [resultCode, setResultCode] = useState<string>();
  const selectRef1 = useRef<HTMLSelectElement | null>(null);
  const selectRef2 = useRef<HTMLSelectElement | null>(null);

  const handleFirstCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setSelectValue((prev) => ({ ...prev, firstCurrency: value }));
  };

  const handleSecondCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setSelectValue((prev) => ({ ...prev, secondCurrency: value }));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const isButtonDisabled =
    !selectValue.firstCurrency || !selectValue.secondCurrency || !inputValue;

  const calculateExchangeResult = () => {
    if (
      currenciesData.Data &&
      currenciesData.Data[selectValue.firstCurrency] &&
      currenciesData.Data[selectValue.secondCurrency]
    ) {
      const priceInUSD1 =
        currenciesData.Data[selectValue.firstCurrency].Price.USD;
      const priceInUSD2 =
        currenciesData.Data[selectValue.secondCurrency].Price.USD;

      const exchangeResult = (+inputValue * priceInUSD1) / priceInUSD2;

      setExchangeResult(exchangeResult);
    }
  };

  async function getCurrenciesData(currency1: string, currency2: string) {
    const req = await fetch(
      `https://min-api.cryptocompare.com/data/blockchain/mining/calculator?fsyms=${currency1},${currency2}&tsyms=USD`
    );
    const res = await req.json();
    setCurenciesData(res);
  }

  const handleSwap = () => {
    setSelectValue((prev) => ({
      firstCurrency: prev.secondCurrency,
      secondCurrency: prev.firstCurrency,
    }));
    if (selectRef1.current) {
      selectRef1.current.value = selectValue.secondCurrency;
    }
    if (selectRef2.current) {
      selectRef2.current.value = selectValue.firstCurrency;
    }
    getCurrenciesData(selectValue.firstCurrency, selectValue.secondCurrency);
    calculateExchangeResult();
    setResultCode(selectValue.firstCurrency);
  };

  const handleClick = async () => {
    await getCurrenciesData(
      selectValue.firstCurrency,
      selectValue.secondCurrency
    );
    calculateExchangeResult();
    setResultCode(selectValue.secondCurrency);
  };

  useEffect(() => {
    calculateExchangeResult();
  }, [currenciesData]);

  return (
    <div className="translator">
      <div className="translator__container _container">
        <div className="translator__title">
          <h2>Crypto Exchange Rate</h2>
        </div>
        <div className="translator__row">
          <div className="translator__col">
            <div className="translator__item item">
              <div className="item__title">From</div>
              <div className="item__select">
                <select
                  name="format"
                  id="format"
                  onChange={handleFirstCurrencyChange}
                  ref={selectRef1}
                >
                  <option selected disabled>
                    Choose a currency
                  </option>
                  {cryptoCurrencies.map((currencyOption) => (
                    <option
                      key={currencyOption.currency}
                      value={currencyOption.currency}
                    >
                      {`${currencyOption.currency} (${currencyOption.title})`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="item__input">
                <input
                  type="number"
                  value={inputValue}
                  onChange={handleAmountChange}
                  placeholder="please enter the amount"
                />
              </div>
            </div>
          </div>
          <div className="translator__col">
            <div className="translator__item item">
              <div className="item__title">To</div>
              <div className="item__select">
                <select
                  name="format"
                  id="format"
                  onChange={handleSecondCurrencyChange}
                  ref={selectRef2}
                >
                  <option selected disabled>
                    Choose a currency
                  </option>
                  {cryptoCurrencies.map((currencyOption) => (
                    <option
                      key={currencyOption.currency}
                      value={currencyOption.currency}
                    >
                      {`${currencyOption.currency} (${currencyOption.title})`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="item__btn">
                <button
                  className={
                    inputValue &&
                    selectValue.firstCurrency &&
                    selectValue.secondCurrency
                      ? "able"
                      : "disable"
                  }
                  disabled={isButtonDisabled}
                  onClick={handleClick}
                >
                  Count
                </button>
              </div>
            </div>
          </div>
          <div className="translator__col" style={{ borderRight: "none" }}>
            <div className="translator__item item">
              <div className="item__title">Result</div>
              <div className="item__title">
                {exchangeResult !== 0 ? (
                  <h3>
                    {exchangeResult.toFixed(4)}
                    <br />
                    {resultCode}
                  </h3>
                ) : null}
              </div>
              {exchangeResult !== 0 ? (
                <div className="item__btn">
                  <button
                    className={
                      selectValue.firstCurrency && selectValue.secondCurrency
                        ? "able"
                        : "disable"
                    }
                    disabled={isButtonDisabled}
                    onClick={handleSwap}
                  >
                    Reverse
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeCrypto;
