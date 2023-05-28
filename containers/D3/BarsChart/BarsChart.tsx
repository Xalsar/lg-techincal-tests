"use client";

import * as d3 from "d3";

import { useEffect } from "react";

import classes from "./BarsChart.module.scss";

import JSONdata from "./data.json";

const margin = { top: 20, right: 30, bottom: 55, left: 70 };

const BarsChart = () => {
  useEffect(() => {
    const width = document.querySelector("body")!.clientWidth;
    const height = 400;

    // CONTAINER
    const container = d3.select("#chart-test-001");

    // SCALES
    const x_scale = d3
      .scaleBand()
      .domain(JSONdata.map((data) => data.firstName + " " + data.lastName))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    const y_scale = d3
      .scaleLinear()
      .domain([0, Number(d3.max(JSONdata, (d) => d.age))])
      .range([height - margin.bottom, margin.top]);

    // AXIS
    const x_axis = d3.axisBottom(x_scale);
    const y_axis = d3.axisLeft(y_scale);

    // CONTAINER
    container
      .attr("viewBox", [0, 0, width, height + 200])
      .classed(classes.container, true)
      // SELECT THE BARS
      .selectAll(classes.bar)
      .data(JSONdata)
      .join("rect")
      .classed(classes.bar, true)
      .attr("width", x_scale.bandwidth())
      .attr("height", (data) => height - y_scale(data.age) - 55)
      .attr("x", (data) =>
        String(x_scale(data.firstName + " " + data.lastName))
      )
      .attr("y", (data) => y_scale(data.age));

    // append x axis
    container
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(x_axis)
      .selectAll("text") // everything from this point is optional
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // add y axis
    container
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(y_axis);
  }, []);

  return (
    <>
      <svg id="chart-test-001"></svg>
    </>
  );
};

export default BarsChart;
