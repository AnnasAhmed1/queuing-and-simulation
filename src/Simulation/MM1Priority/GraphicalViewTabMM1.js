import React, { useEffect, useRef } from "react";
import "./GraphicalViewTabMM1.css";
import {
  Bar,
  LineChart,
  Line,
  Pie,
  BarChart,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar as StackedBar,
  Area,
} from "recharts";

const GraphicalViewTab = ({ calculatedData }) => {
  console.log(calculatedData);
  const ganttChartRef = useRef(null);
  const customerWaitTimeData = calculatedData.calculatedData.map((data) => ({
    customer: data.customer,
    waitTime: data.waitTime,
  }));

  const customerArrivalTimeData = calculatedData.calculatedData.map((data) => ({
    customer: data.customer,
    arrivalTime: data.arrivalTime,
  }));

  const customerDistributionData = calculatedData.calculatedData.map(
    (data) => ({
      customer: data.customer,
    })
  );

  const stackedBarChartData = calculatedData.calculatedData.map((data) => ({
    customer: data.customer,
    serviceTime: data.serviceTime,
    waitTime: data.waitTime,
  }));

  const serverUtilizationData = {
    utilization: calculatedData.serverUtilization,
    idleTime: calculatedData.serverIdle,
  };

  console.log(serverUtilizationData);
  return (
    <div>
      <h3 className="text-3xl  text-center  font-bold mb-10">Graphical View</h3>
      <h4 className="text-2xl  text-center  font-bold mb-4">Gantt Chart</h4>

      <div className="flex justify-between items-center mx-6">
        <h3 className="text-xl  font-bold">Server 1</h3>
        <div className="flex">
          <div className=" py-1 px-3 flex justify-center items-center text-white bg-red-600">
            lowest priority
          </div>
          <div className=" py-1 px-3 flex justify-center items-center text-white bg-blue-600">
            moderate priority
          </div>
          <div className=" py-1 px-3 flex justify-center items-center text-white bg-green-600">
            highest priority
          </div>
        </div>
      </div>
      <div className="gantt-chart" ref={ganttChartRef}>
        {calculatedData.calculatedData.map((data, index) => (
          <div
            className={`gantt-chart-bar ${
              data?.priority === 1 ? "p1" : data?.priority === 2 ? "p2" : null
            }`}
            key={data.customer}
          >
            <div className="gantt-chart-label">
              <div className="start-time text-black">{data.startTime}</div>
              <div className="end-time">{data.endTime}</div>
            </div>
            <div className="customer-name">C {data.customer}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-row space-x-10  justify-center">
        {/* Bar Chart - Customer vs. Wait Time */}
        <div className="graph-container">
          <h4 className="text-2xl  text-center  font-bold my-4">Bar Chart</h4>
          <h4 className="">Customer vs. Wait Time</h4>
          <BarChart width={600} height={400} data={customerWaitTimeData}>
            <XAxis dataKey="customer" />
            <YAxis />
            <CartesianGrid strokeDasharray="" />
            <Tooltip />
            <Legend />
            <Bar dataKey="waitTime" fill="#3356FF" />
          </BarChart>
        </div>
        {/* Line Chart - Customer vs. Arrival Time */}
        <div className="graph-container">
          <h4 className="text-2xl  text-center  font-bold my-4">Line Chart</h4>
          <h4 className="">Customer vs. Arrival Time</h4>
          <LineChart width={600} height={400} data={customerArrivalTimeData}>
            <XAxis dataKey="customer" />
            <YAxis />
            <CartesianGrid strokeDasharray="" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="arrivalTime" stroke="#3356FF" />
          </LineChart>
        </div>
      </div>

      {/* Pie Chart - Customer Distribution */}
      <div className="flex flex-row space-x-10  justify-center">
        {/* Stacked Bar Chart - Customer vs. Service Time and Wait Time */}
        <div className="graph-container">
          <h4 className="text-2xl  text-center  font-bold my-4">
            Stacked Bar Chart
          </h4>
          <h4 className="">Customer vs. Service Time and Wait Time</h4>
          <BarChart width={600} height={400} data={stackedBarChartData}>
            <XAxis dataKey="customer" />
            <YAxis />
            <CartesianGrid strokeDasharray="" />
            <Tooltip />
            <Legend />
            <StackedBar dataKey="serviceTime" stackId="a" fill="#3356FF" />
            <StackedBar dataKey="waitTime" stackId="a" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Pie Chart - Server Utilization and Server Idle Time */}
        <div className="graph-container">
          <h4 className="text-2xl text-center  font-bold my-4">Pie Chart</h4>
          <h4 className="">Server Utilization and Server Idle Time</h4>
          <PieChart width={600} height={400}>
            <Pie
              data={[
                {
                  name: "Utilization",
                  value: serverUtilizationData.utilization,
                },
                { name: "Idle Time", value: serverUtilizationData.idleTime },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              <Cell key="utilization" fill="#82ca9d" />
              <Cell key="idleTime" fill="#ff0000" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default GraphicalViewTab;
