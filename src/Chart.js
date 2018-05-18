import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios/index";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import styled from "react-emotion";

const onSubmit = async values => {};

class Chart extends Component {
  state = {
    label: undefined,
    data: undefined,
    time: "DAY"
  };

  getData() {
    let request = "";
    switch (this.state.time) {
      case "DAY":
        request =
          "https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=24";
        break;
      case "MOUNTH":
        request =
          "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=31";
        break;
      case "YEAR":
        request =
          "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=12&aggregate=30";
        break;
      default:
        console.log("Something goes wrong");
    }
    axios
      .get(request)
      .then(apiData => {
        let times = [];
        let data = apiData.data.Data.map(({ time, close, high, low, open }) => {
          let encodedTime = "";
          if (this.state.time === "DAY") {
            encodedTime = new Date(time * 1000).toLocaleTimeString();
            times.push(encodedTime);
          } else {
            encodedTime = new Date(time * 1000).toLocaleDateString();
            times.push(encodedTime);
          }
          return (high + low) / 2;
        });
        this.setState({
          label: times,
          data: data
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
    if (prevState.time !== this.state.time) {
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
              <Field name="time" component="select">
                <option value="DAY">DAY</option>
                <option value="MOUNTH">MOUNTH</option>
                <option value="YEAR">YEAR</option>
              </Field>
              <OnChange name="time">
                {time => {
                  this.setState({
                    time: time
                  });
                }}
              </OnChange>
            </div>
            <div>
              {this.state.data && (
                <Line
                  width={90}
                  height={30}
                  data={{
                    labels: this.state.label,
                    datasets: [
                      {
                        label: "BTC",
                        fill: true,
                        lineTension: 0.05,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 3,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.state.data
                      }
                    ]
                  }}
                  options={{
                    position: "right",
                    maintainAspectRatio: true
                  }}
                />
              )}
            </div>
          </Forma>
        )}
      />
    );
  }
}

export default Chart;

const Forma = styled("form")`
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div {
    width: 80%;
  }
  & > div > select {
    margin-bottom: 15px;
    width: 50%;
  }
`;
