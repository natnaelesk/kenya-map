import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, fetchElectionCycles, fetchSectors } from "../api/client";
import KESFormat from "../components/KESFormat";
import StatusBadge from "../components/StatusBadge";

export default function Projects() {
  const [projects, setProjects] = useState([]);
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
    fetchProjects(filters)
      .then((res) => setProjects(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Development Projects</h2>
        <p>Every project funded by public money in Wajir County</p>
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
          <option value="">All Cycles</option>
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
        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value || undefined }))
          }
        >
          <option value="">All Statuses</option>
          <option value="planned">Planned</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="stalled">Stalled</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Ward</th>
                  <th>Sector</th>
                  <th>Fund Source</th>
                  <th>Contract</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Completion</th>
                  <th>Beneficiaries</th>
                  <th>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link to={`/projects/${p.id}`}>
                        <strong>{p.name}</strong>
                      </Link>
                    </td>
                    <td>{p.ward_name || "—"}</td>
                    <td>{p.sector_name}</td>
                    <td>{p.fund_source_name}</td>
                    <td>
                      <KESFormat amount={p.contract_amount} />
                    </td>
                    <td
                      className={
                        p.is_over_budget ? "amount amount-negative" : "amount"
                      }
                    >
                      <KESFormat amount={p.amount_paid} />
                      {p.is_over_budget && " !!"}
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>{p.completion_percentage}%</td>
                    <td>{p.beneficiaries_count?.toLocaleString()}</td>
                    <td>{p.review_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
