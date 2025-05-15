import { motion } from "framer-motion";
import ChartRenderer from "./ChartRenderer";
import All2DChartsGrid from "./All2DChartsGrid";
import { Download2DChartButton } from "./ChartDownloadButtons";
import "./chartjs-setup";
import { fadeInUp } from "../animations/fadeInUp";

export default function Chart2DSection({
  fileData,
  xAxis,
  yAxis,
  chartType,
  showAll2D,
  setShowAll2D,
  chartRef,
  fadeUp,
}) {
  return (
    <>
      {fileData && xAxis && yAxis && (
        <motion.div
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-4"
        >
          <button
            onClick={() => setShowAll2D((prev) => !prev)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {showAll2D ? "Hide All Charts" : "Show All Charts"}
          </button>
        </motion.div>
      )}

      {showAll2D && xAxis && yAxis && (
        <motion.div variants={fadeUp} custom={0.4} className="mt-6">
          <All2DChartsGrid fileData={fileData} xAxis={xAxis} yAxis={yAxis} />
        </motion.div>
      )}

      {chartType !== "none" && xAxis && yAxis && (
        <motion.div variants={fadeUp} custom={0.4}>
          <div
            className="bg-white p-4 sm:p-6 rounded shadow mb-6 overflow-x-auto"
            ref={chartRef}
          >
            <ChartRenderer
              fileData={fileData}
              xAxis={xAxis}
              yAxis={yAxis}
              chartType={chartType}
            />
          </div>
          <Download2DChartButton chartRef={chartRef} />
        </motion.div>
      )}
    </>
  );
}
