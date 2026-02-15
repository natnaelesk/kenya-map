import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { fetchMPDeepDive } from "../api/client";

const COLORS = ["#0c4a6e", "#0ea5e9", "#059669", "#f59e0b", "#dc2626", "#8b5cf6"];

export default function MPDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMPDeepDive(id)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading MP profile...</div>;
  if (!data) return <div className="error">MP not found</div>;

  const { mp, activity_summary, recent_activities } = data;

  const pieData = Object.entries(activity_summary)
    .filter(([, val]) => val.count > 0)
    .map(([key, val]) => ({
      name: val.label,
      value: val.count,
    }));

  return (
    <div className="page">
      <div className="page-header">
        <h2>{mp.name}</h2>
        <p>
          {mp.sub_county_name} Constituency &mdash; {mp.election_cycle_name}{" "}
          &mdash; {mp.party}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{mp.votes_received?.toLocaleString()}</div>
          <div className="stat-label">Votes Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{mp.total_activities}</div>
          <div className="stat-label">Total Activities</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{mp.weddings_attended}</div>
          <div className="stat-label">Weddings Attended</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{mp.constituency_visits}</div>
          <div className="stat-label">Constituency Visits</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Activity Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No activities recorded</p>
          )}
        </div>

        <div className="card">
          <h3>Activity Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Activity Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(activity_summary).map(([key, val]) => (
                <tr key={key}>
                  <td>{val.label}</td>
                  <td>
                    <strong>{val.count}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Recent Activities</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Title</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {recent_activities.map((a) => (
                <tr key={a.id}>
                  <td>{a.date}</td>
                  <td>{a.activity_type.replace(/_/g, " ")}</td>
                  <td>{a.title}</td>
                  <td>{a.location || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
