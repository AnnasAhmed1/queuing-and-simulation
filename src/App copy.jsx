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

export default function App() {
  const [active, setActive] = useState("M/M/1");
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
  const [arrivalMean, setArrivalMean] = useState(0);
  const [arrivalDistribution, setArrivalDistribution] = useState("");
  const [serviceDistribution, setServiceDistribution] = useState("");
  const [serviceMean, setServiceMean] = useState(0);
  const [activeSection, setActiveSection] = useState("calculatorSection");
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [mm1, setMm1] = useState(false);
  const [mm2, setMm2] = useState(false);
  const [mg1, setMg1] = useState(false);
  const [mg2, setMg2] = useState(false);
  const [gg1, setGg1] = useState(false);
  const [gg2, setGg2] = useState(false);

  useEffect(() => {
    // const handleScroll = (event) => {
    //   if (event.deltaY < 0) {
    //     // Scrolling up, prevent default behavior
    //     event.preventDefault();
    //   }
    // };
    // // Add scroll event listener
    // window.addEventListener("wheel", handleScroll);
    // Remove scroll event listener on component unmount
    // return () => {
    //   window.removeEventListener("wheel", handleScroll);
    // };
  }, []);
  return (
    <main
      className={`h-screen bg-[#F0F0F0] ${
        activeSection == "calculatorSection"
          ? "overflow-hidden"
          : "overflow-auto"
      }`}
    >
      <ToastContainer />
      <nav className="z-[999] bg-[#003459] fixed top-0 w-full font-serif text-white font-bold text-center text-5xl p-2">
        Operational Research
      </nav>
      <main
        className=" pl-16 h-screen bg-[#F0F0F0]/ overflow-hidden"
        id="calculatorSection"
      >
        <div className="h-16"></div>
        <h1 className="text-4xl   p-2">Simulation Calculator</h1>
        <section className="bg-[#F5FAFF] w-[65%] h-[75vh]/ overflow-hidden">
          <h6 className="text-md p-2">
            Choose a simulation model to calculate and select the relevant data
            and press next for solution
          </h6>

          <nav className="bg-[#337AB7]">
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
                M/M/2
              </li>
              <li
                className={`hover:bg-[#0000B0] flex-1 text-center tracking-widest ${
                  active === "M/G/2" ? "bg-[#000095]" : "bg-transparent"
                } text-white px-4 py-3 text-md`}
                onClick={() => {
                  handleActive("M/G/2");
                }}
              >
                M/G/2
              </li>
              <li
                className={`hover:bg-[#0000B0] flex-1 text-center tracking-widest ${
                  active === "G/G/2" ? "bg-[#000095]" : "bg-transparent"
                } text-white px-4 py-3 text-md`}
                onClick={() => {
                  handleActive("G/G/2");
                }}
              >
                G/G/2
              </li>
            </ul>
          </nav>
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
          />
        </section>
        <button
          className="bg-[#007BFF] hover:bg-[#0069D9] py-2 px-4 rounded-lg mt-6 text-white text-lg"
          onClick={() => {
            if (active === "M/M/1") {
              if (arrivalMean > 0 && serviceMean > 0) {
                setMm1(!mm1);
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
          }}
        >
          simulate
        </button>
      </main>
      <main className="min-h-screen pt-16 bg-[#F0F0F0]" id="calculationSection">
        {active === "M/M/1" ? (
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
        ) : active === "M/M/2" ? (
          <SimulationMM2
            setMm2={setMm2}
            mm2={mm2}
            arrivalMean={arrivalMean}
            setArrivalMean={setArrivalMean}
            serviceMean={serviceMean}
            setServiceMean={setServiceMean}
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
            setServiceMean={setServiceMean}
            onClick={() => {
              scrollToSection("calculatorSection");
              window.location.reload();
            }}
          />
        ) : null}
        {/* <SimulationGG1
      active={active}
      setArrivalMean={setArrivalMean}
      setArrivalDistribution={setArrivalDistribution}
      setServiceDistribution={setServiceDistribution}
      setServiceMean={setServiceMean}
      arrivalMean={arrivalMean}
      arrivalDistribution={arrivalDistribution}
      serviceDistribution={serviceDistribution}
      serviceMean={serviceMean}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      randomData={randomData}
      setRandomData={setRandomData}
      calculatedData={calculatedData}
      setCalculatedData={setCalculatedData}
      /> */}
      </main>
    </main>
  );
}
