import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Bar,
  Line,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [username, setUsername] = useState("guest");
  // Replace 'testuser3' with actual username from your auth system
  // Extract username from JWT token
// Extract username from JWT token
useEffect(() => {
  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const parts = token.split(".");
      if (parts.length < 2) return;
      
      const payload = JSON.parse(atob(parts[1]));
      
      // If token has username, use it
      if (payload.username) {
        setUsername(payload.username);
      } else if (payload.userId) {
        // Otherwise fetch from backend using userId
        const res = await api.get(`/auth/user/${payload.userId}`);
        setUsername(res.data.username);
      }
    } catch (error) {
      console.error("Failed to fetch username:", error);
    }
  };
  
  fetchUsername();
}, []);
//changes it

const profileUrl = `${window.location.origin}/u/${username}`;


  const fetchLinks = async () => {
    try {
      const res = await api.get("/links");
      setLinks(res.data);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await api.get("/analytics");
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const createLink = async () => {
    if (!title || !url) return alert("Please fill both Title and URL");
    try {
      await api.post("/links", { title, url });
      setTitle("");
      setUrl("");
      fetchLinks();
      fetchAnalytics();
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };
const deleteLink = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this link?");
  if (!confirmDelete) return;

  try {
    await api.delete(`/links/${id}`);
    setLinks((prev) => prev.filter((link) => link.id !== id));
    fetchAnalytics(); // update charts & stats
  } catch (error) {
    console.error("Error deleting link:", error);
    alert("Failed to delete link");
  }
};

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  useEffect(() => {
    fetchLinks();
    fetchAnalytics();
  }, []);

  const barData = analytics
    ? {
        labels: analytics.clicksPerLink.map((l) => l.title),
        datasets: [
          {
            label: "Clicks per Link",
            data: analytics.clicksPerLink.map((l) => l.clicks),
            backgroundColor: [
              'rgba(99, 102, 241, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(167, 139, 250, 0.8)',
              'rgba(196, 181, 253, 0.8)',
            ],
            borderRadius: 8,
            borderWidth: 0,
          },
        ],
      }
    : null;

  const lineData = analytics
    ? {
        labels: analytics.clicksOverTime.map((c) => new Date(c.date).toLocaleDateString()),
        datasets: [
          {
            label: "Clicks Over Time",
            data: analytics.clicksOverTime.map((c) => c.clicks),
            fill: true,
            borderColor: "rgb(99, 102, 241)",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: "rgb(99, 102, 241)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: "rgb(139, 92, 246)",
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          padding: 8,
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          padding: 8,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>Monitor your links and analytics in real-time</p>
        </div>

        {/* Stats Cards */}
        {analytics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Clicks</p>
                  <p style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>{analytics.totalClicks}</p>
                </div>
                <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '20px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Active Links</p>
                  <p style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>{analytics.activeLinks}</p>
                </div>
                <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Public Profile URL Section */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
            🌐 Your Public Profile
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
            Share this link in your bio so others can view all your links
          </p>
          <div style={{ display: 'flex', flexDirection: window.innerWidth < 640 ? 'column' : 'row', gap: '12px', alignItems: 'stretch' }}>
            <div style={{ flex: 1, padding: '14px 18px', border: '2px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
              <span style={{ fontSize: '15px', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profileUrl}
              </span>
            </div>
            <button
              onClick={copyProfileUrl}
              style={{ 
                padding: '14px 32px', 
                background: copySuccess ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                fontWeight: '600', 
                borderRadius: '12px', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '16px', 
                transition: 'all 0.3s', 
                boxShadow: copySuccess ? '0 4px 15px rgba(16, 185, 129, 0.4)' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '140px',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => { 
                if (!copySuccess) {
                  e.currentTarget.style.transform = 'translateY(-2px)'; 
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'; 
                }
              }}
              onMouseOut={(e) => { 
                if (!copySuccess) {
                  e.currentTarget.style.transform = 'translateY(0)'; 
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'; 
                }
              }}
            >
              {copySuccess ? (
                <>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy URL
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Link Section */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            ✨ Add New Link
          </h2>
          <div style={{ display: 'flex', flexDirection: window.innerWidth < 640 ? 'column' : 'row', gap: '16px' }}>
            <input
              style={{ flex: 1, padding: '14px 18px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'all 0.3s' }}
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <input
              style={{ flex: 1, padding: '14px 18px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'all 0.3s' }}
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              onClick={createLink}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: '600', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '16px', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'; }}
            >
              Add Link
            </button>
          </div>
        </div>

        {/* Links List */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            🔗 Your Links
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {links.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <svg style={{ width: '64px', height: '64px', color: '#d1d5db', margin: '0 auto 16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p style={{ color: '#9ca3af', fontSize: '18px' }}>No links added yet. Create your first link above!</p>
              </div>
            )}
            {links.map((link) => (
  <div
    key={link.id}
    style={{
      background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
      padding: '20px',
      borderRadius: '12px',
      transition: 'all 0.3s',
      border: '2px solid transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.borderColor = '#667eea';
      e.currentTarget.style.transform = 'translateX(4px)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.borderColor = 'transparent';
      e.currentTarget.style.transform = 'translateX(0)';
    }}
  >
    {/* LINK */}
    <a
      href={`https://audiencesnap-r385.onrender.com/click/${link.id}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        color: '#667eea',
        fontWeight: '600',
        fontSize: '16px',
        textDecoration: 'none',
        gap: '12px',
        flex: 1,
      }}
    >
      <svg
        style={{ width: '20px', height: '20px' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      {link.title}
    </a>

    {/* DELETE BUTTON */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        deleteLink(link.id);
      }}
      title="Delete link"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#ef4444',
        padding: '6px',
        marginLeft: '12px',
      }}
    >
      <svg
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
        />
      </svg>
    </button>
  </div>
))}

          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : 'repeat(2, 1fr)', gap: '32px' }}>
          {/* Bar Chart */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
              📊 Clicks Per Link
            </h3>
            {loadingAnalytics ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            ) : (
              barData && (
                <div style={{ height: '300px' }}>
                  <Bar data={barData} options={chartOptions} />
                </div>
              )
            )}
          </div>

          {/* Line Chart */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
              📈 Clicks Over Time
            </h3>
            {loadingAnalytics ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            ) : (
              lineData && (
                <div style={{ height: '300px' }}>
                  <Line
                    data={lineData}
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        x: {
                          ...chartOptions.scales.x,
                          ticks: { 
                            ...chartOptions.scales.x.ticks,
                            maxRotation: 45, 
                            minRotation: 45 
                          },
                        },
                      },
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
