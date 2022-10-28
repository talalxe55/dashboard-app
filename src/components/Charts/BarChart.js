import React, { Component, useState, useEffect } from "react";
import Card from "components/Card/Card";
import Chart from "react-apexcharts";
import { barChartData, barChartOptions } from "variables/charts";

const BarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  useEffect(() => {
    setChartData(barChartData);
    setChartOptions(barChartOptions);
  }, []);
  return (
    <Card
      py="1rem"
      height={{
        sm: "200px",
      }}
      width="100%"
      bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
      position="relative"
    >
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    </Card>
  );
};

export default BarChart;
