"use client";

import * as d3 from "d3";

import { useEffect } from "react";

import classes from "./Test001.module.scss";

const DUMMY_DATA = [
  { id: 1, value: 10, region: "USA" },
  { id: 2, value: 11, region: "India" },
  { id: 3, value: 12, region: "Taiwan" },
  { id: 4, value: 6, region: "Lichtenstein" },
];

const Test001 = () => {
  useEffect(() => {
    const xScale = d3
      .scaleBand()
      .domain(DUMMY_DATA.map((data) => data.region))
      .rangeRound([0, 250])
      .padding(0.1);
    const yScale = d3.scaleLinear().domain([0, 15]).range([200, 0]);

    d3.select("#chart-test-001")
      .classed(classes.container, true)
      .selectAll(classes.bar)
      .data(DUMMY_DATA)
      .enter()
      .append("rect")
      .classed(classes.bar, true)
      .attr("width", xScale.bandwidth())
      .attr("height", (data) => 200 - yScale(data.value))
      .attr("x", (data) => xScale(data.region))
      .attr("y", (data) => yScale(data.value));
  }, []);

  return (
    <>
      <svg id="chart-test-001"></svg>
    </>
  );
};

export default Test001;
