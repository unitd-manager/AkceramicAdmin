import { useEffect, useState } from "react";
import api from "../constant/api";
import moment from "moment";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const today = moment().format("YYYY-MM-DD");

  // ================= FETCH =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get("Product/getCustomers").then(res => {
      setCustomers(res.data.data || []);
    });

    api.get("Order/getOrders").then(res => {
      setOrders(res.data.data || []);
    });
  };

  // ================= COUNTS =================
  const totalCustomers = customers.length;

  const todayCustomers = customers.filter(c =>
    moment(c.created_at).format("YYYY-MM-DD") === today
  ).length;

  const todayOrders = orders.filter(o =>
    moment(o.order_date).format("YYYY-MM-DD") === today
  );

  // ================= MONTHLY CHART =================
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;

    return {
      name: moment().month(i).format("MMM"),
      customers: customers.filter(c =>
        moment(c.created_at).month() === i
      ).length
    };
  });

  return (
    <div className="p-4 space-y-6">

      {/* ================= TOP CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* TOTAL CUSTOMERS */}
        <div className="bg-blue-500 text-white p-5 rounded-xl shadow">
          <h2>Total Customers</h2>
          <p className="text-3xl font-bold">{totalCustomers}</p>
        </div>

        {/* TODAY CUSTOMERS */}
        <div className="bg-green-500 text-white p-5 rounded-xl shadow">
          <h2>Today Customers</h2>
          <p className="text-3xl font-bold">{todayCustomers}</p>
        </div>

        {/* TODAY ORDERS */}
        <div className="bg-purple-500 text-white p-5 rounded-xl shadow">
          <h2>Today Orders</h2>
          <p className="text-3xl font-bold">{todayOrders.length}</p>
        </div>

      </div>

      {/* ================= TODAY ORDER LIST ================= */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">🧾 Today Orders</h2>

        {todayOrders.length === 0 ? (
          <p>No Orders Today</p>
        ) : (
          <table className="w-full text-center">
            <thead className="bg-gray-100">
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {todayOrders.map((o, i) => (
                <tr key={i} className="border-t">
                  <td>{o.customer_name}</td>
                  <td>₹{o.amount}</td>
                  <td>{moment(o.order_date).format("DD-MM-YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= CHART ================= */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">📊 Monthly Customer Report</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="customers" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}