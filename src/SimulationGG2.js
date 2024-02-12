import React, { useState, useEffect } from "react";

import RandomDataTab from "./Simulation/MM2/RandomDataTabMM2";
import CalculatedDataTab from "./Simulation/MM2/CalculatedDataTabMM2";
import GraphicalViewTab from "./Simulation/MM2/GraphicalViewTabMM2";
import CalculatedDataTabP from "./Simulation/MM1Priority/CalculatedDataTabMM1";
import GraphicalViewTabP from "./Simulation/MM1Priority/GraphicalViewTabMM1";
import { calculateCalculatedData, generateRandomDataFunc } from "./functions";

const SimulationGG2 = ({
  setGg2,
  gg2,
  arrivalMean,
  serviceMean,
  arrivalDistribution,
  serviceDistribution,
  setArrivalDistribution,
  setServiceDistribution,
  setArrivalMean,
  setServiceMean,
  servers,
  onClick,
  usePriority,
}) => {
  const [activeTab, setActiveTab] = useState("random");
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  console.log(serviceMean, servers);

  useEffect(() => {
    const arrivalMeanParam = arrivalMean;
    const serviceMeanParam = serviceMean;
    const selectedDistribution = serviceDistribution;
    const selectedArrivalDistribution = arrivalDistribution;

    if (
      !isNaN(arrivalMeanParam) &&
      !isNaN(serviceMeanParam) &&
      selectedDistribution &&
      selectedArrivalDistribution
    ) {
      setArrivalMean(arrivalMeanParam);
      setServiceMean(serviceMeanParam);
      setServiceDistribution(selectedDistribution);
      setArrivalDistribution(selectedArrivalDistribution);

      // const data = generateRandomData(
      //   25,
      //   arrivalMeanParam,
      //   serviceMeanParam,
      //   selectedArrivalDistribution,
      //   selectedDistribution
      // );
      const data = generateRandomDataFunc({
        arrivalMean: arrivalMeanParam,
        serviceMean: serviceMeanParam,
        arrivalDistribution: selectedArrivalDistribution,
        serviceDistribution: selectedDistribution,
        usePriority,
      });
      setRandomData(data);

      const calculatedData = calculateCalculatedData(
        data,
        servers,
        usePriority
      );
      setCalculatedData(calculatedData);
    }
  }, [gg2]);
  function generateNormalInterarrival(mean) {
    // Standard deviation (you can adjust this as needed)
    var standardDeviation = mean / 4;

    // Generate a random number from a uniform distribution (0, 1)
    var u = Math.random();

    // Use the inverse of the normal distribution CDF to find the corresponding x
    var x = mean + standardDeviation * Math.sqrt(2) * Math.erfInv(2 * u - 1);

    return x;
  }

  // Error function approximation
  // You may want to include a more accurate erfInv implementation for production use
  Math.erfInv = function (x) {
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;

    var sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    var t = 1.0 / (1.0 + p * x);
    var y = (((a5 * t + a4) * t + a3) * t + a2) * t + a1 * t;

    return sign * y;
  };

  const generateRandomData = (
    count,
    arrivalMean,
    serviceMean,
    arrivalDistribution,
    serviceDistribution
  ) => {
    const data = [];
    let arrivalTime = 0;

    for (let i = 1; i <= count; i++) {
      let interarrivalTime = Math.round(
        generateRandomTime(arrivalMean, arrivalDistribution)
      );
      if (i === 1) {
        interarrivalTime = 0;
      }
      if (!interarrivalTime || interarrivalTime > 0) {
        console.log("calll", i - 1, data);
        if (i > 1) {
          interarrivalTime = data[i - 1]
            ? data[i - 1]?.interarrivalTime
              ? data[i - 1]?.interarrivalTime
              : 1
            : 1;
        } else {
          interarrivalTime = 1;
        }
      }
      let serviceTime = generateRandomServiceTime(
        serviceMean,
        serviceDistribution
      );
      if (!serviceTime) {
        console.log("calll", i - 1, data);
        if (i > 1) {
          serviceTime = data[i - 1]
            ? data[i - 1]?.serviceTime
              ? data[i - 1]?.serviceTime
              : 1
            : 1;
        } else {
          serviceTime = 1;
        }
      }
      arrivalTime += interarrivalTime;

      data.push({
        customer: i,
        interarrivalTime,
        arrivalTime: arrivalTime,
        serviceTime,
      });
    }

    return data;
  };

  const generateRandomTime = (mean, distribution) => {
    let time;

    if (distribution === "gamma") {
      // Generate exponentially-distributed random time
      // Generate gamma-distributed random time
      const shape = 2; // Shape parameter for gamma distribution (example value)
      const scale = mean / shape; // Scale parameter for gamma distribution

      let value = 0;
      for (let i = 0; i < shape; i++) {
        value -= Math.log(Math.random());
      }
      time = Math.round(value * scale);
    } else if (distribution === "uniform") {
      // Generate uniformly-distributed random time
      time = Math.round(Math.random() * mean);
    } else if (distribution === "normal") {
      time = generateNormalInterarrival(mean);
      console.log(time, "time");
      // Generate normally-distributed random time
      // const standardDeviation = mean / 3; // Assuming 99.7% of values are within 3 standard deviations
      // let sum = 0;
      // for (let i = 0; i < 12; i++) {
      //   sum += Math.random();
      // }
      // time = Math.round((sum - 6) * standardDeviation + mean);
    }

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

  // const calculateCalculatedData = (data, serviceDistribution, serviceMean) => {
  //   const calculatedData = [];

  //   let server1Data = [];
  //   let server2Data = [];

  //   let endTime1 = 0;
  //   let endTime2 = 0;

  //   let totalWaitTime = 0;
  //   let totalTurnaroundTime = 0;
  //   let totalResponseTime = 0;
  //   let totalServer1IdleTime = 0;
  //   let totalServer2IdleTime = 0;
  //   let totalServer1UtilizationTime = 0;
  //   let totalServer2UtilizationTime = 0;
  //   let expectedServiceTime;

  //   for (let i = 0; i < data.length; i++) {
  //     const { customer, interarrivalTime, arrivalTime, serviceTime } = data[i];

  //     let startTime = 0;
  //     let endTime = 0;
  //     let server1 = true;
  //     let waitTime = 0;
  //     let turnaroundTime = 0;
  //     let responseTime = 0;
  //     if (serviceDistribution === "gamma") {
  //       // Calculate server utilization and idle time for gamma distribution
  //       const gammaShape = 2; // Example shape parameter for gamma distribution
  //       const gammaScale = serviceMean / gammaShape; // Example scale parameter for gamma distribution

  //       expectedServiceTime = gammaShape * gammaScale; // Example calculation of expected service time
  //     } else if (serviceDistribution === "normal") {
  //       // Calculate server utilization and idle time for normal distribution
  //       const normalStandardDeviation = 1; // Example standard deviation for normal distribution

  //       expectedServiceTime = serviceMean; // Example calculation of expected service time
  //     } else if (serviceDistribution === "uniform") {
  //       // Calculate server utilization and idle time for uniform distribution
  //       const uniformMin = serviceMean - 0.5; // Example minimum value for uniform distribution
  //       const uniformMax = serviceMean + 0.5; // Example maximum value for uniform distribution

  //       expectedServiceTime = (uniformMax - uniformMin) / 2; // Example calculation of expected service time
  //     }

  //     if (customer === 1) {
  //       // Goes to server 1
  //       startTime = arrivalTime;
  //       endTime = startTime + serviceTime;
  //       endTime1 = endTime;
  //       server1 = true;
  //       waitTime = 0;
  //       turnaroundTime = serviceTime;
  //       responseTime = serviceTime;
  //     } else if (arrivalTime >= endTime1) {
  //       // Goes to server 1
  //       startTime = arrivalTime;
  //       endTime = startTime + serviceTime;
  //       endTime1 = endTime;
  //       server1 = true;
  //       waitTime = 0;
  //       turnaroundTime = endTime - arrivalTime;
  //       responseTime = endTime - arrivalTime;
  //     } else if (arrivalTime <= endTime1 && arrivalTime <= endTime2) {
  //       const freetime1 = endTime1 - arrivalTime;
  //       const freetime2 = endTime2 - arrivalTime;
  //       if (freetime1 <= freetime2) {
  //         // Goes to server 1
  //         startTime = endTime1;
  //         endTime = startTime + serviceTime;
  //         endTime1 = endTime;
  //         server1 = true;
  //         waitTime = startTime - arrivalTime;
  //         turnaroundTime = endTime - arrivalTime;
  //         responseTime = endTime - arrivalTime;
  //       } else {
  //         // Goes to server 2
  //         startTime = endTime2;
  //         endTime = startTime + serviceTime;
  //         endTime2 = endTime;
  //         server1 = false;
  //         waitTime = startTime - arrivalTime;
  //         turnaroundTime = endTime - arrivalTime;
  //         responseTime = endTime - arrivalTime;
  //       }
  //     } else {
  //       // Goes to server 2
  //       if (arrivalTime >= endTime2) {
  //         startTime = arrivalTime;
  //         endTime = startTime + serviceTime;
  //         endTime2 = endTime;
  //         server1 = false;
  //       } else {
  //         startTime = endTime2;
  //         endTime = startTime + serviceTime;
  //         endTime2 = endTime;
  //         server1 = false;
  //       }
  //       waitTime = startTime - arrivalTime;
  //       turnaroundTime = endTime - arrivalTime;
  //       responseTime = endTime - arrivalTime;
  //     }

  //     if (server1 === true) {
  //       server1Data.push({
  //         starttime: startTime,
  //         endtime: endTime,
  //         customer,
  //         waitTime,
  //         arrivalTime,
  //         turnaroundTime,
  //         responseTime,
  //       });
  //       totalServer1IdleTime += startTime - endTime1;
  //       totalServer1UtilizationTime += serviceTime;
  //     } else {
  //       server2Data.push({
  //         starttime: startTime,
  //         endtime: endTime,
  //         customer,
  //         waitTime,
  //         arrivalTime,
  //         turnaroundTime,
  //         responseTime,
  //       });
  //       totalServer2IdleTime += startTime - endTime2;
  //       totalServer2UtilizationTime += serviceTime;
  //     }

  //     totalWaitTime += waitTime;
  //     totalTurnaroundTime += turnaroundTime;
  //     totalResponseTime += responseTime;
  //   }

  //   const totalServer1Time = endTime1;
  //   const totalServer2Time = endTime2;
  //   const server1Utilization = totalServer1UtilizationTime / totalServer1Time;
  //   const server2Utilization = totalServer2UtilizationTime / totalServer2Time;
  //   const server1Idle = 1 - server1Utilization;
  //   const server2Idle = 1 - server2Utilization;
  //   const totalIdleTime = server1Idle + server2Idle;
  //   const totalUtilizationTime =
  //     totalServer1UtilizationTime + totalServer2UtilizationTime;
  //   const totalSystemTime = totalServer1Time + totalServer2Time;
  //   const systemUtilization = totalUtilizationTime / totalSystemTime;
  //   console.log(
  //     totalUtilizationTime + " / " + totalSystemTime + " = " + systemUtilization
  //   );
  //   const totalSystemIdleTime = 1 - systemUtilization;
  //   console.log(totalSystemIdleTime);

  //   const server1IdlePercentage = Math.abs((server1Idle * 100).toFixed(2));
  //   const server2IdlePercentage = Math.abs((server2Idle * 100).toFixed(2));
  //   const systemIdlePercentage = Math.abs(
  //     (totalSystemIdleTime * 100).toFixed(2)
  //   );

  //   const server1UtilizationPercentage = (server1Utilization * 100).toFixed(2);
  //   const server2UtilizationPercentage = (server2Utilization * 100).toFixed(2);
  //   const systemUtilizationPercentage = (systemUtilization * 100).toFixed(2);

  //   return {
  //     calculatedData,
  //     server1Data,
  //     server2Data,
  //     totalWaitTime,
  //     totalTurnaroundTime,
  //     totalResponseTime,
  //     server1IdlePercentage,
  //     server2IdlePercentage,
  //     systemIdlePercentage,
  //     server1UtilizationPercentage,
  //     server2UtilizationPercentage,
  //     systemUtilizationPercentage,
  //   };
  // };
  // const calculateCalculatedData = (data, servers) => {
  //   let tempArr = [...data];
  //   let currentTime = 0;
  //   let serversStatus = [];
  //   let totalServersData = [];
  //   for (let k = 0; k < servers; k++) {
  //     totalServersData.push({
  //       serverNumber: k + 1,
  //       serverUtilizationTime: 0,
  //       totalServerTime: 0,
  //     });
  //   }
  //   for (let k = 0; k < servers; k++) {
  //     serversStatus.push({
  //       serverNumber: k + 1,
  //       busy: false,
  //       busyTime: 0,
  //     });
  //   }
  //   for (let i = 0; i < data.length; i++) {
  //     const { customer, interarrivalTime, arrivalTime, serviceTime } = data[i];
  //     let currentServer;
  //     for (let k = 0; k < serversStatus.length; k++) {
  //       if (
  //         arrivalTime >= serversStatus[k].busyTime ||
  //         currentTime >= serversStatus[k].busyTime
  //       ) {
  //         serversStatus[k].busyTime = 0;
  //         serversStatus[k].busy = false;
  //       }
  //     }
  //     let busyWaitTime = { time: 10000, serverNumber: 1 };
  //     for (let k = 0; k < serversStatus.length; k++) {
  //       console.log(serversStatus[k]);
  //       if (serversStatus[k].busy === false) {
  //         currentServer = serversStatus[k].serverNumber;
  //         break;
  //       } else {
  //         console.log(serversStatus[k].busyTime, "entime");
  //         console.log(busyWaitTime.time, "busytim");
  //         if (serversStatus[k].busyTime < busyWaitTime.time) {
  //           busyWaitTime.time = serversStatus[k].busyTime;
  //           busyWaitTime.serverNumber = serversStatus[k].serverNumber;
  //         }
  //       }
  //       if (k === serversStatus.length - 1) {
  //         console.log(i, "wait call");
  //         currentServer = busyWaitTime.serverNumber;
  //         currentTime = busyWaitTime.time;
  //       }
  //     }
  //     if (arrivalTime > currentTime) {
  //       currentTime = arrivalTime;
  //     }

  //     tempArr[i] = {
  //       ...tempArr[i],
  //       server: currentServer,
  //       startTime: currentTime,
  //       endTime: currentTime + serviceTime,
  //       turnaroundTime: currentTime + serviceTime - arrivalTime,
  //       waitTime: currentTime + serviceTime - arrivalTime - serviceTime,
  //       responseTime: currentTime - arrivalTime,
  //     };
  //     totalServersData[currentServer - 1].totalServerTime = tempArr[i].endTime;
  //     totalServersData[currentServer - 1].serverUtilizationTime +=
  //       tempArr[i].serviceTime;
  //     serversStatus[currentServer - 1].busy = true;
  //     serversStatus[currentServer - 1].busyTime = tempArr[i].endTime;
  //   }

  //   let totalIdleTime = 0;
  //   let totalUtilizationTime = 0;
  //   let totalSystemTime = 0;

  //   let systemUtilization = 0;
  //   let systemUtilizationPercentage = 0;
  //   let totalSystemIdleTime = 0;

  //   for (let k = 0; k < totalServersData.length; k++) {
  //     let utilization =
  //       totalServersData[k].serverUtilizationTime /
  //       totalServersData[k].totalServerTime;
  //     if (!utilization) {
  //       utilization = 0;
  //     }
  //     totalServersData[k].serverUtilization = utilization;

  //     totalServersData[k].serverIdle = 1 - utilization;

  //     totalServersData[k].serverIdlePercentage = Math.abs(
  //       ((1 - utilization) * 100).toFixed(2)
  //     );
  //     totalServersData[k].serverUtilizationPercentage = Math.abs(
  //       (utilization * 100).toFixed(2)
  //     );
  //     totalSystemTime += totalServersData[k].totalServerTime;
  //     totalUtilizationTime += totalServersData[k].serverUtilization;
  //     totalIdleTime += totalServersData[k].serverIdle;
  //   }
  //   systemUtilization = totalUtilizationTime / totalSystemTime;
  //   totalSystemIdleTime = 1 - systemUtilization;
  //   let systemIdlePercentage = Math.abs((totalSystemIdleTime * 100).toFixed(2));
  //   systemUtilizationPercentage = Math.abs(systemUtilization * 100).toFixed(2);

  //   let calculatedData = [...tempArr];
  //   let finalServersData = [];

  //   for (let k = 0; k < totalServersData?.length; k++) {
  //     let serverData = tempArr.filter(
  //       (data) => data.server === totalServersData[k].serverNumber
  //     );
  //     let waitTime = 0;
  //     for (let i = 0; i < serverData.length; i++) {
  //       waitTime += serverData[i].waitTime;
  //     }

  //     finalServersData.push({
  //       ...totalServersData[k],
  //       waitTime: waitTime,
  //       serverData: [...serverData],
  //     });
  //   }
  //   let totalWaitTime = 0;
  //   for (let i = 0; i < tempArr.length; i++) {
  //     totalWaitTime += tempArr[i].waitTime;
  //   }

  //   return {
  //     calculatedData,
  //     finalServersData,
  //     systemIdlePercentage,
  //     systemUtilizationPercentage,
  //   };
  // };
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

      <div className="w-full ">
        {activeTab === "random" && <RandomDataTab randomData={randomData} usePriority={usePriority}/>}
        {activeTab === "calculated" &&
          (!usePriority ? (
            <CalculatedDataTab
              calculatedData={calculatedData}
              randomData={randomData}
            />
          ) : (
            <CalculatedDataTabP
              calculatedData={calculatedData}
              usePriority={usePriority}
            />
          ))}
        {activeTab === "graphical" &&
          (!usePriority ? (
            <GraphicalViewTab calculatedData={calculatedData} />
          ) : (
            <GraphicalViewTabP calculatedData={calculatedData} />
          ))}
      </div>
    </div>
  );
};

export default SimulationGG2;
