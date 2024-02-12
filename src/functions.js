const generateRandomTimeM = (mean) => {
  const randomNumber = Math.random();
  const time = Math.round(-Math.log(1 - randomNumber) * mean);
  return time;
};

// gg2

export const generateRandomDataFunc = ({
  count = 25,
  arrivalMean,
  serviceMean,
  arrivalDistribution,
  serviceDistribution,
  usePriority,
}) => {
  const data = [];
  let arrivalTime = 0;
  let val = 0;
  let chk = 0;
  let Z = 10112166;
  arrivalMean = parseFloat(arrivalMean);
  serviceMean = parseFloat(serviceMean);
  for (let i = 1; i <= count; i++) {
    chk += 1;
    let interarrivalTime = Math.round(
      generateRandomTime(arrivalMean, arrivalDistribution)
    );
    if (i === 1) {
      interarrivalTime = 0;
    }
    if (!interarrivalTime || interarrivalTime < 0) {
      if (i > 1) {
        interarrivalTime = data[i - 1]
          ? data[i - 1]?.interarrivalTime
            ? data[i - 1]?.interarrivalTime
            : Math.floor(arrivalMean)
          : Math.floor(arrivalMean);
      } else {
        Math.floor(arrivalMean);
      }
    }
    let serviceTime = generateRandomServiceTime(
      serviceMean,
      serviceDistribution
    );
    if (!serviceTime || serviceTime < 1) {
      console.log(serviceTime, "service");
      if (i > 1) {
        serviceTime = data[i - 1]
          ? data[i - 1]?.serviceTime
            ? data[i - 1]?.serviceTime
            : Math.floor(serviceMean)
          : Math.floor(serviceMean);
      } else {
        serviceTime = Math.floor(serviceMean);
      }
    }
    // 600
    // 618
    const tempArr = generatePriority(Z);
    const priority = tempArr[0];
    Z = tempArr[1];
    arrivalTime += interarrivalTime;

    data.push({
      customer: i,
      interarrivalTime,
      arrivalTime: arrivalTime,
      serviceTime,
      priority,
    });
    // if (usePriority) {
    //   data.push({
    //     ...data,

    //   });
    // }
    const numerator = Math.exp(-arrivalMean) * Math.pow(arrivalMean, i - 1);
    const denominator = factorialIterative(i - 1);
    val = val + numerator / denominator;
    if (val >= 0.99) {
      return data.slice(0, -1);
    }
  }

  return data;
};
function generateRandomNormal(mean) {
  mean = parseFloat(mean);
  let variance = (mean / 4) * (mean / 4);
  const u1 = Math.random();
  const u2 = Math.random();
  const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  console.log(typeof mean, "service2");

  const randomNormal = mean + Math.sqrt(variance) * z1;
  console.log(randomNormal, "service2");
  return randomNormal;
}
export function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

const generateRandomTime = (mean, distribution) => {
  let time;

  if (distribution === "gamma") {
    const shape = 2;
    const scale = mean / shape;
    let value = 0;
    for (let i = 0; i < shape; i++) {
      value -= Math.log(Math.random());
    }
    time = Math.round(value * scale);
  } else if (distribution === "uniform") {
    time = Math.round(Math.random() * mean);
  } else if (distribution === "normal") {
    time = generateRandomNormal(mean);
  } else {
    time = generateRandomTimeM(mean);
  }
  return time;
};

const generateGammaDistribution = (shape, scale) => {
  let value = 0;
  for (let i = 0; i < shape; i++) {
    value -= Math.log(Math.random());
  }
  value *= scale;
  return value;
};
const generateUniformDistribution = (min, max) => {
  console.log(min, max, "minmax");
  return min + Math.random() * (max - min);
};
const generateRandomServiceTime = (mean, distribution) => {
  let serviceTime;

  if (distribution === "gamma") {
    const shape = 2;
    const scale = mean / shape;

    serviceTime = Math.round(generateGammaDistribution(shape, scale));
  } else if (distribution === "normal") {
    const standardDeviation = 1;
    serviceTime = Math.round(generateRandomNormal(mean));
  } else if (distribution === "uniform") {
    const min = parseFloat(mean) - 3;
    const max = parseFloat(mean) + 3;
    serviceTime = Math.round(generateUniformDistribution(min, max));
  } else {
    serviceTime = Math.round(generateRandomTimeM(mean));
  }
  console.log(serviceTime, "service1");
  return serviceTime;
};

export const generatePriority = (Z) => {
  const a = 3;
  const b = 1;
  const A = 55;
  const M = 1194;
  const C = 9;
  const R = (A * Z + C) % M;
  const priority = Math.round((b - a) * (R / M) + a);
  return [priority, R];
};

