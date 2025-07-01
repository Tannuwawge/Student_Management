import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserProvider";
import { Link } from "react-router-dom";

const ComplaintCard = () => {
  const { user, role } = useUser();
  const [complaint, setComplaint] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaints, setComplaints] = useState([]);

  // Fetch previous complaints
  const fetchComplaints = async () => {
    try {
     const res = await fetch(`https://api-e5q6islzdq-uc.a.run.app/complaints/${user.email}`);
     const data = await res.json();
       console.log("Fetched complaints:", data);
      if (res.ok) {
        setComplaints(data.complaints || []);
      } else {
        console.error("Error loading complaints:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchComplaints();
    }
  }, [user?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!complaint.trim()) {
      return setMessage("Please enter your complaint.");
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("https://api-e5q6islzdq-uc.a.run.app/complaints/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          complaint,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Complaint submitted successfully.");
        setComplaint("");
        fetchComplaints(); // Refresh complaints list
      } else {
        setMessage(data.error || "❌ Failed to submit complaint.");
      }
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setMessage("❌ Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || role.toLowerCase() !== "student") return null;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">🙋 Submit a Complaint</h2>
            <p className="lead text-muted">
              We're here to help! Please describe any issue you're facing.
            </p>
          </div>

          <div className="card shadow rounded">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe your issue here..."
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>
              </form>

              {message && (
                <div className="mt-3 alert alert-info text-center">{message}</div>
              )}

              <div className="mt-4 text-center">
                <Link to="/" className="btn btn-secondary">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Previous Complaints */}
          {complaints.length > 0 && (
            <div className="mt-5">
              <h5 className="text-primary">📋 Your Previous Complaints</h5>
              <ul className="list-group mt-3">
                {complaints.map((c, idx) => (
                  <li key={c.id || idx} className="list-group-item">
                    <div className="fw-semibold">{c.complaint}</div>
                    <small className="text-muted">
                     {c.timestamp?._seconds
  ? new Date(c.timestamp._seconds * 1000).toLocaleString()
  : "Time not available"}


                    </small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;

