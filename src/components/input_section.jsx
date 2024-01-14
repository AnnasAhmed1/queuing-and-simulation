import React from "react";

const InputSection = ({
  active,
  setArrivalMean,
  setArrivalDistribution,
  setServiceDistribution,
  setServiceMean,
  arrivalMean,
  arrivalDistribution,
  serviceDistribution,
  serviceMean,
  activeCalculator,
  serviceVariance,
  setServiceVariance,
  setArrivalVariance,
  arrivalVariance,
  servers,
  setServers,
}) => {
  // console.log(active);
  // console.log(activeCalculator === "queueing");
  // console.log(active.charAt(active.length - 1) == "2");
  return (
    <div className=" py-2/  px-6/ flex/ flex-col/ gap-2/ h-[55vh]/">
      <h1 className="px-4 py-12 text-3xl border-b mb-12 font-bold  text-center/ font-bold/ text-3xl/ my-1/">
        {activeCalculator === "queueing" &&
        active.charAt(active.length - 1) == "2"
          ? active.slice(0, -1) + "C"
          : active}{" "}
        Model {activeCalculator}
      </h1>
      <div className="flex gap-6 flex-col justify-between/ h-full">
        {activeCalculator === "simulation" ? (
          active === "G/G/1" || active === "G/G/2" ? (
            <div className="flex items-center gap-16/ ml/-[auto] justify-between/ pr-16/ ">
              <label
                className="block mb-2 text-xl font-bold text-center/ "
                htmlFor="serviceDistributionSelect"
              >
                Select Arrival Distribution:
              </label>
              <select
                id="serviceDistributionSelect"
                className="w-[60%] p-2 border text-center rounded-md ml-auto border-black"
                value={arrivalDistribution}
                onChange={(e) => setArrivalDistribution(e.target.value)}
              >
                <option value="" disabled>
                  Select a distribution
                </option>
                <option value="gamma">Gamma Distribution</option>
                <option value="normal">Normal Distribution</option>
                <option value="uniform">Uniform Distribution</option>
              </select>
            </div>
          ) : null
        ) : null}
        <div className="flex items-center gap-16/ ml/-[auto] justify-between/ pr-16/ ">
          <label
            className="block mb-2 text-xl font-bold text-center/ "
            htmlFor="serviceMeanInput"
          >
            Enter Arrival Mean:
          </label>
          <input
            id="serviceMeanInput"
            type="number"
            className="w-[60%] p-2 border text-center rounded-md ml-auto border-black"
            value={arrivalMean}
            onChange={(e) => setArrivalMean(e.target.value)}
          />
        </div>

        {activeCalculator === "simulation" ? (
          active === "M/G/1" ||
          active === "M/G/2" ||
          active === "G/G/1" ||
          active === "G/G/2" ? (
            <div className="flex items-center gap-16/ ml/-[auto] justify-between/ pr-16/ ">
              <label
                className="block mb-2 text-xl font-bold text-center/ "
                htmlFor="serviceDistributionSelect"
              >
                Select Service Distribution:
              </label>
              <select
                id="serviceDistributionSelect"
                className="w-[60%] p-2 border text-center rounded-md ml-auto border-black"
                value={serviceDistribution}
                onChange={(e) => setServiceDistribution(e.target.value)}
              >
                <option value="" disabled>
                  Select a distribution
                </option>
                <option value="gamma">Gamma Distribution</option>
                <option value="normal">Normal Distribution</option>
                <option value="uniform">Uniform Distribution</option>
              </select>
            </div>
          ) : null
        ) : null}
        {activeCalculator === "queueing" ? (
          active === "G/G/1" || active === "G/G/2" ? (
            <div className="flex items-center gap-16/ ml/-[auto] justify-between/ pr-16/ ">
              <label
                className="block mb-2 text-xl font-bold text-center/ "
                htmlFor="serviceMeanInput"
              >
                Enter Arrival Variance:
              </label>
              <input
                id="serviceMeanInput"
                type="number"
                className="w-[60%] p-2 border text-center rounded-md ml-auto border-black"
                value={arrivalVariance}
                onChange={(e) => setArrivalVariance(e.target.value)}
              />
            </div>
          ) : null
        ) : null}
        {activeCalculator === "queueing" ? (
          active === "M/G/1" ||
          active === "M/G/2" ||
          active === "G/G/1" ||
          active === "G/G/2" ? (
            <div className="flex items-center gap-16/ ml/-[auto] justify-between/ pr-16/ ">
              <label
                className="block mb-2 text-xl font-bold text-center/ "
                htmlFor="serviceMeanInput"
              >
                Enter Service Variance:
              </label>
              <input
                id="serviceMeanInput"
                type="number"
                className="w-[60%] p-2 border text-center rounded-md ml-auto border-black"
                value={serviceVariance}
                onChange={(e) => setServiceVariance(e.target.value)}
              />
            </div>
          ) : null
        ) : null}

        <div className="flex items-center gap-16/ ml/-[auto] justify-between/ pr-16/ ">
          <label
            className="block mb-2 text-xl font-bold text-center/ "
            htmlFor="serviceMeanInput"
          >
            Enter Service Mean:
          </label>
          <input
            id="serviceMeanInput"
            type="number"
            className="w-[60%] p-2 border text-center rounded-md ml-auto border-black"
            value={serviceMean}
            onChange={(e) => setServiceMean(e.target.value)}
          />
        </div>
        {activeCalculator === "queueing" ? (
          active === "M/M/2" || active === "M/G/2" || active === "G/G/2" ? (
            <div className="flex items-center gap-16/ ml/-[auto] justify-between/ pr-16/ ">
              <label
                className="block mb-2 text-xl font-bold text-center/ "
                htmlFor="serviceMeanInput"
              >
                Enter Number of Servers:
              </label>
              <input
                id="serviceMeanInput"
                type="number"
                className="w-[60%] p-2 border text-center rounded-md ml-auto border-black"
                value={servers}
                onChange={(e) => setServers(e.target.value)}
              />
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
};

export default InputSection;
