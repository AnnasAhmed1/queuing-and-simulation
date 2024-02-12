import React, { useState, useEffect } from "react";
import RandomDataTab from "./Simulation/MM2/RandomDataTabMM2";
import CalculatedDataTab from "./Simulation/MM2/CalculatedDataTabMM2";
import GraphicalViewTab from "./Simulation/MM2/GraphicalViewTabMM2";
import CalculatedDataTabP from "./Simulation/MM1Priority/CalculatedDataTabMM1";
import GraphicalViewTabP from "./Simulation/MM1Priority/GraphicalViewTabMM1";

import {
  generateRandomDataFunc,
  factorialIterative,
  calculateCalculatedData,
} from "./functions";

const SimulationMM2 = ({
  setMm2,
  mm2,
  arrivalMean,
  serviceMean,
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
    console.log(tab);
  };

  useEffect(() => {
    const arrivalMeanParam = arrivalMean;
    const serviceMeanParam = serviceMean;

    if (!isNaN(arrivalMeanParam) && !isNaN(serviceMeanParam)) {
      setArrivalMean(arrivalMeanParam);
      setServiceMean(serviceMeanParam);

      // const data = generateRandomData(25, arrivalMeanParam, serviceMeanParam);
      const data = generateRandomDataFunc({
        arrivalMean: arrivalMeanParam,
        serviceMean: serviceMeanParam,
        usePriority,
      });
      setRandomData(data);

      const calculatedData = calculateCalculatedData(
        data,
        servers,
        usePriority
      );
      console.log(data, "prp");
      setCalculatedData(calculatedData);
    }
  }, [mm2]);

  const generateRandomData = (count, arrivalMean, serviceMean) => {
    const data = [];
    let arrivalTime = 0;
    let val = 0;
    for (let i = 1; i <= count; i++) {
      let interarrivalTime = Math.round(generateRandomTime(arrivalMean));
      const serviceTime = Math.round(generateRandomTime(serviceMean));
      if (i === 1) {
        interarrivalTime = 0;
      }
      arrivalTime += interarrivalTime;

      data.push({
        customer: i,
        interarrivalTime: interarrivalTime,
        arrivalTime: arrivalTime,
        serviceTime: Math.max(1, Math.min(10, serviceTime)), // Ensure value is within 1 to 10 range
      });
      const numerator = Math.exp(-arrivalMean) * Math.pow(arrivalMean, i - 1);
      const denominator = factorialIterative(i - 1);
      val = val + numerator / denominator;
      if (val >= 0.99) {
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

export default SimulationMM2;
