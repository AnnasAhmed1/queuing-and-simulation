import React from "react";
//
const RandomDataTab = ({ randomData }) => {
  console.log(randomData);
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
          {simulatedData.map((data) => {
            return (
              <tr key={data.customer}>
                <td className="text-center pt-9 font-bold">{data.customer}</td>
                <td className="text-center pt-9 font-bold">
                  {data.interarrivalTime}
                </td>
                <td className="text-center pt-9 font-bold">
                  {data.arrivalTime}
                </td>
                <td className="text-center pt-9 font-bold">
                  {data.serviceTime}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RandomDataTab;
