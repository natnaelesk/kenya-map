import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchMPComparison } from "../api/client";

const CYCLE_COLORS = {
  "2013-2017": "#0c4a6e",
  "2017-2022": "#0ea5e9",
  "2022-Present": "#059669",
};

export default function MPs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMPComparison()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading MPs...</div>;

  // Build comparison chart data — weddings attended per constituency per cycle
  const weddingData = data.map((sc) => {
    const row = { constituency: sc.sub_county };
    sc.mps.forEach((mp) => {
      row[mp.election_cycle_name] = mp.weddings_attended;
    });
    return row;
  });

  const visitData = data.map((sc) => {
    const row = { constituency: sc.sub_county };
    sc.mps.forEach((mp) => {
      row[mp.election_cycle_name] = mp.constituency_visits;
    });
    return row;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h2>MP Performance Comparison</h2>
        <p>
          Compare MPs across all 6 constituencies and 3 election cycles —
          including weddings attended and constituency visits
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Weddings Attended by Constituency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weddingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="constituency" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              {Object.entries(CYCLE_COLORS).map(([cycle, color]) => (
                <Bar key={cycle} dataKey={cycle} fill={color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Constituency Visits by MP</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="constituency" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              {Object.entries(CYCLE_COLORS).map(([cycle, color]) => (
                <Bar key={cycle} dataKey={cycle} fill={color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {data.map((sc) => (
        <div key={sc.sub_county} className="card" style={{ marginBottom: "1rem" }}>
          <h3>{sc.sub_county} Constituency</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>MP Name</th>
                  <th>Election Cycle</th>
                  <th>Party</th>
                  <th>Votes</th>
                  <th>Activities</th>
                  <th>Weddings</th>
                  <th>Constituency Visits</th>
                  <th>Current?</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sc.mps.map((mp) => (
                  <tr key={mp.id}>
                    <td>
                      <strong>{mp.name}</strong>
                    </td>
                    <td>{mp.election_cycle_name}</td>
                    <td>{mp.party}</td>
                    <td>{mp.votes_received?.toLocaleString()}</td>
                    <td>{mp.total_activities}</td>
                    <td>{mp.weddings_attended}</td>
                    <td>{mp.constituency_visits}</td>
                    <td>{mp.is_current ? "Yes" : "—"}</td>
                    <td>
                      <Link to={`/mps/${mp.id}`} className="btn btn-sm btn-primary">
                        Deep Dive
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
