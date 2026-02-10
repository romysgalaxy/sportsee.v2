import { useApi } from "../hooks/useApi";
import { apiService } from "../services/api";
import "./Profile.css";

export default function Profile() {
  // Fetch user info
  const { data: userInfo, loading, error } = useApi(
    () => apiService.getUserInfo(),
    []
  );

  // Loading state
  if (loading) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
          <p>Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  const userData = {
    name: `${userInfo.profile.firstName} ${userInfo.profile.lastName}`,
    memberSince: new Date(userInfo.profile.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    avatar: userInfo.profile.profilePicture,
    age: userInfo.profile.age,
    gender: userInfo.profile.age >= 18 ? "Adulte" : "Jeune",
    height: `${Math.floor(userInfo.profile.height / 100)}m${userInfo.profile.height % 100}`,
    weight: `${userInfo.profile.weight}kg`,
  };

  // Calculate total time from totalDuration (in minutes)
  const totalMinutes = userInfo.statistics.totalDuration;
  const statsData = {
    totalTime: {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    },
    caloriesBurned: 0, // Not provided by API
    totalDistance: parseFloat(userInfo.statistics.totalDistance).toFixed(0),
    restDays: 0, // Not provided by API
    sessions: userInfo.statistics.totalSessions,
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Left Column */}
        <div className="profile-left">
          {/* User Card */}
          <div className="profile-user-card">
            <div className="profile-user-info">
              <img
                src={userData.avatar || "/placeholder.svg"}
                alt={`Photo de ${userData.name}`}
                className="profile-avatar"
              />
              <div className="profile-user-details">
                <h2 className="profile-user-name">{userData.name}</h2>
                <p className="profile-member-since">
                  Membre depuis le {userData.memberSince}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="profile-info-card">
            <h3 className="profile-info-title">Votre profil</h3>
            <div className="profile-info-divider"></div>
            <div className="profile-info-list">
              <p className="profile-info-item">
                <span className="profile-info-label">Âge : </span>
                <span className="profile-info-value">{userData.age}</span>
              </p>
              <p className="profile-info-item">
                <span className="profile-info-label">Genre : </span>
                <span className="profile-info-value">{userData.gender}</span>
              </p>
              <p className="profile-info-item">
                <span className="profile-info-label">Taille : </span>
                <span className="profile-info-value">{userData.height}</span>
              </p>
              <p className="profile-info-item">
                <span className="profile-info-label">Poids : </span>
                <span className="profile-info-value">{userData.weight}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-right">
          <div className="profile-stats-header">
            <h2 className="profile-stats-title">Vos statistiques</h2>
            <p className="profile-stats-subtitle">depuis le {userData.memberSince}</p>
          </div>

          <div className="profile-stats-grid">
            {/* Total Time */}
            <div className="profile-stat-card">
              <p className="profile-stat-label">Temps total couru</p>
              <p className="profile-stat-value">
                {statsData.totalTime.hours}h{" "}
                <span className="profile-stat-unit">{statsData.totalTime.minutes}min</span>
              </p>
            </div>

            {/* Distance */}
            <div className="profile-stat-card">
              <p className="profile-stat-label">Distance totale parcourue</p>
              <p className="profile-stat-value">
                {statsData.totalDistance}{" "}
                <span className="profile-stat-unit">km</span>
              </p>
            </div>

            {/* Sessions */}
            <div className="profile-stat-card profile-stat-card-sessions">
              <p className="profile-stat-label">Nombre de sessions</p>
              <p className="profile-stat-value">
                {statsData.sessions}{" "}
                <span className="profile-stat-unit">sessions</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
