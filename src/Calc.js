import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import axios from "axios";

const onSubmit = value => {};

const Input = ({ input, meta, placeholder, type }) => (
  <div>
    <input {...input} placeholder={placeholder} type={type} />
  </div>
);

const Select = ({ input, options }) => (
  <div>
    <select {...input}>
      {options.map(value => (
        <option key={value.key} value={value.key}>
          {value.show}
        </option>
      ))}
    </select>
  </div>
);

class Calc extends Component {
  state = {
    quantity: 0,
    cryptCurrency: "BTC",
    currency: "UAH",
    reverse: false,
    apiData: undefined
  };

  getData(
    currency = this.state.currency,
    cryptCurrency = this.state.cryptCurrency
  ) {
    let request =
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" +
      cryptCurrency +
      "&tsyms=" +
      currency;
    return axios.get(request);
  }

  componentDidMount(currency, cryptCurrency) {
    this.getData(currency, cryptCurrency)
      .then(apiData => {
        let data = Object.values(apiData.data).map(value => {
          return Object.values(value);
        });
        this.setState({
          apiData: data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="quantity"
              component={Input}
              type="number"
              placeholder="0"
            />
            <OnChange name="quantity">
              {value => {
                this.setState({
                  quantity: value
                });
              }}
            </OnChange>
            <Field
              name="cryptCurrency"
              component={Select}
              options={[
                { key: "BTC", show: "Bitcoin" },
                { key: "ETH", show: "Ethereum" },
                { key: "EOS", show: "EOS" },
                { key: "BCH", show: "Bitcoin Cash" },
                { key: "ZIL", show: "Zilliqa" }
              ]}
            />
            <OnChange name="cryptCurrency">
              {value => {
                this.setState({
                  cryptCurrency: value
                });
                this.componentDidMount(this.state.currency, value);
              }}
            </OnChange>
            <button
              type="button"
              onClick={() => {
                this.setState({
                  reverse: !this.state.reverse
                });
              }}
            >
              тудаСюда разберем потом
            </button>
            <Field
              name="currency"
              component={Select}
              options={[
                { key: "UAH", show: "UAH" },
                { key: "USD", show: "USD" },
                { key: "EUR", show: "EUR" },
                { key: "RUB", show: "RUB" }
              ]}
            />
            <OnChange name="currency">
              {value => {
                this.setState({
                  currency: value
                });
                this.componentDidMount(value, this.state.cryptCurrency);
              }}
            </OnChange>
            <div id="result-left">
              {(!this.state.reverse &&
                `${this.state.quantity} ${this.state.cryptCurrency}`) ||
                `${this.state.quantity} ${this.state.currency}`}
            </div>
            <div id="result-center">=</div>
            <div id="result-right">
              {(!this.state.reverse &&
                `${this.state.apiData * this.state.quantity} ${
                  this.state.currency
                }`) ||
                `${this.state.quantity / this.state.apiData} ${
                  this.state.cryptCurrency
                }`}
            </div>
          </form>
        )}
      />
    );
  }
}

export default Calc;
