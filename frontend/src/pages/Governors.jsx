import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { fetchGovernorComparison } from "../api/client";
import { formatKES } from "../components/KESFormat";

const COLORS = ["#0c4a6e", "#0ea5e9", "#059669"];

export default function Governors() {
  const [governors, setGovernors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGovernorComparison()
      .then((res) => setGovernors(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading governors...</div>;

  // Build comparison data for charts
  const metricNames = [
    ...new Set(governors.flatMap((g) => g.metrics.map((m) => m.metric_name))),
  ];

  // Aggregate metrics per governor (average across years)
  const radarData = metricNames.slice(0, 6).map((metric) => {
    const row = { metric };
    governors.forEach((gov) => {
      const values = gov.metrics
        .filter((m) => m.metric_name === metric)
        .map((m) => Number(m.value));
      row[gov.name] =
        values.length > 0
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : 0;
    });
    return row;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h2>Governor Comparison</h2>
        <p>
          Compare performance across election cycles: 2013-2017, 2017-2022,
          2022-Present
        </p>
      </div>

      <div className="grid-3">
        {governors.map((gov, idx) => (
          <div key={gov.id} className="comparison-card">
            <div
              className="card-header"
              style={{ background: COLORS[idx % COLORS.length] }}
            >
              <h3>{gov.name}</h3>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                {gov.election_cycle_name} &mdash; {gov.party}
              </div>
            </div>
            <div className="card-body">
              <p>
                <strong>Votes:</strong> {gov.votes_received?.toLocaleString()}
              </p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                {gov.manifesto_summary}
              </p>
              <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
                Key Metrics (Latest Year)
              </h4>
              {gov.metrics
                .filter(
                  (m, i, arr) =>
                    arr.findIndex((x) => x.metric_name === m.metric_name) === i
                )
                .slice(0, 6)
                .map((m) => {
                  const latest = gov.metrics
                    .filter((x) => x.metric_name === m.metric_name)
                    .sort((a, b) => b.year - a.year)[0];
                  return (
                    <div
                      key={m.metric_name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.25rem 0",
                        fontSize: "0.85rem",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <span>{m.metric_name}</span>
                      <strong>
                        {Number(latest.value).toLocaleString()} {latest.unit}
                      </strong>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {radarData.length > 0 && (
        <div className="card">
          <h3>Performance Comparison Radar</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" fontSize={11} />
              <PolarRadiusAxis fontSize={10} />
              {governors.map((gov, idx) => (
                <Radar
                  key={gov.id}
                  name={gov.name}
                  dataKey={gov.name}
                  stroke={COLORS[idx % COLORS.length]}
                  fill={COLORS[idx % COLORS.length]}
                  fillOpacity={0.15}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
