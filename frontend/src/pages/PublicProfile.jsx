import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function PublicProfile() {
  const { username } = useParams();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/u/${username}`)
      .then((res) => setLinks(res.data.links || []))
      .catch(() => setLinks([]))
      .finally(() => setLoading(false));
  }, [username]);

  // Placeholder avatar URL — replace this with real user avatar URL if you have one
  const avatarUrl =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex";
        padding: "60px 24px 20px 24px",
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2016/09/29/14/06/background-1702930_1280.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-xl mx-auto text-center">
        {/* Avatar */}
        <img
          src={"https://marketplace.canva.com/EAFe2X15otQ/1/0/1600w/canva-red-black-illustrative-man-3d-avatar-4oF1bAeGYrg.jpg"}
          alt={`${username} avatar`}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            marginBottom: "16px",
            display: "inline-block",
          }}
        />

        {/* Username */}
        <h1
          style={{ marginTop: "-12px" }}
          className="text-5xl font-extrabold text-white mb-12 drop-shadow-xl"
        >
          {username}
        </h1>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-lg">Loading links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No links available.</p>
            </div>
          ) : (
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {links.map((l) => (
                <li key={l.id}>
                 <a href={`https://audiencesnap.onrender.com/click/${l.id}`} target="_blank" rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        marginLeft: "10%",
                        marginRight: "10%",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        padding: "22px",
                        borderRadius: "14px",
                        transition: "all 0.3s ease",
                        border: "2px solid rgba(255,255,255,0.2)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateX(6px)";
                        e.currentTarget.style.boxShadow =
                          "0 16px 35px rgba(0,0,0,0.35)";
                        e.currentTarget.style.borderColor = "#ffffff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 25px rgba(0,0,0,0.25)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.2)";
                      }}
                    >
                      {/* Icon */}
                      <svg
                        style={{ marginRight: "14px", color: "white" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width={22}
                        height={22}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>

                      {/* Title */}
                      <span
                        style={{
                          color: "white",
                          fontWeight: 600,
                          fontSize: "17px",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {l.title}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer spacing */}
<footer 
        style={{ 
          textAlign: "center", 
          padding: "20px 0", 
          color: "white", 
          fontSize: "14px",
          fontWeight: "500"
        }}
      >
        Made using{" "}
        <a 
          href="https://audiencesnap-r385.onrender.com/" 
          style={{ 
            color: "#667eea", // Indigo color to match the theme
            fontWeight: "700",
            textDecoration: "underline"
          }}
        >
          AudienceSnap
        </a>
      </footer>
      </div>
    </div>
  );
}
