import React, { useState, useEffect } from "react";
//
import RandomDataTab from "./Simulation/MM1Priority/RandomDataTabMM1";
import CalculatedDataTab from "./Simulation/MM1Priority/CalculatedDataTabMM1";
import GraphicalViewTab from "./Simulation/MM1Priority/GraphicalViewTabMM1";
import "./App.css";
import { factorialIterative } from "./App";
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
          interarrivalTime: 0,
          arrivalTime: 0,
          serviceTime: 1,
          priority: 2,
        },
        {
          customer: 2,
          interarrivalTime: 5,
          arrivalTime: 5,
          serviceTime: 1,
          priority: 2,
        },
        {
          customer: 3,
          interarrivalTime: 6,
          arrivalTime: 11,
          serviceTime: 10,
          priority: 1,
        },
        {
          customer: 4,
          interarrivalTime: 2,
          arrivalTime: 13,
          serviceTime: 1,
          priority: 2,
        },
        {
          customer: 5,
          interarrivalTime: 0,
          arrivalTime: 13,
          serviceTime: 4,
          priority: 3,
        },
        {
          customer: 6,
          interarrivalTime: 4,
          arrivalTime: 17,
          serviceTime: 6,
          priority: 1,
        },
        {
          customer: 7,
          interarrivalTime: 3,
          arrivalTime: 20,
          serviceTime: 1,
          priority: 1,
        },
        {
          customer: 8,
          interarrivalTime: 3,
          arrivalTime: 23,
          serviceTime: 2,
          priority: 2,
        },
      ];
      const calculatedData = calculateCalculatedData(dummyData);
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
      let interarrivalTime = Math.round(generateRandomTime(arrivalMean));
      // interarrivalTime += 1;
      if (i == 1) {
        console.log("chk passs");
        interarrivalTime = 0;
      }
      const serviceTime = Math.round(generateRandomTime(serviceMean));

      const tempArr = generatePriority(Z);
      const priority = tempArr[0];
      Z = tempArr[1];
      arrivalTime += interarrivalTime;

      data?.push({
        customer: i,
        interarrivalTime: interarrivalTime,
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

  const calculateCalculatedData = (data) => {
    // data = data.map((obj) => ({
    //   ...obj,
    //   completed: false,
    // }));
    let tempArr = [...data];
    console.log(data);
    console.log(tempArr);
    if (data.length) {
      const calculatedData = [];
      let serverIdleTime = 0;
      let serverUtilizationTime = 0;
      // let startTime = 0;
      let totalWaitTime = 0;
      let totalTurnaroundTime = 0;
      let finalData = [];
      let currentTime = 0;
      let push = false;
      for (let i = 0; i < tempArr.length; i++) {
        console.log(tempArr);
        if (currentTime < data[i].interarrivalTime) {
          currentTime = data[i].interarrivalTime;
        }
        if (tempArr[i].priority === 3) {
          tempArr[i].startTime = currentTime;
          tempArr[i].endTime = currentTime + tempArr[i].serviceTime;
          currentTime = tempArr[i].endTime;
          continue;
        } else {
          for (let j = i + 1; j < tempArr.length; j++) {
            if (
              tempArr[j].arrivalTime >= currentTime &&
              tempArr[j].priority > tempArr[i].priority
            ) {
              const tempObj = { ...tempArr[i] };
              tempArr[i] = {
                ...tempArr[j],
              };
              tempArr[j] = { ...tempObj };
              i = i - 1;
              break;
            } else if (
              tempArr[j].arrivalTime >= currentTime &&
              currentTime + tempArr[i].serviceTime > tempArr[j].arrivalTime &&
              tempArr[j].priority > tempArr[i].priority
            ) {
              let temp1 = { ...tempArr[i] };
              let temp2 = { ...tempArr[i] };
              temp1.serviceTime = currentTime - tempArr[j].arrivalTime;
              temp1.startTime = currentTime;
              temp1.endTime = tempArr[j].arrivalTime;
              temp2.serviceTime -= temp1.serviceTime;
              currentTime += temp1.serviceTime;
              tempArr[i] = {
                ...tempArr[j],
              };
              tempArr[j] = {
                ...temp2,
              };
              tempArr = [
                ...tempArr.slice(0, i - 1),
                { ...temp1 },
                ...tempArr.slice(0, i - 1),
              ];
              i = i - 1;
              break;
            }
            tempArr[i].startTime = currentTime;
            tempArr[i].endTime = currentTime + tempArr[i].serviceTime;
            currentTime += tempArr[i].serviceTime;
          }
        }
      }
      // startTime = 0;
      finalData = [...tempArr];
      console.log(tempArr);
      finalData = finalData.filter((v) => v.serviceTime > 0);
      for (let i = 0; i < finalData.length; i++) {
        const {
          customer,
          interarrivalTime,
          arrivalTime,
          serviceTime,
          priority,
          startTime,
          endTime,
        } = finalData[i];
        // const endTime = Math.max(arrivalTime, startTime) + serviceTime;
        // console.log(startTime, 111111);
        // const waitTime = startTime - arrivalTime;
        // console.log(startTime);
        // console.log(arrivalTime);
        // const waitTime =endTime-startTime-serviceTime;
        const turnaroundTime = endTime - arrivalTime;
        const waitTime = turnaroundTime - serviceTime;
        calculatedData.push({
          customer,
          priority,
          interarrivalTime,
          arrivalTime,
          serviceTime,
          // startTime: Math.max(arrivalTime, startTime),
          startTime,
          endTime,
          waitTime: i == 0 ? 0 : waitTime,
          turnaroundTime,
        });

        totalWaitTime += waitTime;
        totalTurnaroundTime += turnaroundTime;

        serverUtilizationTime += serviceTime;

        // startTime = endTime;
      }

      const averageWaitTime = totalWaitTime / finalData.length;
      const averageTurnaroundTime = totalTurnaroundTime / finalData.length;
      const totalTime = finalData[finalData.length - 1].endTime;
      const serverUtilization = serverUtilizationTime / totalTime;
      const serverIdle = 1 - serverUtilization;
      return {
        calculatedData,
        averageWaitTime,
        averageTurnaroundTime,
        serverUtilization,
        serverIdle,
      };
      // return {
      //   ...priority3CalculatedData(),
      //   ...priority2CalculatedData(),
      //   ...priority1CalculatedData(),
      // };
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