// caculated data
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
      console.log("loop break ress");
      break;
    }
    for (let customer of customers) {
      if (
        customer.customerData.arrival <= currentTime &&
        customer.customerData.servedTime < customer.customerData.serviceTime &&
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

export const calculateCalculatedDataPriority = (data) => {
  const calculatedData = [];
  data = data.map((obj) => ({
    ...obj,
    arrival: obj.arrivalTime,
    servedTime: 0,
  }));
  console.log(data, "data");
  if (data.length) {
    let result = prioritySimulation(data);
    console.log(data, "cccc");
    result = result.filter((v) => v?.endTime > 0);
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
    console.log(calculatedData, "cccc");
    return {
      calculatedData,
      averageWaitTime,
      averageTurnaroundTime,
      serverUtilization,
      serverIdle,
    };
  }
};

const calculateCalculatedDataSimple = (data, servers) => {
  let tempArr = [...data];
  let currentTime = 0;
  let serversStatus = [];
  let totalServersData = [];
  for (let k = 0; k < servers; k++) {
    totalServersData.push({
      serverNumber: k + 1,
      serverUtilizationTime: 0,
      totalServerTime: 0,
    });
  }
  for (let k = 0; k < servers; k++) {
    serversStatus.push({
      serverNumber: k + 1,
      busy: false,
      busyTime: 0,
    });
  }
  for (let i = 0; i < data.length; i++) {
    const { customer, interarrivalTime, arrivalTime, serviceTime } = data[i];
    let currentServer;
    for (let k = 0; k < serversStatus.length; k++) {
      if (
        arrivalTime >= serversStatus[k].busyTime ||
        currentTime >= serversStatus[k].busyTime
      ) {
        serversStatus[k].busyTime = 0;
        serversStatus[k].busy = false;
      }
    }
    let busyWaitTime = { time: 10000, serverNumber: 1 };
    for (let k = 0; k < serversStatus.length; k++) {
      console.log(serversStatus[k]);
      if (serversStatus[k].busy === false) {
        currentServer = serversStatus[k].serverNumber;
        break;
      } else {
        if (serversStatus[k].busyTime < busyWaitTime.time) {
          busyWaitTime.time = serversStatus[k].busyTime;
          busyWaitTime.serverNumber = serversStatus[k].serverNumber;
        }
      }
      if (k === serversStatus.length - 1) {
        currentServer = busyWaitTime.serverNumber;
        currentTime = busyWaitTime.time;
      }
    }
    if (arrivalTime > currentTime) {
      currentTime = arrivalTime;
    }

    tempArr[i] = {
      ...tempArr[i],
      server: currentServer,
      startTime: currentTime,
      endTime: currentTime + serviceTime,
      turnaroundTime: currentTime + serviceTime - arrivalTime,
      waitTime: currentTime + serviceTime - arrivalTime - serviceTime,
      responseTime: currentTime - arrivalTime,
    };
    totalServersData[currentServer - 1].totalServerTime = tempArr[i].endTime;
    totalServersData[currentServer - 1].serverUtilizationTime +=
      tempArr[i].serviceTime;
    serversStatus[currentServer - 1].busy = true;
    serversStatus[currentServer - 1].busyTime = tempArr[i].endTime;
  }

  let totalIdleTime = 0;
  let totalUtilizationTime = 0;
  let totalSystemTime = 0;

  let systemUtilization = 0;
  let systemUtilizationPercentage = 0;
  let totalSystemIdleTime = 0;

  for (let k = 0; k < totalServersData.length; k++) {
    let utilization =
      totalServersData[k].serverUtilizationTime /
      totalServersData[k].totalServerTime;
    if (!utilization) {
      utilization = 0;
    }
    totalServersData[k].serverUtilization = utilization;

    totalServersData[k].serverIdle = 1 - utilization;

    totalServersData[k].serverIdlePercentage = Math.abs(
      ((1 - utilization) * 100).toFixed(2)
    );
    totalServersData[k].serverUtilizationPercentage = Math.abs(
      (utilization * 100).toFixed(2)
    );
    totalSystemTime += totalServersData[k].totalServerTime;
    totalUtilizationTime += totalServersData[k].serverUtilization;
    totalIdleTime += totalServersData[k].serverIdle;
  }
  systemUtilization = totalUtilizationTime / totalSystemTime;
  totalSystemIdleTime = 1 - systemUtilization;
  let systemIdlePercentage = Math.abs((totalSystemIdleTime * 100).toFixed(2));
  systemUtilizationPercentage = Math.abs(systemUtilization * 100).toFixed(2);

  let calculatedData = [...tempArr];
  let finalServersData = [];

  for (let k = 0; k < totalServersData?.length; k++) {
    let serverData = tempArr.filter(
      (data) => data.server === totalServersData[k].serverNumber
    );
    let waitTime = 0;
    for (let i = 0; i < serverData.length; i++) {
      waitTime += serverData[i].waitTime;
    }

    finalServersData.push({
      ...totalServersData[k],
      waitTime: waitTime,
      serverData: [...serverData],
    });
  }
  let totalWaitTime = 0;
  for (let i = 0; i < tempArr.length; i++) {
    totalWaitTime += tempArr[i].waitTime;
  }

  return {
    calculatedData,
    finalServersData,
    systemIdlePercentage,
    systemUtilizationPercentage,
  };
};
export const calculateCalculatedData = (data, servers, priority) => {
  console.log(priority, data, servers, "pri");
  if (data.length) {
    if (!priority) {
      console.log("simplepri");
      return calculateCalculatedDataSimple(data, servers);
    } else {
      console.log("simpleprioritypri");
      return calculateCalculatedDataPriority(data);
    }
  }
};
