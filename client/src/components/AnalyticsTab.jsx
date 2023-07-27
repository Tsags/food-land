import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Tab, TabList, TabPanel, Tabs, Flex, Box } from "@chakra-ui/react";

const AnalyticsTab = ({ completedOrders }) => {
  const itemQuantities = {};

  // console.log(completedOrders);
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
  const ordersPerDay = {};
  completedOrders.forEach((order) => {
    const createdAtDate = new Date(order.createdAt);
    const dayOfWeek2 = createdAtDate.getDay();

    // For better chart visualization, you can convert the dayOfWeek to its name
    const daysOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeekNames[dayOfWeek2];

    if (ordersPerDay[dayName]) {
      ordersPerDay[dayName]++;
    } else {
      ordersPerDay[dayName] = 1;
    }
  });

  // Sort the days of the week in chronological order
  const daysOfWeek2 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sortedDaysOfWeek = Object.keys(ordersPerDay).sort((a, b) => daysOfWeek2.indexOf(a) - daysOfWeek2.indexOf(b));

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
  // console.log(ordersPerDay);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const HoursOfDay = Array.from({ length: 24 }, (_, index) => {
    const hour = (index + 7) % 24;
    return hour < 12 ? `${hour} AM` : hour === 12 ? `12 PM` : `${hour - 12} PM`;
  });

  const ordersPerDayandHour = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));

  completedOrders.forEach((order) => {
    const createdAtDate = new Date(order.createdAt);

    // Round down the minutes to the nearest hour
    createdAtDate.setMinutes(0);

    const dayOfWeek = (createdAtDate.getDay() + 6) % 7; // Re-order days so Monday is the first day of the week
    const hourOfDay = createdAtDate.getHours();

    // Make sure the hourOfDay is within 0 to 16 range (corresponding to 8 AM to 12 Midnight)
    const hourIndex = hourOfDay >= 7 ? hourOfDay - 7 : hourOfDay + 17;

    ordersPerDayandHour[dayOfWeek][hourOfDay]++;
  });

  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (index) => {
    setSelectedTab(index);
  };

  const options3 = {
    chart: {
      id: "line-chart",
    },
    // xaxis: {
    //   categories: HoursOfDay,
    // },
    // yaxis: {
    //   categories: HoursOfDay,
    // },
  };

  const series3 = [
    {
      name: "Orders",
      data: ordersPerDayandHour[selectedTab],
    },
  ];

  return (
    <Box>
      <Flex id="chart" justifyContent="space-between">
        <ReactApexChart options={options} series={series} type="pie" width={580} />
        <ReactApexChart options={options2} series={series2} type="bar" width={580} />
      </Flex>
      <Tabs index={selectedTab} onChange={handleChangeTab}>
        <TabList>
          {daysOfWeek.map((day) => (
            <Tab key={day}>{day}</Tab>
          ))}
        </TabList>
      </Tabs>
      <ReactApexChart options={options3} series={series3} type="line" height={350} />
    </Box>
  );
};

export default AnalyticsTab;
