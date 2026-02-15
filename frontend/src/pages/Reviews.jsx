import { useEffect, useState } from "react";
import { fetchExpenditures, fetchReviews, submitReview } from "../api/client";
import KESFormat from "../components/KESFormat";

export default function Reviews() {
  const [expenditures, setExpenditures] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExp, setSelectedExp] = useState(null);
  const [form, setForm] = useState({
    author_name: "",
    rating: 3,
    comment: "",
  });

  useEffect(() => {
    Promise.all([
      fetchExpenditures({ requires_citizen_review: true }),
      fetchReviews({}),
    ])
      .then(([eRes, rRes]) => {
        setExpenditures(eRes.data.results || eRes.data);
        setReviews(rRes.data.results || rRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedExp) return;
    submitReview({ ...form, expenditure: selectedExp })
      .then((res) => {
        setReviews((prev) => [res.data, ...prev]);
        setForm({ author_name: "", rating: 3, comment: "" });
        setSelectedExp(null);
      })
      .catch(console.error);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Citizen Reviews</h2>
        <p>
          Every expenditure over KES 1,000,000 is flagged for citizen review.
          Have your say.
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Flagged Expenditures (&gt; KES 1M)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Ward</th>
                  <th>Reviews</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((exp) => (
                  <tr
                    key={exp.id}
                    style={{
                      background:
                        selectedExp === exp.id ? "#dbeafe" : undefined,
                    }}
                  >
                    <td>{exp.description?.substring(0, 60)}</td>
                    <td>
                      <KESFormat amount={exp.amount} />
                    </td>
                    <td>{exp.ward_name || "—"}</td>
                    <td>{exp.review_count}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-accent"
                        onClick={() => setSelectedExp(exp.id)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>
            {selectedExp
              ? "Submit Your Review"
              : "Select an expenditure to review"}
          </h3>
          {selectedExp && (
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
                <option value={1}>1 - Very Poor</option>
                <option value={2}>2 - Poor</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
              <textarea
                placeholder="Share your thoughts on this expenditure..."
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
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3>Recent Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.slice(0, 20).map((r) => (
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
