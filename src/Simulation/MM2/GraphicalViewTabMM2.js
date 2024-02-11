import React, { useEffect, useRef } from "react";
import "./GraphicalViewTabMM2.css";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
} from "recharts";

const GraphicalViewTabMM2 = ({
  calculatedData,
  finalServersData,
  systemIdlePercentage,
  systemUtilizationPercentage,
}) => {
  const server1GanttChartRef = useRef(null);
  const server2GanttChartRef = useRef(null);
  console.log(calculatedData);

  useEffect(() => {
    const animateGanttChart = (ganttChartRef, serverData) => {
      const ganttChart = ganttChartRef.current;
      const bars = ganttChart.querySelectorAll(".gantt-chart-bar");

      bars.forEach((bar, index) => {
        const { startTime, endTime, idle } = serverData[index];
        const barWidth = calculateBarWidth(startTime, endTime);

        bar.style.width = barWidth + "%";
        bar.style.animationDuration = `${barWidth * 2}s`;

        if (idle) {
          bar.classList.add("idle");
        }
      });
    };
    calculatedData?.finalServersData?.map((data, index) => {
      animateGanttChart(server1GanttChartRef, data?.serverData);
    });
  }, [calculatedData.server1Data, calculatedData.server2Data]);

  const calculateBarWidth = (startTime, endTime) => {
    const timeDifference = endTime - startTime;
    const currentTime = Date.now() - startTime;
    const barWidth = (currentTime / timeDifference) * 100;

    return Math.min(barWidth, 100);
  };

  return (
    <div className="">
      <h3 className="text-3xl  text-center  font-bold mb-10">Graphical View</h3>
      <div className="gantt-chart-container w-full flex flex-wrap">
        {calculatedData?.finalServersData?.map((data, index) => {
          return (
            <div className="server1-gantt-chart" key={index}>
              <h3 className="text-2xl  font-bold">
                Server {data.serverNumber}
              </h3>
              <div className="gantt-chart w-full" ref={server1GanttChartRef}>
                {data.serverData.map((data, index) => (
                  <div className="gantt-chart-bar" key={data.customer}>
                    <div className="gantt-chart-label">
                      <div className="start-time2">{data.startTime}</div>
                      <div className="end-time2">{data.endTime}</div>
                    </div>
                    <div className="customer-name">C {data.customer}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* <h4 className="text-2xl  text-center  font-bold my-4">Bar Chart</h4>
      <div className="flex flex-row space-x-10 justify-center flex flex-wrap">
        {calculatedData?.finalServersData?.map((data, index) => {
          return (
            <div className="graph-container" key={index}>
              <h4 className="">
                Customer vs. Wait Time (Server {data.serverNumber})
              </h4>
              <BarChart
                width={600}
                height={400}
                data={data.serverData.map((data) => ({
                  customer: data.customer,
                  waitTime: data.waitTime,
                }))}
              >
                <XAxis datsaKey="customer" />
                <YAxis />
                <CartesianGrid strokeDasharray="" />
                <Tooltip />
                <Legend />
                <Bar dataKey="waitTime" fill="#3356FF" />
              </BarChart>
            </div>
          );
        })}
      </div> */}
      <h4 className="text-2xl  text-center  font-bold my-4">Line Chart</h4>
      <h1 className="text-center font-bold text-3xl underline pb-1 my-10">
        Customer vs. Arrival Time
      </h1>

      <div className="flex flex-row space-x-10 justify-center flex flex-wrap">
        {calculatedData?.finalServersData?.map((data, index) => {
          return (
            <div className="graph-container" key={index}>
              {/* Line Chart - Customer vs. Arrival Time (Server 1) */}
              <h4 className="">
                Customer vs. Arrival Time (Server {data.serverNumber})
              </h4>
              <LineChart
                width={500}
                height={300}
                data={data.serverData.map((data) => ({
                  customer: data.customer,
                  arrivalTime: data.arrivalTime,
                }))}
              >
                <XAxis dataKey="customer" />
                <YAxis />
                <CartesianGrid strokeDasharray="" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="arrivalTime" stroke="#3356FF" />
              </LineChart>
            </div>
          );
        })}
      </div>
      <h1 className="text-center font-bold text-3xl underline pb-1 my-10">
        Customer vs. Wait Time
      </h1>
      <div className="flex flex-row space-x-10 justify-center flex flex-wrap">
        {calculatedData?.finalServersData?.map((data, index) => {
          return (
            <div className="graph-container" key={index}>
              {/* Line Chart - Customer vs. Arrival Time (Server 1) */}
              <h4 className="">
                Customer vs. Wait Time (Server {data.serverNumber})
              </h4>
              <LineChart
                width={500}
                height={300}
                data={data.serverData.map((data) => ({
                  customer: data.customer,
                  waitTime: data.waitTime,
                }))}
              >
                <XAxis dataKey="customer" />
                <YAxis />
                <CartesianGrid strokeDasharray="" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="waitTime" stroke="#3356FF" />
              </LineChart>
            </div>
          );
        })}
      </div>
      <h1 className="text-center font-bold text-3xl underline pb-1 my-10">
        Customer vs. TurnAround Time
      </h1>
      <div className="flex flex-row space-x-10 justify-center flex flex-wrap">
        {calculatedData?.finalServersData?.map((data, index) => {
          return (
            <div className="graph-container" key={index}>
              {/* Line Chart - Customer vs. Arrival Time (Server 1) */}
              <h4 className="">
                Customer vs. TurnAround Time (Server {data.serverNumber})
              </h4>
              <LineChart
                width={500}
                height={300}
                data={data.serverData.map((data) => ({
                  customer: data.customer,
                  turnaroundTime: data.turnaroundTime,
                }))}
              >
                <XAxis dataKey="customer" />
                <YAxis />
                <CartesianGrid strokeDasharray="" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="turnaroundTime"
                  stroke="#3356FF"
                />
              </LineChart>
            </div>
          );
        })}
      </div>
      <h1 className="text-center font-bold text-3xl underline pb-1 my-10">
        Customer vs. Service Time
      </h1>
      <div className="flex flex-row space-x-10 justify-center flex flex-wrap">
        {calculatedData?.finalServersData?.map((data, index) => {
          return (
            <div className="graph-container" key={index}>
              {/* Line Chart - Customer vs. Arrival Time (Server 1) */}
              <h4 className="">
                Customer vs. Service Time (Server {data.serverNumber})
              </h4>
              <LineChart
                width={500}
                height={300}
                data={data.serverData.map((data) => ({
                  customer: data.customer,
                  serviceTime: data.serviceTime,
                }))}
              >
                <XAxis dataKey="customer" />
                <YAxis />
                <CartesianGrid strokeDasharray="" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="serviceTime" stroke="#3356FF" />
              </LineChart>
            </div>
          );
        })}
      </div>
      <h1 className="text-center font-bold text-3xl underline pb-1 my-10">
        Arrival vs. Service Time
      </h1>
      <div className="flex flex-row space-x-10 justify-center flex flex-wrap">
        {calculatedData?.finalServersData?.map((data, index) => {
          return (
            <div className="graph-container" key={index}>
              {/* Line Chart - Customer vs. Arrival Time (Server 1) */}
              <h4 className="">
                Arrival vs. Service Time (Server {data.serverNumber})
              </h4>
              <LineChart
                width={500}
                height={300}
                data={data.serverData.map((data) => ({
                  customer: data.arrivalTime,
                  serviceTime: data.serviceTime,
                }))}
              >
                <XAxis dataKey="customer" />
                <YAxis />
                <CartesianGrid strokeDasharray="" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="serviceTime" stroke="#3356FF" />
              </LineChart>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GraphicalViewTabMM2;
