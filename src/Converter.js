import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import axios from "axios";

const onSubmit = async values => {
  // Дима, это костыль или норм так оставить если мне не нужен onSubmit()?
};

class Converter extends Component {
  state = {
    apiData: undefined
  };
  getData(currency = "UAH") {
    let request =
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,EOS,BCH,ZIL&tsyms=" +
      currency;
    return axios.get(request);
  }

  componentDidMount(value) {
    this.getData(value)
      .then(apiData => {
        this.setState({
          apiData: apiData.data
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
            <div>
              <Field name="currency" component="select">
                <option value="UAH">UAH</option> {/* UAH - just for myself*/}
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
              </Field>
              <OnChange name="currency">
                {value => {
                  this.componentDidMount(value);
                }}
              </OnChange>
            </div>
            <div>
              {this.state.apiData &&
                Object.entries(this.state.apiData).map(([key, test]) => (
                  <div key={key}>
                    {key} => {Object.values(test)} {Object.keys(test)}
                  </div>
                ))}
            </div>
          </form>
        )}
      />
    );
  }
}

export default Converter;
