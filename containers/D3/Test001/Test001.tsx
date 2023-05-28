"use client";

import * as d3 from "d3";

import { useEffect } from "react";

import classes from "./Test001.module.scss";

const DUMMY_DATA = [
  { id: 1, value: 10, region: "USA" },
  { id: 2, value: 11, region: "India" },
  { id: 3, value: 12, region: "Taiwan" },
  { id: 4, value: 6, region: "Lichtenstein" },
  { id: 5, value: 4, region: "Spain" },
  { id: 6, value: 9, region: "Portugal" },
  { id: 7, value: 3, region: "Japan" },
  { id: 8, value: 10, region: "Korea" },
  { id: 9, value: 3, region: "China" },
];

const width = 800;
const height = 400;

const margin = { top: 20, right: 30, bottom: 55, left: 70 };

const Test001 = () => {
  useEffect(() => {
    const xScale = d3
      .scaleBand()
      .domain(DUMMY_DATA.map((data) => data.region))
      .range([0, width])
      .padding(0.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, Number(d3.max(DUMMY_DATA, (d) => d.value))])
      .range([height, 0]);

    const container = d3.select("#chart-test-001");

    container
      .attr("width", width)
      .attr("height", height)
      .classed(classes.container, true)
      // SELECT THE BARS
      .selectAll(classes.bar)
      .data(DUMMY_DATA)
      .join("rect")
      .classed(classes.bar, true)
      .attr("width", xScale.bandwidth())
      .attr("height", (data) => height - yScale(data.value))
      .attr("x", (data) => String(xScale(data.region)))
      .attr("y", (data) => yScale(data.value));
  }, []);

  return (
    <>
      <svg id="chart-test-001"></svg>
    </>
  );
};

export default Test001;
