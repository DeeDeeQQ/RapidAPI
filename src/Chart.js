import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios/index";

class Chart extends Component {
  state = {
    data: undefined
  };

  getData() {
    let request =
      "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=31";
    return axios.get(request);
  }

  componentDidMount() {
    this.getData()
      .then(apiData => {
        let times = [];
        let data = apiData.data.Data.map(({ time, close, high, low, open }) => {
          let encodedTime = new Date(time * 1000).toLocaleDateString();
          times.push(encodedTime);
          return (high + low) / 2;
        });
        this.setState({
          data: {
            labels: times,
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
                data: data
              }
            ]
          }
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    return (
      <div>
        {this.state.data && (
          <Line
            data={this.state.data}
            width={100}
            height={30}
            options={{
              maintainAspectRatio: true
            }}
          />
        )}
      </div>
    );
  }
}

export default Chart;
