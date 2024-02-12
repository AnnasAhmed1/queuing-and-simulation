import { useEffect, useState } from "react";
import InputSection from "./components/input_section";
import SimulationGG1 from "./SimulationGG1";
import SimulationGG2 from "./SimulationGG2";
import SimulationMM1 from "./SimulationMM1";
import SimulationMM2 from "./SimulationMM2";
import SimulationMG2 from "./SimulationMG2";
import SimulationMG1 from "./SimulationMG1";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Collapse } from "@mui/material";
import SimulationMM1Priority from "./SimulationMM1Priority";

import { factorialIterative } from "./functions.js";

export default function App() {
  const [active, setActive] = useState("M/M/2");
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };
  const notify = () =>
    toast.error("Required feilds are missing", {
      autoClose: 1000,
      position: toast.POSITION.TOP_CENTER,
    });
  const handleActive = (value) => {
    setArrivalMean(0);
    setArrivalDistribution("");
    setServiceDistribution("");
    setServiceMean(0);
    setActive(value);
  };
  const queuingHeading = [
    "Number in the Queue",
    "Wait in the Queue",
    "Wait in the System",
    "Number in the System",
    "Proportion of time server is idle",
  ];
  const [arrivalMean, setArrivalMean] = useState(0);
  const [queueing, setQueueing] = useState([]);
  const [arrivalDistribution, setArrivalDistribution] = useState("");
  const [serviceDistribution, setServiceDistribution] = useState("");
  const [serviceMean, setServiceMean] = useState(0);
  const [arrivalVariance, setArrivalVariance] = useState(0);
  const [serviceVariance, setServiceVariance] = useState(0);
  const [activeSection, setActiveSection] = useState("calculatorSection");
  const [activeCalculator, setActiveCalculator] = useState("simulation");
  const [servers, setServers] = useState(0);
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [mm1, setMm1] = useState(false);
  const [mm1Priority, setMm1Priority] = useState(false);
  const [mm2, setMm2] = useState(false);
  const [mg1, setMg1] = useState(false);
  const [mg2, setMg2] = useState(false);
  const [gg1, setGg1] = useState(false);
  const [gg2, setGg2] = useState(false);
  const [usePriority, setUsePriority] = useState(false);
  const [open, setOpen] = useState(true);

  const mm1Queueing = (arrivalMean, serviceMean) => {
    console.log(arrivalMean);
    console.log(serviceMean);
    if (arrivalMean > 0 && serviceMean > 0) {
      let lambda = 1 / arrivalMean;
      let meu = 1 / serviceMean;
      // let probabilty = ((lambda * lambda) / meu) * (meu - lambda);
      let probabilty = lambda / meu;
      let lq = (probabilty * probabilty) / (1 - probabilty);
      let wq = lq / lambda;
      let ws = wq + 1 / meu;
      let ls = lambda * ws;
      let idle = 1 - probabilty;
      console.log(probabilty, lambda, meu);
      setQueueing([
        lq.toFixed(4),
        wq.toFixed(4),
        ws.toFixed(4),
        ls.toFixed(4),
        idle.toFixed(4),
      ]);
      console.log(queueing);
      return [lq.toFixed(4), wq, ws, ls, idle];
    }
  };
  const mg1Queueing = (arrivalMean, serviceMean, serviceVariance) => {
    if (arrivalMean > 0 && serviceMean > 0 && serviceVariance > 0) {
      let lambda = 1 / arrivalMean;
      let meu = 1 / serviceMean;
      let probabilty = lambda / meu;
      let lq =
        (lambda * lambda * serviceVariance + probabilty * probabilty) /
        (2 * (1 - probabilty));
      let wq = lq / lambda;
      let ws = wq + 1 / meu;
      let ls = lambda * ws;
      let idle = 1 - probabilty;
      setQueueing([
        lq.toFixed(4),
        wq.toFixed(4),
        ws.toFixed(4),
        ls.toFixed(4),
        idle.toFixed(4),
      ]);
      return [lq, wq, ws, ls, idle];
    }
  };
  const gg1Queueing = (
    arrivalMean,
    arrivalVariance,
    serviceMean,
    serviceVariance
  ) => {
    if (
      arrivalMean > 0 &&
      serviceMean > 0 &&
      serviceVariance > 0 &&
      arrivalVariance > 0
    ) {
      let lambda = 1 / arrivalMean;
      let meu = 1 / serviceMean;
      let probabilty = lambda / meu;
      let ca2 = arrivalVariance / ((1 / lambda) * (1 / lambda));
      let cs2 = serviceVariance / ((1 / meu) * (1 / meu));
      let lq =
        (probabilty *
          probabilty *
          (1 + cs2) *
          (ca2 + probabilty * probabilty * cs2)) /
        (2 * (1 - probabilty) * (1 + probabilty * probabilty * cs2));
      let wq = lq / lambda;
      let ws = wq + 1 / meu;
      let ls = lambda * ws;
      let idle = 1 - probabilty;
      setQueueing([
        lq.toFixed(4),
        wq.toFixed(4),
        ws.toFixed(4),
        ls.toFixed(4),
        idle.toFixed(4),
      ]);
      return [lq, wq, ws, ls, idle];
    }
  };

  const mmcQueueing = (arrivalMean, serviceMean, servers) => {
    if (arrivalMean > 0 && serviceMean > 0 && servers > 1) {
      let lambda = 1 / arrivalMean;
      let meu = 1 / serviceMean;
      let probabilty = lambda / meu;
      let sum = 0;
      for (let m = 0; m < servers; m++) {
        sum +=
          (servers * probabilty) ** m / factorialIterative(m) +
          (servers * probabilty) ** servers /
            (factorialIterative(servers) * (1 - probabilty));
      }
      let p0 = 1 / sum;
      let lq =
        (p0 * (lambda / meu) ** servers * probabilty) /
        (factorialIterative(servers) * (1 - probabilty) ** 2);

      let wq = lq / lambda;
      let ws = wq + 1 / meu;
      let ls = lambda * ws;
      let idle = 1 - probabilty;
      setQueueing([
        lq.toFixed(4),
        wq.toFixed(4),
        ws.toFixed(4),
        ls.toFixed(4),
        idle.toFixed(4),
      ]);
      return [lq, wq, ws, ls, idle];
    }
  };
  const mgcQueueing = (arrivalMean, serviceMean, serviceVariance, servers) => {
    if (
      arrivalMean > 0 &&
      serviceMean > 0 &&
      serviceVariance > 0 &&
      servers > 1
    ) {
      let lambda = 1 / arrivalMean;
      let meu = 1 / serviceMean;
      let probabilty = serviceMean / (2 * arrivalMean);

      let cs2 = serviceVariance / (1 / meu) ** 2;
      let ca2 = 1;
      console.log(factorialIterative(5), "chk fact");
      // let cs2 = serviceVariance / ((1 / meu) * (1 / meu));
      let sum = 0;
      for (let m = 0; m < servers; m++) {
        sum =
          sum +
          (servers * probabilty) ** m / factorialIterative(m) +
          (servers * probabilty) ** servers /
            (factorialIterative(servers) * (1 - probabilty));
        console.log(sum, m);
      }
      let p0 = 1 / sum;
      console.log(cs2, "1");
      console.log(probabilty, "2");
      console.log(p0, "3");

      let lq =
        (p0 * (lambda / meu) ** servers * probabilty) /
        (factorialIterative(servers) * (1 - probabilty) ** 2);

      console.log(lq, "4");

      let wq = lq / lambda;
      wq = wq * ((ca2 + cs2) / 2);
      lq = wq * lambda;
      let ws = wq + 1 / meu;
      let ls = lambda * ws;
      let idle = 1 - probabilty;
      setQueueing([
        lq.toFixed(4),
        wq.toFixed(4),
        ws.toFixed(4),
        ls.toFixed(4),
        idle.toFixed(4),
      ]);
      return [lq, wq, ws, ls, idle];
    }
  };
  const ggcQueueing = (
    arrivalMean,
    arrivalVariance,
    serviceMean,
    serviceVariance,
    servers
  ) => {
    if (
      arrivalMean > 0 &&
      serviceMean > 0 &&
      serviceVariance > 0 &&
      servers > 1
    ) {
      let lambda = 1 / arrivalMean;
      let meu = 1 / serviceMean;
      let probabilty = lambda / meu;

      let cs2 = serviceVariance / (1 / meu) ** 2;
      let ca2 = arrivalVariance / (1 / lambda) ** 2;

      // let cs2 = serviceVariance / ((1 / meu) * (1 / meu));
      let sum = 0;
      for (let m = 0; m < servers; m++) {
        sum +=
          (servers * probabilty) ** m / factorialIterative(m) +
          (servers * probabilty) ** servers /
            (factorialIterative(servers) * (1 - probabilty));
      }
      let p0 = 1 / sum;

      let lq =
        (p0 * (lambda / meu) ** servers * probabilty) /
        (factorialIterative(servers) * (1 - probabilty) ** 2);

      let wq = lq / lambda;
      wq = wq * ((ca2 + cs2) / 2);
      lq = wq * lambda;
      let ws = wq + 1 / meu;
      let ls = lambda * ws;
      let idle = 1 - probabilty;
      setQueueing([
        lq.toFixed(4),
        wq.toFixed(4),
        ws.toFixed(4),
        ls.toFixed(4),
        idle.toFixed(4),
      ]);
      return [lq, wq, ws, ls, idle];
    }
  };

  return (
    <main
      className={`h-screen bg-[#F0F0F0]/ ${
        activeSection !== "calculationSection" ||
        activeCalculator !== "simulation"
          ? "overflow-hidden"
          : "overflow-auto"
      }`}
    >
      <ToastContainer />
      {/* <nav className="z-[999] bg-[#003459] fixed top-0 w-full font-serif text-white font-bold text-center text-5xl p-2">
        Operational Research
      </nav> */}
      <section className="flex h-screen overflow-hidden">
        <main
          className=" pl-16/ h-screen flex w-full bg-[#F0F0F0]/ overflow-hidden"
          id="calculatorSection"
        >
          {/* <div className="h-16"></div> */}
          <div className="text-2xl  flex/ justify-between w-[65%]/ w-full flex-[2] bg-[#242B2E] text-white text-center/">
            <h1 className="px-4 py-12 text-3xl font-bold">Dashboard</h1>
            <h1
              className={`p-4 cursor-pointer hover:bg-[#394144] ${
                activeCalculator === "simulation" ? "bg-[#394144]/" : null
              } border-b border-t flex justify-between items-center`}
              onClick={() => {
                setActiveCalculator("simulation");
              }}
            >
              Simulation Calculator
              <KeyboardArrowDownIcon fontSize="large" />
            </h1>
            <Collapse
              in={activeCalculator === "simulation"}
              className={`${
                activeCalculator === "simulation" ? "block" : "hidden"
              } transition-all duration-1000 opacity-100/ transform/ translate-y-0/`}
            >
              <ul className="flex/">
                {/* <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/M/1" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("M/M/1");
                  }}
                >
                  M/M/1
                </li>
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/G/1" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("M/G/1");
                  }}
                >
                  M/G/1
                </li> */}
                {/* <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "G/G/1" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("G/G/1");
                  }}
                >
                  G/G/1
                </li> */}
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/M/2" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("M/M/2");
                  }}
                >
                  M/M/{activeCalculator === "queueing" ? "C" : "C"}
                </li>
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/G/2" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("M/G/2");
                  }}
                >
                  M/G/{activeCalculator === "queueing" ? "C" : "C"}
                </li>
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "G/G/2" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("G/G/2");
                  }}
                >
                  G/G/{activeCalculator === "queueing" ? "C" : "C"}
                </li>
                {/* `<li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/M/1Priority"
                      ? "bg-[#394144]"
                      : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("M/M/1Priority");
                  }}
                >
                  M/M/1 priority
                </li>` */}
              </ul>
            </Collapse>
            <h1
              className={`p-4 cursor-pointer hover:bg-[#394144] ${
                activeCalculator === "queueing" ? "bg-[#394144]/" : null
              } border-b border-t flex justify-between items-center`}
              onClick={() => {
                setActiveCalculator("queueing");
              }}
            >
              Queuing Calculator
              <KeyboardArrowDownIcon fontSize="large" />
            </h1>
            <Collapse
              in={activeCalculator === "queueing"}
              className={`${
                activeCalculator === "queueing" ? "block" : "hidden"
              } transition-all duration-1000  opacity-100/ transform/ translate-y-0/ `}
            >
              <ul className="flex/">
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/M/1" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left `}
                  onClick={() => {
                    handleActive("M/M/1");
                  }}
                >
                  M/M/1
                </li>
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/G/1" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("M/G/1");
                  }}
                >
                  M/G/1
                </li>
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "G/G/1" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("G/G/1");
                  }}
                >
                  G/G/1
                </li>
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/M/2" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("M/M/2");
                  }}
                >
                  M/M/{activeCalculator === "queueing" ? "C" : "2"}
                </li>
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "M/G/2" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("M/G/2");
                  }}
                >
                  M/G/{activeCalculator === "queueing" ? "C" : "2"}
                </li>
                <li
                  className={`hover:bg-[#394144] flex-1 text-center/ tracking-widest ${
                    active === "G/G/2" ? "bg-[#394144]" : "bg-transparent"
                  } text-white px-10 border-b py-2 text-lg text-left`}
                  onClick={() => {
                    handleActive("G/G/2");
                  }}
                >
                  G/G/{activeCalculator === "queueing" ? "C" : "2"}
                </li>
              </ul>
            </Collapse>
          </div>
          <section className="flex-[6] h-screen overflow-scroll px-12">
            {/* <h6 className="text-md p-2">
              Choose a {activeCalculator} model to calculate and select the
              relevant data and press next for solution
            </h6> */}

            {/* <nav className="bg-[#337AB7]">
              <ul className="flex">
                <li
                  className={`hover:bg-[#0000B0] flex-1 text-center tracking-widest ${
                    active === "M/M/1" ? "bg-[#000095]" : "bg-transparent"
                  } text-white px-4 py-3 text-md`}
                  onClick={() => {
                    handleActive("M/M/1");
                  }}
                >
                  M/M/1
                </li>
                <li
                  className={`hover:bg-[#0000B0] flex-1 text-center tracking-widest ${
                    active === "M/G/1" ? "bg-[#000095]" : "bg-transparent"
                  } text-white px-4 py-3 text-md`}
                  onClick={() => {
                    handleActive("M/G/1");
                  }}
                >
                  M/G/1
                </li>
                <li
                  className={`hover:bg-[#0000B0] flex-1 text-center tracking-widest ${
                    active === "G/G/1" ? "bg-[#000095]" : "bg-transparent"
                  } text-white px-4 py-3 text-md`}
                  onClick={() => {
                    handleActive("G/G/1");
                  }}
                >
                  G/G/1
                </li>
                <li
                  className={`hover:bg-[#0000B0] flex-1 text-center tracking-widest ${
                    active === "M/M/2" ? "bg-[#000095]" : "bg-transparent"
                  } text-white px-4 py-3 text-md`}
                  onClick={() => {
                    handleActive("M/M/2");
                  }}
                >
                  M/M/{activeCalculator === "queueing" ? "C" : "2"}
                </li>
                <li
                  className={`hover:bg-[#0000B0] flex-1 text-center tracking-widest ${
                    active === "M/G/2" ? "bg-[#000095]" : "bg-transparent"
                  } text-white px-4 py-3 text-md`}
                  onClick={() => {
                    handleActive("M/G/2");
                  }}
                >
                  M/G/{activeCalculator === "queueing" ? "C" : "2"}
                </li>
                <li
                  className={`hover:bg-[#0000B0] flex-1 text-center tracking-widest ${
                    active === "G/G/2" ? "bg-[#000095]" : "bg-transparent"
                  } text-white px-4 py-3 text-md`}
                  onClick={() => {
                    handleActive("G/G/2");
                  }}
                >
                  G/G/{activeCalculator === "queueing" ? "C" : "2"}
                </li>
              </ul>
            </nav> */}
            <InputSection
              active={active}
              setArrivalMean={setArrivalMean}
              setArrivalDistribution={setArrivalDistribution}
              setServiceDistribution={setServiceDistribution}
              setServiceMean={setServiceMean}
              arrivalMean={arrivalMean}
              arrivalDistribution={arrivalDistribution}
              serviceDistribution={serviceDistribution}
              serviceMean={serviceMean}
              activeCalculator={activeCalculator}
              arrivalVariance={arrivalVariance}
              setArrivalVariance={setArrivalVariance}
              serviceVariance={serviceVariance}
              setServiceVariance={setServiceVariance}
              servers={servers}
              setServers={setServers}
              usePriority={usePriority}
              setUsePriority={setUsePriority}
            />
            <button
              className="bg-[#007BFF] hover:bg-[#0069D9] py-2 px-4 rounded-lg mt-6 text-white text-lg"
              onClick={() => {
                console.log("button click", active);
                if (activeCalculator == "simulation") {
                  if (active === "M/M/1") {
                    if (arrivalMean > 0 && serviceMean > 0) {
                      setMm1(!mm1);
                      scrollToSection("calculationSection");
                    } else {
                      notify();
                    }
                  } else if (active === "M/M/1Priority") {
                    console.log("prioority");
                    if (arrivalMean > 0 && serviceMean > 0) {
                      setMm1Priority(!mm1Priority);
                      scrollToSection("calculationSection");
                    } else {
                      notify();
                    }
                  } else if (active === "M/M/2") {
                    if (arrivalMean > 0 && serviceMean > 0) {
                      setMm2(!mm2);
                      scrollToSection("calculationSection");
                    } else {
                      notify();
                    }
                  } else if (active === "M/G/1") {
                    if (
                      arrivalMean > 0 &&
                      serviceMean > 0 &&
                      serviceDistribution.length > 0
                    ) {
                      setMg1(!mg1);
                      scrollToSection("calculationSection");
                    } else {
                      notify();
                    }
                  } else if (active === "M/G/2") {
                    if (
                      arrivalMean > 0 &&
                      serviceMean > 0 &&
                      serviceDistribution.length > 0
                    ) {
                      setMg2(!mg2);
                      scrollToSection("calculationSection");
                    } else {
                      notify();
                    }
                  } else if (active === "G/G/1") {
                    if (
                      arrivalMean > 0 &&
                      serviceMean > 0 &&
                      serviceDistribution.length > 0 &&
                      arrivalDistribution.length > 0
                    ) {
                      setGg1(!gg1);
                      scrollToSection("calculationSection");
                    } else {
                      notify();
                    }
                  } else if (active === "G/G/2") {
                    if (
                      arrivalMean > 0 &&
                      serviceMean > 0 &&
                      serviceDistribution.length > 0 &&
                      arrivalDistribution.length > 0
                    ) {
                      setGg2(!gg2);
                      scrollToSection("calculationSection");
                    } else {
                      notify();
                    }
                  }
                } else {
                  if (active === "M/M/1") {
                    mm1Queueing(arrivalMean, serviceMean);
                    scrollToSection("calculationSection");
                    console.log("chk");
                  } else if (active === "M/M/2") {
                    mmcQueueing(arrivalMean, serviceMean, servers);
                    scrollToSection("calculationSection");
                  } else if (active === "M/G/1") {
                    mg1Queueing(arrivalMean, serviceMean, serviceVariance);
                    scrollToSection("calculationSection");
                  } else if (active === "M/G/2") {
                    mgcQueueing(
                      arrivalMean,
                      serviceMean,
                      serviceVariance,
                      servers
                    );
                    scrollToSection("calculationSection");
                  } else if (active === "G/G/1") {
                    gg1Queueing(
                      arrivalMean,
                      arrivalVariance,
                      serviceMean,
                      serviceVariance
                    );
                    scrollToSection("calculationSection");
                  } else if (active === "G/G/2") {
                    ggcQueueing(
                      arrivalMean,
                      arrivalVariance,
                      serviceMean,
                      serviceVariance,
                      servers
                    );
                    scrollToSection("calculationSection");
                  }
                }
              }}
            >
              {activeCalculator == "simulation" ? "simulate" : "queue"}
            </button>
          </section>
        </main>
      </section>

      <main className="min-h-screen pt-16 bg-[#F0F0F0]" id="calculationSection">
        {activeCalculator == "simulation" ? (
          active === "M/M/1" ? (
            <SimulationMM1
              setMm1={setMm1}
              mm1={mm1}
              setArrivalMean={setArrivalMean}
              setServiceMean={setServiceMean}
              arrivalMean={arrivalMean}
              serviceMean={serviceMean}
              onClick={() => {
                scrollToSection("calculatorSection");
                window.location.reload();
              }}
            />
          ) : active === "M/M/1Priority" ? (
            <SimulationMM1Priority
              setMm1={setMm1Priority}
              mm1={mm1Priority}
              setArrivalMean={setArrivalMean}
              setServiceMean={setServiceMean}
              arrivalMean={arrivalMean}
              serviceMean={serviceMean}
              onClick={() => {
                scrollToSection("calculatorSection");
                window.location.reload();
              }}
            />
          ) : active === "M/M/2" ? (
            <SimulationMM2
              setMm2={setMm2}
              mm2={mm2}
              arrivalMean={arrivalMean}
              setArrivalMean={setArrivalMean}
              serviceMean={serviceMean}
              setServiceMean={setServiceMean}
              servers={servers}
              usePriority={usePriority}
              setUsePriority={setUsePriority}
              onClick={() => {
                scrollToSection("calculatorSection");
                window.location.reload();
              }}
            />
          ) : active === "M/G/1" ? (
            <SimulationMG1
              setMg1={setMg1}
              mg1={mg1}
              arrivalMean={arrivalMean}
              setArrivalMean={setArrivalMean}
              serviceDistribution={serviceDistribution}
              setServiceDistribution={setServiceDistribution}
              serviceMean={serviceMean}
              setServiceMean={setServiceMean}
              onClick={() => {
                scrollToSection("calculatorSection");
                window.location.reload();
              }}
            />
          ) : active === "M/G/2" ? (
            <SimulationMG2
              setMg2={setMg2}
              mg2={mg2}
              arrivalMean={arrivalMean}
              setArrivalMean={setArrivalMean}
              serviceDistribution={serviceDistribution}
              setServiceDistribution={setServiceDistribution}
              serviceMean={serviceMean}
              setServiceMean={setServiceMean}
              servers={servers}
              usePriority={usePriority}
              setUsePriority={setUsePriority}
              onClick={() => {
                scrollToSection("calculatorSection");
                window.location.reload();
              }}
            />
          ) : active === "G/G/1" ? (
            <SimulationGG1
              setGg1={setGg1}
              gg1={gg1}
              arrivalMean={arrivalMean}
              setArrivalMean={setArrivalMean}
              arrivalDistribution={arrivalDistribution}
              setArrivalDistribution={setArrivalDistribution}
              serviceDistribution={serviceDistribution}
              setServiceDistribution={setServiceDistribution}
              serviceMean={serviceMean}
              setServiceMean={setServiceMean}
              onClick={() => {
                scrollToSection("calculatorSection");
                window.location.reload();
              }}
            />
          ) : active === "G/G/2" ? (
            <SimulationGG2
              setGg2={setGg2}
              gg2={gg2}
              arrivalMean={arrivalMean}
              setArrivalMean={setArrivalMean}
              arrivalDistribution={arrivalDistribution}
              setArrivalDistribution={setArrivalDistribution}
              serviceDistribution={serviceDistribution}
              setServiceDistribution={setServiceDistribution}
              serviceMean={serviceMean}
              servers={servers}
              setServiceMean={setServiceMean}
              usePriority={usePriority}
              setUsePriority={setUsePriority}
              onClick={() => {
                scrollToSection("calculatorSection");
                window.location.reload();
              }}
            />
          ) : null
        ) : (
          <section>
            <h1 className="text-center font-bold text-3xl my-1">
              {active.charAt(active.length - 1) == "2"
                ? active.slice(0, -1) + "C"
                : active}{" "}
              Model Queuing
            </h1>
            <div className="flex flex-col gap-4 py-4 px-8">
              {queuingHeading?.map((v, i) => {
                return (
                  <div className="flex w-[40%]">
                    <h1>{queuingHeading[i]}</h1>
                    <h1 className="ml-auto">{queueing[i]}</h1>
                  </div>
                );
              })}
            </div>
            <button
              className={`tab-button w-32 mx-8 bg-gray-50 border styled text-lg rounded-lg block w-full/ p-2.5 dark:bg-gray-700 border-black dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:bg-blue-400 dark:focus:border-blue-500 hover:bg-black hover:bg-border-white hover:text-white transition-all duration-500`}
              onClick={() => {
                scrollToSection("calculatorSection");
                window.location.reload();
              }}
            >
              Reset
            </button>
          </section>
        )}
      </main>
      {/* <main></main> */}
    </main>
  );
}
