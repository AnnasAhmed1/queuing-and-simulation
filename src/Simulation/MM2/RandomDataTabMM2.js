import React from "react";

const RandomDataTab = ({ randomData }) => {
  const simulatedData = randomData;

  return (
    <div className="">
      <h1 className="text-center text-3xl font-bold mb-6">Random Data</h1>
      <table className="w-full text-black">
        <thead>
          <tr>
            <th className="text-xl">Customer</th>
            <th className="text-xl">Interarrival Time</th>
            <th className="text-xl">Arrival Time</th>
            <th className="text-xl">Service Time</th>
          </tr>
        </thead>
        <tbody>
          {simulatedData.map((data) => (
            <tr key={data.customer}>
              <td className="text-center pt-9 font-bold">{data.customer}</td>
              <td className="text-center pt-9 font-bold">
                {data.interarrivalTime <= 0 ? 1 : data.interarrivalTime}
              </td>
              <td className="text-center pt-9 font-bold">
                {data.arrivalTime <= 0 ? 1 : data.arrivalTime}
              </td>
              <td className="text-center pt-9 font-bold">
                {data.serviceTime ? data.serviceTime : 1}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RandomDataTab;
