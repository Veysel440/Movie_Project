import { approveComment } from "../../services/apiOperations";

export default function CommentTable({ data, error, setError, fetchData }) {
  const handleApprove = async (commentId) => {
    try {
      await approveComment(commentId, fetchData, setError);
    } catch (err) {
      console.error("Onaylama hatası:", err);
    }
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="comment-table">
      <h2>Yorum Onayları</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Yorum</th>
            <th>Puan</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((comment) => (
              <tr key={comment.id || comment.createdAt}>
                <td>{comment.userEmail}</td>
                <td>{comment.comment || "Yorum yok"}</td>
                <td>{comment.rating}</td>
                <td>
                  <button
                    onClick={() =>
                      handleApprove(comment.id || comment.createdAt)
                    }
                  >
                    Onayla
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Henüz onay bekleyen yorum yok.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
