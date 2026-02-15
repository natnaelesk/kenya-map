import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchBudgets,
  fetchWardSpending,
  fetchElectionCycles,
  fetchSectors,
} from "../api/client";
import KESFormat, { formatKES } from "../components/KESFormat";

export default function Funds() {
  const [budgets, setBudgets] = useState([]);
  const [wardSpending, setWardSpending] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchElectionCycles(), fetchSectors()])
      .then(([cRes, sRes]) => {
        setCycles(cRes.data.results || cRes.data);
        setSectors(sRes.data.results || sRes.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBudgets(filters), fetchWardSpending()])
      .then(([bRes, wRes]) => {
        setBudgets(bRes.data.results || bRes.data);
        setWardSpending(wRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const topWards = [...wardSpending]
    .sort((a, b) => b.total_allocated - a.total_allocated)
    .slice(0, 15);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Fund Tracking</h2>
        <p>
          Track budget allocations, disbursements, and spending — ward by ward,
          sector by sector, year by year
        </p>
      </div>

      <div className="filters">
        <select
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              election_cycle: e.target.value || undefined,
            }))
          }
        >
          <option value="">All Election Cycles</option>
          {cycles.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, sector: e.target.value || undefined }))
          }
        >
          <option value="">All Sectors</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Ward-Level Budget Allocation (Top 15)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topWards} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => formatKES(v)} fontSize={11} />
            <YAxis
              type="category"
              dataKey="ward_name"
              width={120}
              fontSize={11}
            />
            <Tooltip formatter={(v) => formatKES(v)} />
            <Bar dataKey="total_allocated" fill="#0c4a6e" name="Allocated" />
            <Bar dataKey="total_spent" fill="#059669" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Budget Records</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Financial Year</th>
                  <th>Ward / Sub-County</th>
                  <th>Sector</th>
                  <th>Fund Source</th>
                  <th>Allocated</th>
                  <th>Disbursed</th>
                  <th>Spent</th>
                  <th>Absorption</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => (
                  <tr key={b.id}>
                    <td>{b.financial_year}</td>
                    <td>{b.ward_name || b.sub_county_name || "County"}</td>
                    <td>{b.sector_name}</td>
                    <td>{b.fund_source_name}</td>
                    <td>
                      <KESFormat amount={b.allocated_amount} />
                    </td>
                    <td>
                      <KESFormat amount={b.disbursed_amount} />
                    </td>
                    <td>
                      <KESFormat amount={b.spent_amount} />
                    </td>
                    <td>{b.absorption_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
