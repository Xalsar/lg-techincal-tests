"use client";

import { useEffect } from "react";

import * as d3 from "d3";

const svgId = "map-d3";

const Map = () => {
  useEffect(() => {
    const width = document.querySelector("body")!.clientWidth;
    const height = 500;

    const svg = d3.select("#" + svgId).attr("viewBox", [0, 0, width, height]);

    const projection = d3.geoEquirectangular().center([0, 0]);
    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g");

    d3.json(
      "https://raw.githubusercontent.com/iamspruce/intro-d3/main/data/countries-110m.geojson"
    ).then((data: any) => {
      g.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", (val: any) => pathGenerator(val));
    });
  }, []);

  return <svg id={svgId} />;
};

export default Map;
