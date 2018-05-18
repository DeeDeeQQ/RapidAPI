import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import axios from "axios";
import styled, { css } from "react-emotion";

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
    apiData: undefined,
    orderLeft: 2,
    orderRight: 4
  };

  getData = () => {
    return axios
      .get(
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" +
          this.state.cryptCurrency +
          "&tsyms=" +
          this.state.currency
      )
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
  };

  componentWillMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.cryptCurrency !== this.state.cryptCurrency ||
      prevState.currency !== this.state.currency
    ) {
      this.getData();
    }
  }

  render() {
    return (
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <Forma onSubmit={handleSubmit}>
            <SelectDiv
              orderLeft={this.state.orderLeft}
              orderRight={this.state.orderRight}
            >
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
                }}
              </OnChange>
              <button
                type="button"
                onClick={() => {
                  let right = 4;
                  let left = 2;
                  if (this.state.orderRight === 2) {
                    right = 2;
                    left = 4;
                  }
                  this.setState({
                    orderLeft: right,
                    orderRight: left,
                    reverse: !this.state.reverse
                  });
                }}
              >
                ⇄
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
                }}
              </OnChange>
            </SelectDiv>
            <OutputDiv>
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
            </OutputDiv>
          </Forma>
        )}
      />
    );
  }
}

export default Calc;

const Forma = styled("form")`
  border: 1px solid black;
  margin: 50px auto;
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const dynamicRight = props =>
  css`
    order: ${props.orderRight};
  `;

const dynamicLeft = props =>
  css`
    order: ${props.orderLeft};
  `;

const SelectDiv = styled("div")`
  margin: 40px;
  display: flex;
  align-items: center;
  & > div > input {
    width: 52px;
  }
  & > div {
    margin: 0 10px;
  }

  & > button {
    margin: 0 10px;
  }

  & :nth-child(1) {
    order: 1;
  }
  & :nth-child(2) {
    & :nth-child(1) {
      width: 70px;
      height: 22px;
    }
    ${dynamicRight};
  }
  & :nth-child(3) {
    order: 3;
  }
  & :nth-child(4) {
    & :nth-child(1) {
      width: 70px;
      height: 22px;
    }
    ${dynamicLeft};
  }
`;

const OutputDiv = styled("div")`
  margin-bottom: 40px;
  display: flex;
  width: 60%;
  justify-content: space-around;
`;
