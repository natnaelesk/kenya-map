import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchDashboard, fetchYearlySpending, fetchFundSourceSummary } from "../api/client";
import KESFormat, { formatKES } from "../components/KESFormat";

const COLORS = ["#0c4a6e", "#0ea5e9", "#059669", "#f59e0b", "#dc2626", "#8b5cf6", "#ec4899"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [yearly, setYearly] = useState([]);
  const [fundSources, setFundSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchYearlySpending(), fetchFundSourceSummary()])
      .then(([dashRes, yearlyRes, fundRes]) => {
        setStats(dashRes.data);
        setYearly(yearlyRes.data);
        setFundSources(fundRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!stats) return <div className="error">Failed to load dashboard data</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Wajir County Transparency Dashboard</h2>
        <p>Track every shilling of public funds across all wards and sectors</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{formatKES(stats.total_budget)}</div>
          <div className="stat-label">Total Budget</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatKES(stats.total_spent)}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.project_count}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed_projects}</div>
          <div className="stat-label">Completed Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.flagged_expenditures}</div>
          <div className="stat-label">Flagged for Review (&gt;1M)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.wards}</div>
          <div className="stat-label">Wards</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.sub_counties}</div>
          <div className="stat-label">Constituencies</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Yearly Budget vs Spending (KES)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="financial_year" fontSize={12} />
              <YAxis tickFormatter={(v) => formatKES(v)} fontSize={11} />
              <Tooltip formatter={(v) => formatKES(v)} />
              <Bar dataKey="total_allocated" fill="#0c4a6e" name="Allocated" />
              <Bar dataKey="total_spent" fill="#059669" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Spending by Fund Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fundSources.filter((f) => f.total_spent > 0)}
                dataKey="total_spent"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name }) => name}
              >
                {fundSources.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatKES(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Fund Sources Breakdown</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fund Source</th>
                <th>Type</th>
                <th>Total Allocated</th>
                <th>Total Spent</th>
                <th>Projects</th>
              </tr>
            </thead>
            <tbody>
              {fundSources.map((fs) => (
                <tr key={fs.id}>
                  <td><strong>{fs.name}</strong></td>
                  <td>{fs.fund_type.toUpperCase()}</td>
                  <td><KESFormat amount={fs.total_allocated} /></td>
                  <td><KESFormat amount={fs.total_spent} /></td>
                  <td>{fs.project_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
