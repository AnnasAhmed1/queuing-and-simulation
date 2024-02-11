import React, { useState, useEffect } from "react";
//
import RandomDataTab from "./Simulation/MM1Priority/RandomDataTabMM1";
import CalculatedDataTab from "./Simulation/MM1Priority/CalculatedDataTabMM1";
import GraphicalViewTab from "./Simulation/MM1Priority/GraphicalViewTabMM1";
import "./App.css";
import {
  generateRandomDataFunc,
  factorialIterative,
  calculateCalculatedDataPriority,
} from "./functions";

//

const SimulationMM1Priority = ({
  setMm1,
  mm1,
  arrivalMean,
  serviceMean,
  setArrivalMean,
  setServiceMean,
  onClick,
  // activeTab,
  // setActiveTab,
}) => {
  const [activeTab, setActiveTab] = useState("random");
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [probility, setProbabilty] = useState(0);

  // const [arrivalMean, setArrivalMean] = useState(0);
  // const [serviceMean, setServiceMean] = useState(0);
  //

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  // console.log("annas");

  useEffect(() => {
    // console.log("useEffect ch");
    //
    const arrivalMeanParam = arrivalMean;
    const serviceMeanParam = serviceMean;

    if (!isNaN(arrivalMeanParam) && !isNaN(serviceMeanParam)) {
      setArrivalMean(arrivalMeanParam);
      setServiceMean(serviceMeanParam);

      const data = generateRandomData(50, arrivalMeanParam, serviceMeanParam);
      setRandomData(data);

      const dummyData = [
        {
          customer: 1,
          interArrivalTime: 0,
          arrivalTime: 0,
          serviceTime: 1,
          priority: 2,
        },
        {
          customer: 2,
          interArrivalTime: 5,
          arrivalTime: 5,
          serviceTime: 1,
          priority: 2,
        },
        {
          customer: 3,
          interArrivalTime: 6,
          arrivalTime: 11,
          serviceTime: 10,
          priority: 1,
        },
        {
          customer: 4,
          interArrivalTime: 2,
          arrivalTime: 13,
          serviceTime: 1,
          priority: 2,
        },
        {
          customer: 5,
          interArrivalTime: 0,
          arrivalTime: 13,
          serviceTime: 4,
          priority: 3,
        },
        {
          customer: 6,
          interArrivalTime: 4,
          arrivalTime: 17,
          serviceTime: 6,
          priority: 1,
        },
        {
          customer: 7,
          interArrivalTime: 3,
          arrivalTime: 20,
          serviceTime: 1,
          priority: 1,
        },
        {
          customer: 8,
          interArrivalTime: 3,
          arrivalTime: 23,
          serviceTime: 2,
          priority: 2,
        },
      ];
      console.log(data, "ddd");
      console.log(dummyData, "ddd");
      const calculatedData = calculateCalculatedDataPriority(data);
      setCalculatedData(calculatedData);
    }
  }, [mm1]);

  const generatePriority = (Z) => {
    const a = 3;
    const b = 1;
    const A = 55;
    const M = 1194;
    const C = 9;
    const R = (A * Z + C) % M;
    const priority = Math.round((b - a) * (R / M) + a);
    return [priority, R];
  };
  const generateRandomData = (count, arrivalMean, serviceMean) => {
    const data = [];
    let arrivalTime = 0;
    let val = 0;
    let Z = 10112166;
    for (let i = 1; i <= count; i++) {
      let interArrivalTime = Math.round(generateRandomTime(arrivalMean));
      // interArrivalTime += 1;
      if (i == 1) {
        console.log("chk passs");
        interArrivalTime = 0;
      }
      const serviceTime = Math.round(generateRandomTime(serviceMean));

      const tempArr = generatePriority(Z);
      const priority = tempArr[0];
      Z = tempArr[1];
      arrivalTime += interArrivalTime;

      data?.push({
        customer: i,
        interArrivalTime: interArrivalTime,
        arrivalTime: arrivalTime,
        serviceTime: Math.max(1, Math.min(10, serviceTime)), // Ensure value is within 1 to 10 range
        priority,
      });

      const numerator = Math.exp(-arrivalMean) * Math.pow(arrivalMean, i - 1);
      const denominator = factorialIterative(i - 1);
      val = val + numerator / denominator;
      // console.log(data);
      if (val >= 0.99) {
        // break;
        return data.slice(0, -1);
        // return data;
      }
    }
    return data;
  };

  const generateRandomTime = (mean) => {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();
    // Calculate the time based on the mean
    const time = Math.round(-Math.log(1 - randomNumber) * mean);
    return time;
  };

  function createCustomer(customerData) {
    return {
      customerData: customerData,
    };
  }

  function allCustomersServed(customers) {
    for (let customer of customers) {
      if (
        customer.customerData.servedTime !== customer.customerData.serviceTime
      ) {
        return false;
      }
    }
    return true;
  }

  function simulate(customers) {
    let currentTime = 0;
    let completed = false;
    let test = 0;
    while (!completed) {
      let nextCustomer = null;
      test++;
      if (test > 40) {
        console.log("loop break");
        break;
      }
      for (let customer of customers) {
        if (
          customer.customerData.arrival <= currentTime &&
          customer.customerData.servedTime <
            customer.customerData.serviceTime &&
          (nextCustomer === null ||
            customer.customerData.priority < nextCustomer.customerData.priority)
        ) {
          nextCustomer = customer;
        }
      }

      if (nextCustomer !== null) {
        if (!nextCustomer.customerData.hasOwnProperty("startTime")) {
          nextCustomer.customerData.startTime = currentTime;
        }
        if (
          nextCustomer.customerData.priority === 1 &&
          nextCustomer.customerData.servedTime <
            nextCustomer.customerData.serviceTime
        ) {
          nextCustomer.customerData.servedTime +=
            nextCustomer.customerData.serviceTime;
          currentTime += nextCustomer.customerData.serviceTime;
          if (
            nextCustomer.customerData.servedTime ===
            nextCustomer.customerData.serviceTime
          ) {
            nextCustomer.customerData.endTime = currentTime;
          }
          continue;
        } else if (
          nextCustomer.customerData.priority === 2 &&
          nextCustomer.customerData.servedTime <
            nextCustomer.customerData.serviceTime
        ) {
          nextCustomer.customerData.servedTime++;
          currentTime++;
          if (
            nextCustomer.customerData.servedTime ===
            nextCustomer.customerData.serviceTime
          ) {
            nextCustomer.customerData.endTime = currentTime;
          }
          continue;
        } else if (
          nextCustomer.customerData.priority === 3 &&
          nextCustomer.customerData.servedTime <
            nextCustomer.customerData.serviceTime
        ) {
          nextCustomer.customerData.servedTime++;
          currentTime++;
          if (
            nextCustomer.customerData.servedTime ===
            nextCustomer.customerData.serviceTime
          ) {
            nextCustomer.customerData.endTime = currentTime;
          }
          continue;
        }
      }

      completed = allCustomersServed(customers);
      currentTime++;
    }

    return customers.map((customer) => customer.customerData);
  }

  function prioritySimulation(data) {
    let customers = data?.map((customerData) => createCustomer(customerData));
    return simulate(customers);
  }

  const calculateCalculatedData = (data) => {
    const calculatedData = [];
    data = data.map((obj) => ({
      ...obj,
      arrival: obj.arrivalTime,
      servedTime: 0,
    }));
    console.log(data, "data");
    if (data.length) {
      let result = prioritySimulation(data);
      let serverUtilizationTime = 0;
      let totalWaitTime = 0;
      let totalTurnaroundTime = 0;
      let finalData = [...result];
      for (let i = 0; i < finalData.length; i++) {
        const {
          customer,
          interArrivalTime,
          arrival,
          serviceTime,
          priority,
          startTime,
          endTime,
        } = finalData[i];
        const turnaroundTime = endTime - arrival;
        const waitTime = turnaroundTime - serviceTime;
        calculatedData.push({
          customer,
          priority,
          interArrivalTime,
          arrivalTime: arrival,
          serviceTime,
          startTime,
          endTime,
          waitTime: waitTime,
          turnaroundTime,
        });
        totalWaitTime += waitTime;
        totalTurnaroundTime += turnaroundTime;
        serverUtilizationTime += serviceTime;
      }
      const averageWaitTime = totalWaitTime / finalData.length;
      const averageTurnaroundTime = totalTurnaroundTime / finalData.length;
      const totalTime = Math.max(...finalData.map((item) => item.endTime));
      const serverUtilization = serverUtilizationTime / totalTime;
      const serverIdle = 1 - serverUtilization;
      return {
        calculatedData,
        averageWaitTime,
        averageTurnaroundTime,
        serverUtilization,
        serverIdle,
      };
    }
  };

  return (
    <div className="flex flex-col items-center w-full  min-h-screen">
      <div className="w-full max-w-3xl/ flex justify-center gap-10 my-6 px-24">
        <button
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 border-black dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:bg-blue-400 dark:focus:border-blue-500 hover:bg-black hover:bg-border-white hover:text-white transition-all duration-500 ${
            activeTab === "random" ? "active" : ""
          }`}
          onClick={() => handleTabChange("random")}
        >
          Random Data
        </button>
        <button
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 border-black dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:bg-blue-400 dark:focus:border-blue-500 hover:bg-black hover:bg-border-white hover:text-white transition-all duration-500 ${
            activeTab === "calculated" ? "active" : ""
          }`}
          onClick={() => handleTabChange("calculated")}
        >
          Calculated Data
        </button>
        <button
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 border-black dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:bg-blue-400 dark:focus:border-blue-500 hover:bg-black hover:bg-border-white hover:text-white transition-all duration-500 ${
            activeTab === "graphical" ? "active" : ""
          }`}
          onClick={() => handleTabChange("graphical")}
        >
          Graphical View
        </button>
        <button
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 border-black dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:bg-blue-400 dark:focus:border-blue-500 hover:bg-black hover:bg-border-white hover:text-white transition-all duration-500`}
          onClick={onClick}
        >
          Reset
        </button>
      </div>

      <div className="w-full ">
        {activeTab === "random" && <RandomDataTab randomData={randomData} />}
        {activeTab === "calculated" && (
          <CalculatedDataTab calculatedData={calculatedData} />
        )}
        {activeTab === "graphical" && (
          <GraphicalViewTab calculatedData={calculatedData} />
        )}
      </div>
    </div>
  );
};

export default SimulationMM1Priority;
