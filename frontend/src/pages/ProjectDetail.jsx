import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProject, fetchReviews, submitReview } from "../api/client";
import KESFormat from "../components/KESFormat";
import StatusBadge from "../components/StatusBadge";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    author_name: "",
    rating: 3,
    comment: "",
  });

  useEffect(() => {
    Promise.all([fetchProject(id), fetchReviews({ project: id })])
      .then(([pRes, rRes]) => {
        setProject(pRes.data);
        setReviews(rRes.data.results || rRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview({ ...form, project: id })
      .then((res) => {
        setReviews((prev) => [res.data, ...prev]);
        setForm({ author_name: "", rating: 3, comment: "" });
      })
      .catch(console.error);
  };

  if (loading) return <div className="loading">Loading project...</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>{project.name}</h2>
        <p>
          {project.ward_name || project.sub_county_name} &mdash;{" "}
          {project.sector_name}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">
            <KESFormat amount={project.contract_amount} />
          </div>
          <div className="stat-label">Contract Amount</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            <KESFormat amount={project.amount_paid} />
          </div>
          <div className="stat-label">Amount Paid</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{project.completion_percentage}%</div>
          <div className="stat-label">Completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {project.beneficiaries_count?.toLocaleString()}
          </div>
          <div className="stat-label">Beneficiaries</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Project Details</h3>
          <table>
            <tbody>
              <tr>
                <td>
                  <strong>Status</strong>
                </td>
                <td>
                  <StatusBadge status={project.status} />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Contractor</strong>
                </td>
                <td>{project.contractor || "Not specified"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Fund Source</strong>
                </td>
                <td>{project.fund_source_name}</td>
              </tr>
              <tr>
                <td>
                  <strong>Start Date</strong>
                </td>
                <td>{project.start_date || "—"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Over Budget?</strong>
                </td>
                <td className={project.is_over_budget ? "amount-negative" : ""}>
                  {project.is_over_budget ? "YES" : "No"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Impact Score</strong>
                </td>
                <td>{project.citizen_impact_score}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Submit a Review</h3>
          <form className="review-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name"
              value={form.author_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, author_name: e.target.value }))
              }
              required
            />
            <select
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: Number(e.target.value) }))
              }
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
            <textarea
              placeholder="Share your experience with this project..."
              value={form.comment}
              onChange={(e) =>
                setForm((f) => ({ ...f, comment: e.target.value }))
              }
              required
            />
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <h3>Citizen Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this project.</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              style={{
                borderBottom: "1px solid var(--border)",
                padding: "0.75rem 0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{r.author_name}</strong>
                <span className="stars">{"*".repeat(r.rating)}</span>
              </div>
              <p style={{ marginTop: "0.25rem" }}>{r.comment}</p>
              <small style={{ color: "var(--text-light)" }}>
                {new Date(r.created_at).toLocaleDateString()}
                {r.ward_name && ` - ${r.ward_name}`}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
