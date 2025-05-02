import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Scatter,
  Bubble,
} from "react-chartjs-2";

function ChartRenderer({ fileData, xAxis, yAxis, chartType }) {

  if (!fileData || !xAxis || !yAxis || chartType === "none") return null;

  const canRenderChart = (chartType, xAxis, yAxis) => {
    if (chartType === "none") return true;
    if (!xAxis || !yAxis) return false;
    if (chartType === "pie" || chartType === "doughnut") {
      if (yAxis !== "numeric") return false;
    }
    return true;
  };

  const labels = fileData.data.map((row) => row[xAxis]);
  const values = fileData.data.map((row) => row[yAxis]);

  const data = {
    labels,
    datasets: [
      {
        label: `${yAxis} by ${xAxis}`,
        data: values,
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        borderWidth: 2,
        fill: chartType === "area" || chartType === "line",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  if (!canRenderChart(chartType, xAxis, yAxis)) {
    return (
      <div className="text-gray-500">
        {`Cannot render a ${chartType} chart with the selected axes. Please choose a different chart type or axes.`}
      </div>
    );
  }
  

  switch (chartType) {
    case "bar":
      return <Bar data={data} options={options} />;
    case "line":
      return <Line data={data} options={options} />;
    case "area":
      return (
        <Line
          data={data}
          options={{
            ...options,
            elements: { line: { tension: 0.4 }, point: { radius: 3 } },
          }}
        />
      );
    case "pie":
      return <Pie data={data} options={options} />;
    case "doughnut":
      return <Doughnut data={data} options={options} />;
    case "polar":
      return <PolarArea data={data} options={options} />;
    case "radar":
      return <Radar data={data} options={options} />;
    case "scatter":
      return (
        <Scatter
          data={{
            datasets: [
              {
                label: `${yAxis} vs ${xAxis}`,
                data: fileData.data.map((row) => ({
                  x: row[xAxis],
                  y: row[yAxis],
                })),
              },
            ],
          }}
          options={options}
        />
      );
    case "bubble":
      return (
        <Bubble
          data={{
            datasets: [
              {
                label: `${yAxis} vs ${xAxis}`,
                data: fileData.data.map((row) => ({
                  x: row[xAxis],
                  y: row[yAxis],
                  r: 5,
                })),
              },
            ],
          }}
          options={options}
        />
      );
    case "funnel":
      return (
        <Bar
          data={{
            labels: labels,
            datasets: [
              {
                label: `${yAxis} by ${xAxis}`,
                data: values,
                funnel: {
                  dynamicHeight: true,
                },
                backgroundColor: [
                  "#42A5F5",
                  "#64B5F6",
                  "#90CAF9",
                  "#BBDEFB",
                  "#E3F2FD",
                ],
              },
            ],
          }}
          options={{
            indexAxis: "y",
            plugins: {
              legend: { display: false },
            },
          }}
        />
      );

    case "waterfall":
      const cumulative = [];
      const deltas = [];
      let runningTotal = 0;
      values.forEach((val) => {
        cumulative.push(runningTotal);
        deltas.push(val);
        runningTotal += val;
      });

      return (
        <Bar
          data={{
            labels: labels,
            datasets: [
              {
                label: "Base",
                data: cumulative,
                backgroundColor: "transparent",
                stack: "stack1",
              },
              {
                label: "Change",
                data: deltas,
                backgroundColor: "#42A5F5",
                stack: "stack1",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
          }}
        />
      );

    default:
      return <Bar data={data} options={options} />;
  }
}

export default ChartRenderer;
