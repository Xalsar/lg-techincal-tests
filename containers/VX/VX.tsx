"use client";

import ParentSize from "@visx/responsive/lib/components/ParentSize";

// LAYOUT
import { Group } from "@visx/group";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { Line, LinePath } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";

// UTILS
import { ContinuousInput, scaleLinear } from "@visx/scale";
import { extent, bisector } from "d3-array";

// DATA
type DataItem = {
  country: string;
  currency: string;
  type: string;
  year: number;
  amount: number;
};

import { data } from "./data";

// TOOLTIP
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { GlyphCircle } from "@visx/glyph";
import { EventType } from "@visx/event/lib/types";

type CountryData = {
  country: string;
  currency: string;
  type: string;
  year: number;
  amount: number;
};

const LineChart = ({ width, height }: { width: number; height: number }) => {
  // LAYOUT
  const margin = { top: 40, right: 40, bottom: 50, left: 40 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // DATA
  const getRD = (d: CountryData) => d.amount;
  const getDate = (d: CountryData) => d.year;

  const xDomain: any = extent(data, getDate);

  const timeScale = scaleLinear({
    range: [0, innerWidth],
    domain: xDomain,
    nice: true,
  });

  const yDomain: any = extent(data, getRD);

  const rdScale = scaleLinear({
    range: [innerHeight, 0],
    domain: yDomain,
    nice: true,
  });

  const formatDate = (year: number) => year.toString();

  // DATA LINES
  const colors = ["#43b284", "#fab255"];

  const data1 = data.filter(function (el) {
    return el.type === "RENEWABLE";
  });

  const data2 = data.filter(function (el) {
    return el.type === "TOTAL";
  });

  const series = [data1, data2];

  // TOOLTIP

  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: "rgba(0,0,0,0.9)",
    color: "white",
  };

  const {
    tooltipData: x_tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const tooltipData: any = x_tooltipData;

  const getD = (year: number) => {
    const output = data.filter(function (el) {
      return el.year === year;
    });
    return output;
  };

  const bisectDate = bisector((d: DataItem) => d.year).left;

  const handleTooltip = (event: Element | EventType) => {
    const { x } = localPoint(event) || { x: 0 };

    const x0 = timeScale.invert(x - margin.left); // get Date from the scale

    const index = bisectDate(data, x0, 1); // get index of this date from the array

    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    // is previous data point available?
    if (d1 && getDate(d1)) {
      d =
        x0.valueOf() - getDate(d0).valueOf() >
        getDate(d1).valueOf() - x0.valueOf()
          ? d1
          : d0;
    }

    showTooltip({
      tooltipData: getD(d.year),
      tooltipLeft: x,
      tooltipTop: rdScale(getRD(d)),
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={"#718096"}
          rx={14}
        />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={rdScale}
            width={innerWidth}
            height={innerHeight - margin.top}
            stroke="#EDF2F7"
            strokeOpacity={0.2}
          />
          <GridColumns
            scale={timeScale}
            width={innerWidth}
            height={innerHeight}
            stroke="#EDF2F7"
            strokeOpacity={0.2}
          />
          <LinearGradient
            id="area-gradient"
            from={"#43b284"}
            to={"#43b284"}
            toOpacity={0.1}
          />
          <AxisLeft
            stroke={"#EDF2F7"}
            tickStroke={"#EDF2F7"}
            scale={rdScale}
            tickLabelProps={() => ({
              fill: "#EDF2F7",
              fontSize: 11,
              textAnchor: "end",
            })}
          />
          <text
            x="-125"
            y="20"
            transform="rotate(-90)"
            fontSize={12}
            fill="#EDF2F7"
          >
            R&D Spend, RDDUSD
          </text>
          <AxisBottom
            scale={timeScale}
            stroke={"#EDF2F7"}
            // tickFormat={formatDate}
            tickStroke={"#EDF2F7"}
            top={innerHeight}
            tickLabelProps={() => ({
              fill: "#EDF2F7",
              fontSize: 11,
              textAnchor: "middle",
            })}
          />
          {series.map((sData, i) => (
            <LinePath
              key={i}
              stroke={colors[i]}
              strokeWidth={3}
              data={sData}
              x={(d) => timeScale(getDate(d)) ?? 0}
              y={(d) => rdScale(getRD(d)) ?? 0}
            />
          ))}
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft - margin.left, y: 0 }}
                to={{ x: tooltipLeft - margin.left, y: innerHeight }}
                stroke={"#EDF2F7"}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="4,2"
              />
            </g>
          )}
          {tooltipData &&
            tooltipData.map((d: DataItem, i: number) => (
              <g key={i}>
                <GlyphCircle
                  left={tooltipLeft - margin.left}
                  top={rdScale(d.amount) + 2}
                  size={110}
                  fill={colors[i]}
                  stroke={"white"}
                  strokeWidth={2}
                />
              </g>
            ))}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            onTouchStart={handleTooltip}
            fill={"transparent"}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>
      </svg>
      {/* render a tooltip */}
      {tooltipData ? (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <p>{`Total Spend: $${getRD(tooltipData[1])}`}</p>
          <p>{`Renewable Spend: $${getRD(tooltipData[0])}`}</p>
          <p>{`Year: ${getDate(tooltipData[1])}`}</p>
        </TooltipWithBounds>
      ) : null}
    </div>
  );
};

const VX = () => {
  return (
    <div
      style={{
        height: "780px",
        width: "780px",
        margin: "0 auto",
      }}
    >
      <ParentSize>
        {({ width, height }) => <LineChart width={width} height={height} />}
      </ParentSize>
    </div>
  );
};

export default VX;
