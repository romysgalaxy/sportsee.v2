"use client";

import "./Profile.css";

// Fake user data
const userData = {
  name: "Clara Dupont",
  memberSince: "14 juin 2023",
  avatar: "/avatar.jpg",
  age: 29,
  gender: "Femme",
  height: "1m68",
  weight: "58kg",
};

// Fake statistics data
const statsData = {
  totalTime: { hours: 27, minutes: 15 },
  caloriesBurned: 25000,
  totalDistance: 312,
  restDays: 9,
  sessions: 41,
};

export default function Profile() {
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

            {/* Calories */}
            <div className="profile-stat-card">
              <p className="profile-stat-label">Calories brûlées</p>
              <p className="profile-stat-value">
                {statsData.caloriesBurned.toLocaleString()}{" "}
                <span className="profile-stat-unit">cal</span>
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

            {/* Rest Days */}
            <div className="profile-stat-card">
              <p className="profile-stat-label">Nombre de jours de repos</p>
              <p className="profile-stat-value">
                {statsData.restDays}{" "}
                <span className="profile-stat-unit">jours</span>
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
