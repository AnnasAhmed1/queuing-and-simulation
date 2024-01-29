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
}) => {
  const data = [];
  let arrivalTime = 0;
  let val = 0;
  let chk = 0;
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
    arrivalTime += interarrivalTime;
    data.push({
      customer: i,
      interarrivalTime,
      arrivalTime: arrivalTime,
      serviceTime,
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
