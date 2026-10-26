import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthNames = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SalesChart = ({ sales }) => {
  const chartData = sales.map(
    (item) => ({
      name: `${monthNames[item.month]} ${item.year}`,
      revenue: item.revenue,
      orders: item.orders,
    })
  );

  return (
    <div className="card border-0 shadow-sm">

      <div className="card-body">

        <h5 className="fw-bold mb-4">
          Sales Overview
        </h5>

        {chartData.length === 0 ? (
          <div className="text-center text-muted py-5">
            No sales data available.
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: 350,
            }}
          >
            <ResponsiveContainer>
              <LineChart data={chartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${value.toLocaleString()}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  strokeWidth={3}
                />

              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

    </div>
  );
};

export default SalesChart;