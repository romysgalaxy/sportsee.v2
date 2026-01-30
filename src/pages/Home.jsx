"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Home.css";

// Fake data
const userData = {
  name: "Clara Dupont",
  memberSince: "14 juin 2023",
  totalDistance: 847,
  avatar: "/avatar.jpg",
};

const weeklyKmData = [
  { name: "S1", km: 21 },
  { name: "S2", km: 24 },
  { name: "S3", km: 14 },
  { name: "S4", km: 28 },
];

const heartRateData = [
  { day: "Lun", min: 135, max: 178, avg: 165 },
  { day: "Mar", min: 140, max: 175, avg: 160 },
  { day: "Mer", min: 138, max: 180, avg: 168 },
  { day: "Jeu", min: 142, max: 172, avg: 158 },
  { day: "Ven", min: 136, max: 168, avg: 155 },
  { day: "Sam", min: 145, max: 182, avg: 170 },
  { day: "Dim", min: 140, max: 175, avg: 162 },
];

const weeklyGoalData = [
  { name: "Réalisées", value: 4, color: "#2B4BF2" },
  { name: "Restants", value: 2, color: "#E8ECFF" },
];

const thisWeekStats = {
  startDate: "23/06/2025",
  endDate: "30/06/2025",
  completedRuns: 4,
  goalRuns: 6,
  activityDuration: 140,
  distance: 21.7,
};

export default function Home() {
  const [kmDateRange] = useState("28 mai - 25 juin");
  const [bpmDateRange] = useState("28 mai - 04 juin");

  return (
    <div className="home-container">
      {/* User Profile Card */}
      <section className="profile-card">
        <div className="profile-left">
          <img
            src={userData.avatar || "/placeholder.svg"}
            alt={`Photo de ${userData.name}`}
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2 className="profile-name">{userData.name}</h2>
            <p className="profile-since">Membre depuis le {userData.memberSince}</p>
          </div>
        </div>
        <div className="profile-right">
          <span className="total-distance-label">Distance totale parcourue</span>
          <div className="total-distance-box">
            <span className="total-distance-value">{userData.totalDistance}</span>
            <span className="total-distance-unit">km</span>
          </div>
        </div>
      </section>

      {/* Performances Section */}
      <section className="performances-section">
        <h2 className="section-title">Vos dernières performances</h2>
        
        <div className="performances-grid">
          {/* Weekly Kilometers Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title-group">
                <h3 className="chart-value blue">18km en moyenne</h3>
                <div className="date-navigation">
                  <button className="nav-btn" aria-label="Période précédente">
                    <ChevronLeftIcon />
                  </button>
                  <span className="date-range">{kmDateRange}</span>
                  <button className="nav-btn" aria-label="Période suivante">
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
              <p className="chart-subtitle">Total des kilomètres 4 dernières semaines</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyKmData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E8" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "#9B9EAC", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "#9B9EAC", fontSize: 12 }}
                    domain={[0, 30]}
                    ticks={[0, 10, 20, 30]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#2B4BF2", 
                      border: "none", 
                      borderRadius: "4px",
                      color: "white"
                    }}
                    labelStyle={{ display: "none" }}
                    formatter={(value) => [`${value} km`, ""]}
                  />
                  <Bar dataKey="km" fill="#C8D1FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot blue"></span>
                Km
              </span>
            </div>
          </div>

          {/* Heart Rate Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title-group">
                <h3 className="chart-value red">163 BPM</h3>
                <div className="date-navigation">
                  <button className="nav-btn" aria-label="Période précédente">
                    <ChevronLeftIcon />
                  </button>
                  <span className="date-range">{bpmDateRange}</span>
                  <button className="nav-btn" aria-label="Période suivante">
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
              <p className="chart-subtitle">Fréquence cardiaque moyenne</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E8" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "#9B9EAC", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "#9B9EAC", fontSize: 12 }}
                    domain={[130, 187]}
                    ticks={[130, 145, 160, 187]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#FF6B6B", 
                      border: "none", 
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                  <Bar dataKey="min" fill="#FFDAD9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                  <Line 
                    type="monotone" 
                    dataKey="avg" 
                    stroke="#2B4BF2" 
                    strokeWidth={2}
                    dot={{ fill: "#2B4BF2", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot orange"></span>
                Min
              </span>
              <span className="legend-item">
                <span className="legend-dot red"></span>
                Max BPM
              </span>
              <span className="legend-item">
                <span className="legend-dot blue"></span>
                Max BPM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* This Week Section */}
      <section className="this-week-section">
        <div className="section-header">
          <h2 className="section-title">Cette semaine</h2>
          <p className="section-date">Du {thisWeekStats.startDate} au {thisWeekStats.endDate}</p>
        </div>

        <div className="this-week-grid">
          {/* Goal Donut Chart */}
          <div className="stat-card goal-card">
            <div className="goal-header">
              <span className="goal-value">x{thisWeekStats.completedRuns}</span>
              <span className="goal-target">sur objectif de {thisWeekStats.goalRuns}</span>
            </div>
            <p className="goal-label">Courses hebdomadaire réalisées</p>
            <div className="donut-container">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={weeklyGoalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {weeklyGoalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-labels">
                <span className="donut-label completed">
                  <span className="label-dot blue"></span>
                  {thisWeekStats.completedRuns} réalisées
                </span>
                <span className="donut-label remaining">
                  <span className="label-dot light-blue"></span>
                  {thisWeekStats.goalRuns - thisWeekStats.completedRuns} restants
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-stack">
            <div className="stat-card simple-stat">
              <p className="stat-label">Durée d'activité</p>
              <p className="stat-value">
                <span className="value-number blue">{thisWeekStats.activityDuration}</span>
                <span className="value-unit">minutes</span>
              </p>
            </div>
            <div className="stat-card simple-stat">
              <p className="stat-label">Distance</p>
              <p className="stat-value">
                <span className="value-number red">{thisWeekStats.distance}</span>
                <span className="value-unit">kilomètres</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}
