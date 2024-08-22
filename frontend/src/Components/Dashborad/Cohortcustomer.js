import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Cohortcustomer() {
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 20; // Set how many items to show per page
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Life Time Value",
        borderColor: [],
        borderWidth: 1,
        pointBackgroundColor: [],
        pointBorderColor: [],
        data: [],
      },
    ],
  });

  const getData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/data/cohort`);
      const data = response.data.result;
      console.log(data);

      const borderColors = data.map((item) =>
        item.count <= 0 ? "#87eb98" : "#8b9deb"
      );
      const pointColors = data.map((item) =>
        item.count <= 0 ? "#87eb98" : "#8b9deb"
      );

      setChartData({
        labels: data.map((item) => item._id),
        datasets: [
          {
            label: "Total Life Time Value",
            borderColor: borderColors,
            pointBackgroundColor: pointColors,
            pointBorderColor: borderColors,
            borderWidth: 2,
            data: data.map((item) => item.totalLTV),
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLabels = chartData.labels.slice(indexOfFirstItem, indexOfLastItem);
  const currentData = chartData.datasets[0].data.slice(indexOfFirstItem, indexOfLastItem);
  const currentBorderColors = chartData.datasets[0].borderColor.slice(indexOfFirstItem, indexOfLastItem);
  const currentPointColors = chartData.datasets[0].pointBackgroundColor.slice(indexOfFirstItem, indexOfLastItem);

  const paginatedChartData = {
    labels: currentLabels,
    datasets: [
      {
        ...chartData.datasets[0],
        data: currentData,
        borderColor: currentBorderColors,
        pointBackgroundColor: currentPointColors,
        pointBorderColor: currentBorderColors,
      },
    ],
  };

  const totalPages = Math.ceil(chartData.labels.length / itemsPerPage);

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
          text: "Monthly",
          color: "black",
          font: {
            size: 16,
          },
        },
        grid: {
          display: false,
          drawOnChartArea: true,
          color: "black",
        },
        ticks: {
          color: "black",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Life Time Value",
          color: "black",
          font: {
            size: 16,
          },
        },
        grid: {
          drawOnChartArea: true,
          color: (context) => {
            if (context.tick.value === 0) {
              return "black";
            }
          },
          lineWidth: (context) => {
            return context.tick.value === 0;
          },
        },
        ticks: {
          color: "black",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div id="Cohort" className="flex flex-col w-[95%] h-[600px] border-1 border-[black] rounded-[5px] mx-auto my-[70px] shadow-2xl bg-white">
      <h1 className="text-center text-[30px]">Cohort Life Time Value</h1>
      <div className="flex flex-col items-start w-full h-[490px]">
        <div className="w-[95%] h-[450px] border-1 border-[black] ml-[10px]">
          <Line data={paginatedChartData} options={chartOptions} />
        </div>
        <div className="flex justify-center w-full mt-4">
            <button className="ml-[10px] w-[30px] hover:bg-[grey] rounded-full cursor-pointer" onClick={prevPage} disabled={currentPage === 1}>
            <i className="fa-solid fa-chevron-left text-[20px]"></i>
            </button>
            <span className="text-[20px]">
              Page {currentPage} of {totalPages}
            </span>
            <button className="ml-[5px] w-[20px] hover:bg-[grey] rounded-full pointer" onClick={nextPage} disabled={currentPage === totalPages}>
            <i className="fa-solid fa-chevron-right text-[20px] "></i>
            </button>
          </div>
      </div>
    </div>
  );
}
