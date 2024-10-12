"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [isStrategyCreated, setIsStrategyCreated] = useState(false);

  useEffect(() => {
    // Check if the strategy is already created (stored in localStorage)
    const strategyStatus = localStorage.getItem("isStrategyCreated");
    if (strategyStatus) {
      setIsStrategyCreated(true);
    }
  }, []);

  const handleReset = () => {
    localStorage.removeItem("isStrategyCreated");
    localStorage.removeItem("submittedData");
    setIsStrategyCreated(false); // Reset the local state
  };

  return (
    <div>
      {isStrategyCreated ? (
        // Show dashboard content if the strategy has been created
        <Dashboard onReset={handleReset} />
      ) : (
        // Show "Create Strategy" button if no strategy is created yet
        <div className="flex justify-center flex-col create-strategy items-center">
          <h3 className='text-3xl mt-[40%]' >Set up a custom strategy first</h3>
          <Link href="/form">
            <Button className='big-button'>Create Strategy</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

// Reuse your existing dashboard component here
const Dashboard = ({ onReset }) => {
  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    // Get the submitted data from localStorage
    const data = localStorage.getItem("submittedData");
    if (data) {
      const parsedData = JSON.parse(data);
      console.log(parsedData); // Inspect the data structure
      setSubmittedData(parsedData);
    }
  }, []);

  return (
    <div className='dashboard max-w-5xl mx-auto w-full flex-col flex gap-6 rounded-2'>
      <div className='flex justify-between'>
        <h1>Your portfolio</h1>
        <div className='flex'>
          <div className='flex gap-2'>
            <Link href="/form">
              <Button>Edit Strategy</Button>
            </Link>
            <Button onClick={onReset}>Reset Strategy</Button>
          </div>
        </div>
      </div>

      {submittedData.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300 mt-4 secondary-button rounded-xl">
          <thead>
            <tr>
              <th className="border border-gray-300 p-4 table-th">Currency</th>
              <th className="border border-gray-300 p-4 table-th">Exit target</th>
              <th className="border border-gray-300 p-4 table-th">Your balance</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((item, itemIndex) => (
              Array.isArray(item.option) ? (
                item.option.map((option, index) => (
                  <tr key={`${itemIndex}-${index}`}>
                    <td className="border border-gray-300 p-4">{option}</td>
                    <td className="border border-gray-300 p-4">
                      {item.newAmount && item.newAmount[index] ? `${item.newAmount[index]} $` : ''}
                    </td>
                    <th className="border border-gray-300 p-4">0.5</th>
                  </tr>
                ))
              ) : (
                <tr key={itemIndex}>
                  <td colSpan={3} className="border border-gray-300 p-4 text-center">Invalid data</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Home;