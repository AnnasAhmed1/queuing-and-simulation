import React, { useState, useEffect } from "react";
import RandomDataTab from "./Simulation/MM2/RandomDataTabMM2";
import CalculatedDataTab from "./Simulation/MM2/CalculatedDataTabMM2";
import GraphicalViewTab from "./Simulation/MM2/GraphicalViewTabMM2";
import { factorialIterative } from "./App";

const SimulationMM2 = ({
  setMm2,
  mm2,
  arrivalMean,
  serviceMean,
  setArrivalMean,
  setServiceMean,
  onClick,
}) => {
  const [activeTab, setActiveTab] = useState("random");
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(tab);
  };

  useEffect(() => {
    const arrivalMeanParam = arrivalMean;
    const serviceMeanParam = serviceMean;

    if (!isNaN(arrivalMeanParam) && !isNaN(serviceMeanParam)) {
      setArrivalMean(arrivalMeanParam);
      setServiceMean(serviceMeanParam);

      const data = generateRandomData(25, arrivalMeanParam, serviceMeanParam);
      setRandomData(data);

      const calculatedData = calculateCalculatedData(data);
      setCalculatedData(calculatedData);
    }
  }, [mm2]);

  // const generateRandomDataWithCumulativeFrequency = (mean) => {
  //   const data = [];
  //   let arrivalTime = 0;
  //   let cumulativeFrequency = 0;
  //   let x = 0;

  //   while (cumulativeFrequency < 1) {
  //     x++;
  //     const term = (Math.exp(-mean) * Math.pow(mean, x)) / factorialIterative(x);
  //     cumulativeFrequency += term;

  //     const interarrivalTime = x; // Use x as interarrival time
  //     arrivalTime += interarrivalTime;

  //     data.push({
  //       customer: x,
  //       interarrivalTime,
  //       arrivalTime: x === 1 ? 0 : arrivalTime,
  //       // You can also generate service time here if needed
  //     });
  //   }

  //   return data;
  // };

  // useEffect(() => {
  //   const arrivalMeanParam = arrivalMean;
  //   const serviceMeanParam = serviceMean;

  //   if (!isNaN(arrivalMeanParam) && !isNaN(serviceMeanParam)) {
  //     setArrivalMean(arrivalMeanParam);
  //     setServiceMean(serviceMeanParam);

  //     const data = generateRandomDataWithCumulativeFrequency(arrivalMeanParam);
  //     setRandomData(data);

  //     const calculatedData = calculateCalculatedData(data);
  //     setCalculatedData(calculatedData);
  //   }
  // }, [mm2]);

  const generateRandomData = (count, arrivalMean, serviceMean) => {
    const data = [];
    let arrivalTime = 0;
    let val = 0;
    for (let i = 1; i <= count; i++) {
      const interarrivalTime = Math.round(generateRandomTime(arrivalMean));
      const numerator = Math.exp(-arrivalMean) * Math.pow(arrivalMean, i - 1);
      const denominator = factorialIterative(i - 1);
      val = val + numerator / denominator;

      const serviceTime = Math.round(generateRandomTime(serviceMean));

      arrivalTime += interarrivalTime;

      data.push({
        customer: i,
        interarrivalTime,
        arrivalTime: i === 1 ? 0 : arrivalTime,
        serviceTime: Math.max(1, Math.min(10, serviceTime)), // Ensure value is within 1 to 10 range
      });
      if (val >= 0.9999) {
        // break;
        return data.slice(0, -1);
      }
    }

    return data;
  };

  const generateRandomTime = (mean) => {
    const randomNumber = Math.random();
    const time = Math.round(-Math.log(1 - randomNumber) * mean);
    return time;
  };
  const calculateCalculatedData = (data) => {
    const calculatedData = [];

    let server1Data = [];
    let server2Data = [];

    let endTime1 = 0;
    let endTime2 = 0;

    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;
    let totalResponseTime = 0;
    let totalServer1IdleTime = 0;
    let totalServer2IdleTime = 0;
    let totalServer1UtilizationTime = 0;
    let totalServer2UtilizationTime = 0;

    for (let i = 0; i < data.length; i++) {
      const { customer, interarrivalTime, arrivalTime, serviceTime } = data[i];

      let startTime = 0;
      let endTime = 0;
      let server1 = true;
      let waitTime = 0;
      let turnaroundTime = 0;
      let responseTime = 0;

      if (customer === 1) {
        // Goes to server 1
        startTime = arrivalTime;
        endTime = startTime + serviceTime;
        endTime1 = endTime;
        server1 = true;
        waitTime = 0;
        turnaroundTime = serviceTime;
        responseTime = serviceTime;
      } else if (arrivalTime >= endTime1) {
        // Goes to server 1
        startTime = arrivalTime;
        endTime = startTime + serviceTime;
        endTime1 = endTime;
        server1 = true;
        waitTime = 0;
        turnaroundTime = endTime - arrivalTime;
        responseTime = endTime - arrivalTime;
      } else if (arrivalTime <= endTime1 && arrivalTime <= endTime2) {
        const freetime1 = endTime1 - arrivalTime;
        const freetime2 = endTime2 - arrivalTime;
        if (freetime1 <= freetime2) {
          // Goes to server 1
          startTime = endTime1;
          endTime = startTime + serviceTime;
          endTime1 = endTime;
          server1 = true;
          waitTime = startTime - arrivalTime;
          turnaroundTime = endTime - arrivalTime;
          responseTime = endTime - arrivalTime;
        } else {
          // Goes to server 2
          startTime = endTime2;
          endTime = startTime + serviceTime;
          endTime2 = endTime;
          server1 = false;
          waitTime = startTime - arrivalTime;
          turnaroundTime = endTime - arrivalTime;
          responseTime = endTime - arrivalTime;
        }
      } else {
        // Goes to server 2
        if (arrivalTime >= endTime2) {
          startTime = arrivalTime;
          endTime = startTime + serviceTime;
          endTime2 = endTime;
          server1 = false;
        } else {
          startTime = endTime2;
          endTime = startTime + serviceTime;
          endTime2 = endTime;
          server1 = false;
        }
        waitTime = startTime - arrivalTime;
        turnaroundTime = endTime - arrivalTime;
        responseTime = endTime - arrivalTime;
      }

      if (server1 === true) {
        server1Data.push({
          starttime: startTime,
          endtime: endTime,
          customer,
          waitTime,
          turnaroundTime,
          arrivalTime,
          responseTime,
        });
        // totalServer1IdleTime += startTime - endTime1;
        totalServer1UtilizationTime += serviceTime;
      } else {
        server2Data.push({
          starttime: startTime,
          endtime: endTime,
          customer,
          waitTime,
          arrivalTime,
          turnaroundTime,
          responseTime,
        });
        // totalServer2IdleTime += startTime - endTime2;
        totalServer2UtilizationTime += serviceTime;
      }

      totalWaitTime += waitTime;
      totalTurnaroundTime += turnaroundTime;
      totalResponseTime += responseTime;
    }

    const totalServer1Time = endTime1;
    const totalServer2Time = endTime2;
    const server1Utilization = totalServer1UtilizationTime / totalServer1Time;
    const server2Utilization = totalServer2UtilizationTime / totalServer2Time;
    const server1Idle = 1 - server1Utilization;
    const server2Idle = 1 - server2Utilization;
    const totalIdleTime = server1Idle + server2Idle;
    const totalUtilizationTime =
      totalServer1UtilizationTime + totalServer2UtilizationTime;
    const totalSystemTime = totalServer1Time + totalServer2Time;
    const systemUtilization = totalUtilizationTime / totalSystemTime;
    console.log(
      totalUtilizationTime + " / " + totalSystemTime + " = " + systemUtilization
    );
    const totalSystemIdleTime = 1 - systemUtilization;
    console.log(totalSystemIdleTime);

    const server1IdlePercentage = Math.abs((server1Idle * 100).toFixed(2));
    const server2IdlePercentage = Math.abs((server2Idle * 100).toFixed(2));
    const systemIdlePercentage = Math.abs(
      (totalSystemIdleTime * 100).toFixed(2)
    );

    const server1UtilizationPercentage = (server1Utilization * 100).toFixed(2);
    const server2UtilizationPercentage = (server2Utilization * 100).toFixed(2);
    const systemUtilizationPercentage = (systemUtilization * 100).toFixed(2);

    return {
      calculatedData,
      server1Data,
      server2Data,
      totalWaitTime,
      totalTurnaroundTime,
      totalResponseTime,
      server1IdlePercentage,
      server2IdlePercentage,
      systemIdlePercentage,
      server1UtilizationPercentage,
      server2UtilizationPercentage,
      systemUtilizationPercentage,
    };
  };

  return (
    <div className="flex flex-col items-center w-full bg-transparent min-h-screen">
      <div className="w-full max-w-3xl/ flex justify-center gap-10 my-6 px-24">
        <button
          className={`tab-button bg-gray-50 border styled text-lg rounded-md block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:bg-blue-400 dark:focus:border-blue-500 ${
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
          <CalculatedDataTab
            calculatedData={calculatedData}
            randomData={randomData}
          />
        )}
        {activeTab === "graphical" && (
          <GraphicalViewTab calculatedData={calculatedData} />
        )}
      </div>
    </div>
  );
};

export default SimulationMM2;
