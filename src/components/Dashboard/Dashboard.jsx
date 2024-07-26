import React, { useState } from "react";
import { DateInput, SelectInput } from "../FormComponents/FormComponents";
import Header from "../Header/Header.jsx";

import PiChart from "../PiChart/PiChart.jsx";
function Dashboard() {
  const [numsInfo, setNumsInfo] = useState({
    totalIncome: [0, "Total Income"],
    totalOrders: [0, "Total Orders"],
    pendingDeliveries: [0, "Pending Deliveries"],
    todayDeliveries: [0, "Today Deliveries"],
    PendingAmount: [0, "Pending Amount"],
    overDue: [0, "Over Due"],
  });
  const [storeOptions, setStoreOptions] = useState([
    { value: "store-1", label: "store-1" },
    { value: "store-2", label: "store-2" },
  ]);

  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    store: null,
  });

  const [stores, setStores] = useState([
    { name: "store-1", percentage: "20", color: "blue" },
    { name: "store-2", percentage: "30", color: "black" },
    { name: "store-3", percentage: "25", color: "green" },
    { name: "store-4", percentage: "35", color: "yellow" },
  ]);

  return (
    <div>
      <Header />
      <div className="flex w-full items-center justify-between rounded-md border-b-2 border-gray-200 p-2">
        <h5>Dashboard</h5>
        <div className="jusity-between flex items-center">
          <DateInput variant="variant-1" label="From:" />
          <DateInput variant="variant-1" label="To:" />
          <SelectInput
            options={storeOptions}
            label="Store:"
            variant="variant-1"
          />
        </div>
      </div>

      <div className="mt-4 flex space-x-3">
        <div className="graph flex items-center rounded-2xl border-2 border-gray-200 bg-white p-5 pr-4 shadow-sm">
          <PiChart storesInfo={stores} />
          <div>
            <h6>Stores & Sales</h6>
            <ul>
              {stores.map((store, index) => {
                return (
                  <li key={index} className="flex items-center">
                    <span
                      className="mr-3 block h-3 w-3 rounded-full"
                      style={{ background: store.color }}
                    ></span>

                    {store.name}
                    <span className="ml-2 inline-block text-sm">
                      {" ("}
                      {store.percentage}%{") "}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3">
          {Object.keys(numsInfo).map((title, index) => (
            <IncomeDisplay
              title={numsInfo[title][1]}
              value={numsInfo[title][0]}
              key={index}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex w-full items-center justify-between rounded-md border-b-2 border-gray-200 p-2">
        <h5>Next Three Days Deliveries</h5>
        <div className="jusity-between flex items-center">
          <SelectInput
            options={storeOptions}
            label="Store:"
            variant="variant-1"
          />
        </div>
      </div>
    </div>
  );
}

function IncomeDisplay({ title, value }) {
  return (
    <div className="w-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-md mb-2 text-gray-500">{title}</p>
      <h6 className="text-xl font-bold">{value}</h6>
    </div>
  );
}

export default Dashboard;
