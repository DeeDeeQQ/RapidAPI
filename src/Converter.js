import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import axios from "axios";
import styled from "react-emotion";

const onSubmit = async values => {
  // Дима, это костыль или норм так оставить если мне не нужен onSubmit()?
};

class Converter extends Component {
  state = {
    currency: "UAH",
    apiData: undefined
  };
  getData() {
    return axios
      .get(
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,EOS,BCH,ZIL&tsyms=" +
          this.state.currency
      )
      .then(apiData => {
        this.setState({
          apiData: apiData.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  componentDidMount() {
    this.getData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currency !== this.state.currency) {
      this.getData();
    }
  }

  render() {
    return (
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <Forma onSubmit={handleSubmit}>
            <div>
              <Field name="currency" component="select">
                <option value="UAH">UAH</option> {/* UAH - just for myself*/}
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
              </Field>
              <OnChange name="currency">
                {value => {
                  this.setState({
                    currency: value
                  });
                }}
              </OnChange>
            </div>
            <Div>
              {this.state.apiData &&
                Object.entries(this.state.apiData).map(([key, test]) => (
                  <DivWithData key={key}>
                    <span>{key}</span>
                    <span>
                      {Object.values(test)} {Object.keys(test)}
                    </span>
                  </DivWithData>
                ))}
            </Div>
          </Forma>
        )}
      />
    );
  }
}

export default Converter;

const Forma = styled("form")`
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div {
    width: 100%;
  }
  & > div > select {
    margin-bottom: 15px;
    width: 50%;
  }
`;

const Div = styled("div")`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const DivWithData = styled("div")`
  display: flex;
  flex-direction: column;
`;
