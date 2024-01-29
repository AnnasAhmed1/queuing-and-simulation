import React, { useState, useEffect } from "react";

import RandomDataTabMG1 from "./Simulation/MG1/RandomDataTabMG1";
import CalculatedDataTabMG1 from "./Simulation/MG1/CalculatedDataTabMG1";
import GraphicalViewTabMG1 from "./Simulation/MG1/GraphicalViewTabMG1";

import { generateRandomDataFunc, factorialIterative } from "./functions";

const SimulationMG1 = ({
  setMg1,
  mg1,
  arrivalMean,
  serviceMean,
  serviceDistribution,
  setServiceDistribution,
  setArrivalMean,
  setServiceMean,
  onClick,
}) => {
  const [activeTab, setActiveTab] = useState("random");
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const arrivalMeanParam = arrivalMean;
    const serviceMeanParam = serviceMean;
    const selectedDistribution = serviceDistribution;

    console.log(
      " arrivalMeanParam " +
        arrivalMeanParam +
        "  serviceMeanParam " +
        serviceMeanParam +
        "  selectedDistribution " +
        selectedDistribution
    );
    if (
      !isNaN(arrivalMeanParam) &&
      !isNaN(serviceMeanParam) &&
      selectedDistribution
    ) {
      setArrivalMean(arrivalMeanParam);
      setServiceMean(serviceMeanParam);
      setServiceDistribution(selectedDistribution);
      console.log("sel" + selectedDistribution);

      // const data = generateRandomData(
      //   25,
      //   arrivalMeanParam,
      //   serviceMeanParam,
      //   selectedDistribution
      // );
      const data = generateRandomDataFunc({
        arrivalMean: arrivalMeanParam,
        serviceMean: serviceMeanParam,
        serviceDistribution: selectedDistribution,
      });
      setRandomData(data);

      const calculatedData = calculateCalculatedData(
        data,
        selectedDistribution
      );
      setCalculatedData(calculatedData);
    }
  }, [mg1]);

  const generateRandomData = (
    count,
    arrivalMean,
    serviceMean,
    serviceDistribution
  ) => {
    const data = [];
    let arrivalTime = 0;
    let val = 0;

    for (let i = 1; i <= count; i++) {
      const interarrivalTime = Math.round(generateRandomTime(arrivalMean));
      const serviceTime = generateRandomServiceTime(
        serviceMean,
        serviceDistribution
      );

      arrivalTime += interarrivalTime;

      data.push({
        customer: i,
        interarrivalTime,
        arrivalTime: i === 1 ? 0 : arrivalTime,
        serviceTime,
      });
      const numerator = Math.exp(-arrivalMean) * Math.pow(arrivalMean, i - 1);
      const denominator = factorialIterative(i - 1);
      val = val + numerator / denominator;
      if (val >= 0.99) {
        return data.slice(0, -1);
      }
    }

    console.log("data" + data);
    return data;
  };

  const generateRandomTime = (mean) => {
    const randomNumber = Math.random();
    const time = Math.round(-Math.log(1 - randomNumber) * mean);
    return time;
  };

  const generateRandomServiceTime = (mean, distribution) => {
    let serviceTime;

    if (distribution === "gamma") {
      // Generate gamma-distributed service time
      const shape = 2; // Shape parameter for gamma distribution (example value)
      const scale = mean / shape; // Scale parameter for gamma distribution

      serviceTime = Math.round(generateGammaDistribution(shape, scale));
    } else if (distribution === "normal") {
      // Generate normally-distributed service time
      const standardDeviation = 1; // Standard deviation for normal distribution (example value)

      serviceTime = Math.round(
        generateNormalDistribution(mean, standardDeviation)
      );
    } else if (distribution === "uniform") {
      // Generate uniformly-distributed service time
      const min = mean - 0.5; // Minimum value for uniform distribution
      const max = mean + 0.5; // Maximum value for uniform distribution

      serviceTime = Math.round(generateUniformDistribution(min, max));
    }

    return serviceTime;
  };

  // Helper function to generate a random number from gamma distribution
  const generateGammaDistribution = (shape, scale) => {
    // Implementation of the gamma distribution using the Marsaglia and Tsang method
    let value = 0;

    // Marsaglia and Tsang method to generate gamma-distributed random number
    for (let i = 0; i < shape; i++) {
      value -= Math.log(Math.random());
    }

    value *= scale;

    return value;
  };

  const generateNormalDistribution = (mean, standardDeviation) => {
    // Implementation of the Box-Muller transform for generating normally-distributed random number
    let value;
    let u, v, s;

    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);

    const multiplier = Math.sqrt((-2 * Math.log(s)) / s);
    value = mean + standardDeviation * u * multiplier;

    return value;
  };

  const generateUniformDistribution = (min, max) => {
    // Generate a random number within the specified range
    return min + Math.random() * (max - min);
  };

  const calculateCalculatedData = (data, selectedDistribution) => {
    console.log(selectedDistribution);
    const calculatedData = [];
    let startTime = 0;
    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;
    let serverIdleTime = 0;
    let serverUtilizationTime = 0;
    let expectedServiceTime;

    for (let i = 0; i < data.length; i++) {
      const { customer, interarrivalTime, arrivalTime, serviceTime } = data[i];
      const endTime = Math.max(arrivalTime, startTime) + serviceTime;
      const waitTime = Math.max(0, startTime - arrivalTime);
      const turnaroundTime = waitTime + serviceTime;

      calculatedData.push({
        customer,
        interarrivalTime,
        arrivalTime,
        serviceTime,
        startTime: Math.max(arrivalTime, startTime),
        endTime,
        waitTime,
        turnaroundTime,
        expectedServiceTime,
      });

      totalWaitTime += waitTime;
      totalTurnaroundTime += turnaroundTime;

      if (i > 0) {
        serverIdleTime += Math.max(0, startTime - arrivalTime);
      }

      serverUtilizationTime += serviceTime;

      startTime = endTime;
      if (selectedDistribution === "gamma") {
        // Calculate server utilization and idle time for gamma distribution
        const gammaShape = 2; // Example shape parameter for gamma distribution
        const gammaScale = serviceMean / gammaShape; // Example scale parameter for gamma distribution

        expectedServiceTime = gammaShape * gammaScale; // Example calculation of expected service time
      } else if (selectedDistribution === "normal") {
        // Calculate server utilization and idle time for normal distribution
        const normalStandardDeviation = 1; // Example standard deviation for normal distribution

        expectedServiceTime = serviceMean; // Example calculation of expected service time
      } else if (selectedDistribution === "uniform") {
        // Calculate server utilization and idle time for uniform distribution
        const uniformMin = serviceMean - 0.5; // Example minimum value for uniform distribution
        const uniformMax = serviceMean + 0.5; // Example maximum value for uniform distribution

        expectedServiceTime = (uniformMax - uniformMin) / 2; // Example calculation of expected service time
      }
    }

    const averageWaitTime = totalWaitTime / data.length;
    const averageTurnaroundTime = totalTurnaroundTime / data.length;
    const serverIdleTimeData = [
      { server: "Server 1", idleTime: serverIdleTime },
    ];
    const serverUtilizationTimeData = [
      { server: "Server 1", utilizationTime: serverUtilizationTime },
    ];
    const averageServerIdleTime = serverIdleTime;

    let serverUtilization, serverIdle;
    const totalTime = startTime;
    if (selectedDistribution === "gamma") {
      // Calculate server utilization and idle time for gamma distribution
      const gammaShape = 2; // Example shape parameter for gamma distribution
      const gammaScale = serviceMean / gammaShape; // Example scale parameter for gamma distribution

      expectedServiceTime = gammaShape * gammaScale; // Example calculation of expected service time

      serverUtilization = serverUtilizationTime / totalTime;
      serverIdle = 1 - serverUtilization;
    } else if (selectedDistribution === "normal") {
      // Calculate server utilization and idle time for normal distribution
      const normalStandardDeviation = 1; // Example standard deviation for normal distribution

      expectedServiceTime = serviceMean; // Example calculation of expected service time

      console.log(expectedServiceTime);

      serverUtilization = serverUtilizationTime / totalTime;
      serverIdle = 1 - serverUtilization;
    } else if (selectedDistribution === "uniform") {
      // Calculate server utilization and idle time for uniform distribution
      const uniformMin = serviceMean - 0.5; // Example minimum value for uniform distribution
      const uniformMax = serviceMean + 0.5; // Example maximum value for uniform distribution

      expectedServiceTime = (uniformMax - uniformMin) / 2; // Example calculation of expected service time

      serverUtilization = serverUtilizationTime / totalTime;
      serverIdle = 1 - serverUtilization;
    }

    return {
      calculatedData,
      averageWaitTime,
      serverUtilization,
      serverIdle,
      expectedServiceTime,
    };
  };

  return (
    <div className="flex flex-col items-center w-full bg-transparent min-h-screen">
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

      <div className="w-full">
        {activeTab === "random" && (
          <>
            <p className="text-center text-lg  underline">
              Using Distribution: {serviceDistribution}
            </p>
            <RandomDataTabMG1 randomData={randomData} />
          </>
        )}
        {activeTab === "calculated" && (
          <>
            <p className="text-center text-lg  underline">
              Using Distribution: {serviceDistribution}
            </p>
            <CalculatedDataTabMG1 calculatedData={calculatedData} />
          </>
        )}
        {activeTab === "graphical" && (
          <>
            <p className="text-center text-lg  underline">
              Using Distribution: {serviceDistribution}
            </p>
            <GraphicalViewTabMG1 calculatedData={calculatedData} />
          </>
        )}
      </div>
    </div>
  );
};

export default SimulationMG1;
