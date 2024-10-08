import React, { useState, useEffect } from "react";

import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Totalsale() {
  const [selectedValue, setSelectedValue] = useState("Daily");
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 20; // Set how many items to show per page
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Sales",
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 1,
        data: [],
      },
    ],
  });

  // Function to handle dropdown change
  const DropDown = (e) => {
    setSelectedValue(e.target.value);
    setCurrentPage(1); // Reset pagination to the first page
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://shopifydataviz-backend.onrender.com/data/totalsale/${selectedValue}`
      );
      const data = response.data.result;

      setChartData({
        labels: data.map((item) => item._id),
        datasets: [
          {
            label: "Total Sales",
            backgroundColor: "#5e9aa4",
            borderColor: "#5e9aa4",
            borderWidth: 1,
            data: data.map((item) => item.totalSales),
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    
    getData();

  }, [selectedValue]);

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLabels = chartData.labels.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentData = chartData.datasets[0].data.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginatedChartData = {
    labels: currentLabels,
    datasets: [
      {
        ...chartData.datasets[0],
        data: currentData,
      },
    ],
  };

  const totalPages = Math.ceil(chartData.labels.length / itemsPerPage);

  // Handle next and previous page clicks
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "black",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: selectedValue, // Set x-axis label dynamically based on selectedValue
          color: "black", // Label color
          font: {
            size: 16, // Increase the font size for x-axis title
          },
        },
        grid: {
          display: false,
          drawOnChartArea: true,
        },
        ticks: {
          color: "black",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Sales", // Set x-axis label dynamically based on selectedValue
          color: "black", // Label color
          font: {
            size: 16, // Increase the font size for x-axis title
          },
        },
        grid: {
          drawOnChartArea: false,
          display: true,
        },
        ticks: {
          color: "black",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <div
        id="Total Sales"
        className="flex flex-col w-[95%] h-[600px] border-1 border-[black] rounded-[5px] mx-auto my-[70px] shadow-2xl bg-white"
      >
        <h1 className="text-center text-[30px]">Total Sales Over Time</h1>

        <div className="flex flex-col items-start w-full h-[490px]">
          <form className="ml-[10px]">
            <select
              className="w-[100px] border-[1px] border-[black]"
              id="states"
              value={selectedValue}
              onChange={DropDown}
            >
              <option value="Daily">Daily</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </form>
          <div className="w-[95%] h-[450px] border-1 border-[black] ml-[10px]">
            <Bar data={paginatedChartData} options={chartOptions} />
          </div>
          <div className="flex justify-center w-full mt-4">
            <button
              className="ml-[10px] w-[30px] hover:bg-[grey] rounded-full cursor-pointer"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <i className="fa-solid fa-chevron-left text-[20px]"></i>
            </button>
            <span className="text-[20px]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="ml-[5px] w-[20px] hover:bg-[grey] rounded-full pointer"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <i className="fa-solid fa-chevron-right text-[20px] "></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
