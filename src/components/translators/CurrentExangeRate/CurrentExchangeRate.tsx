import React, { FC, useEffect, useRef, useState } from "react";
import "../translators.scss";
import { mainCurrencies } from "../../../currency";

const CurrentExchangeRate: FC = () => {
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

  async function getCurrenciesData(currency1: string, currency2: string) {
    const req = await fetch(
      `https://v6.exchangerate-api.com/v6/8f081904f924d02aa815c558/pair/${currency1}/${currency2}`
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
    // calls a function with parameters before changing them
    getCurrenciesData(selectValue.secondCurrency, selectValue.firstCurrency);
  };

  const handleClick = () => {
    getCurrenciesData(selectValue.firstCurrency, selectValue.secondCurrency);
  };

  useEffect(() => {}, [currenciesData]);

  return (
    <div className="translator">
      <div className="translator__container _container">
        <div className="translator__title">
          <h2>Exchange Rate</h2>
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
                  {mainCurrencies.map((currencyOption) => (
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
                  {mainCurrencies.map((currencyOption) => (
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
                {currenciesData.conversion_rate ? (
                  <h3>
                    {(+inputValue * currenciesData.conversion_rate).toFixed(4)}
                    <br />
                    {currenciesData.target_code}
                  </h3>
                ) : null}
              </div>
              {currenciesData.conversion_rate ? (
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

export default CurrentExchangeRate;
