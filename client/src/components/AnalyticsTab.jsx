import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Tab, TabList, TabPanel, Tabs, Flex } from "@chakra-ui/react";

const AnalyticsTab = ({ completedOrders }) => {
  const itemQuantities = {};
  const ordersPerDay = {};

  console.log(completedOrders);
  // Iterate through each order and update itemQuantities

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------CHART 1
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------

  completedOrders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const itemName = item.name;
      const itemQty = item.qty;

      if (itemQuantities[itemName]) {
        itemQuantities[itemName] += itemQty;
      } else {
        itemQuantities[itemName] = itemQty;
      }
    });
  });

  const series = Object.values(itemQuantities);
  const labels = Object.keys(itemQuantities);

  const options = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------CHART 2
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------

  completedOrders.forEach((order) => {
    const createdAtDate = new Date(order.createdAt);
    const dayOfWeek = createdAtDate.getDay();

    // For better chart visualization, you can convert the dayOfWeek to its name
    const daysOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeekNames[dayOfWeek];

    if (ordersPerDay[dayName]) {
      ordersPerDay[dayName]++;
    } else {
      ordersPerDay[dayName] = 1;
    }
  });

  // Sort the days of the week in chronological order
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sortedDaysOfWeek = Object.keys(ordersPerDay).sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));

  const orderCounts = sortedDaysOfWeek.map((day) => ordersPerDay[day]);

  const options2 = {
    chart: {
      width: 380,
      type: "bar",
    },
    xaxis: {
      categories: sortedDaysOfWeek,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series2 = [
    {
      name: "Orders",
      data: orderCounts,
    },
  ];

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------CHART 3
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const DaysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const HoursOfDay = Array.from({ length: 17 }, (_, index) => (index + 7) % 24); // Hours from 8 AM to 12 Midnight (including 12 midnight)

  return (
    <Flex id="chart" justifyContent="space-between">
      <ReactApexChart options={options} series={series} type="pie" width={580} />
      <ReactApexChart options={options2} series={series2} type="bar" width={580} />
    </Flex>
  );
};

export default AnalyticsTab;
