import { useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useApi } from "../hooks/useApi";
import { apiService } from "../services/api";
import "./Home.css";

// Calculate date ranges for 4 weeks based on period offset
const calculateWeekRanges = (periodOffset = 0) => {
  const ranges = [];
  const now = new Date();
  const offsetDays = periodOffset * 28; // 4 weeks = 28 days

  for (let i = 0; i < 4; i++) {
    const endWeek = new Date(now);
    endWeek.setDate(endWeek.getDate() - offsetDays - (i * 7));

    const startWeek = new Date(endWeek);
    startWeek.setDate(startWeek.getDate() - 6);

    ranges.unshift({
      startWeek: startWeek.toISOString().split('T')[0],
      endWeek: endWeek.toISOString().split('T')[0],
      label: `S${4 - i}`,
    });
  }

  return ranges;
};

// Calculate last 7 days for BPM chart
const calculateLast7Days = (periodOffset = 0) => {
  const now = new Date();
  const offsetDays = periodOffset * 7; // Navigate by 7 days periods

  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() - offsetDays);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);

  return {
    startWeek: startDate.toISOString().split('T')[0],
    endWeek: endDate.toISOString().split('T')[0],
  };
};

export default function Home() {
  // Navigation states
  const [kmPeriodOffset, setKmPeriodOffset] = useState(0);
  const [bpmPeriodOffset, setBpmPeriodOffset] = useState(0);

  // Loading states for navigation
  const [loadingKmNav, setLoadingKmNav] = useState(false);
  const [loadingBpmNav, setLoadingBpmNav] = useState(false);

  // Data states
  const [kmActivityData, setKmActivityData] = useState(null);
  const [bpmActivityData, setBpmActivityData] = useState(null);

  // Fetch user info (only once)
  const { data: userInfo, loading: loadingUser, error: errorUser } = useApi(
    () => apiService.getUserInfo(),
    []
  );

  // Initial load of KM data
  const { loading: initialLoadingKm, error: errorKmActivity } = useApi(
    async () => {
      const weekRanges = calculateWeekRanges(0);
      if (weekRanges.length === 0) return null;

      const allData = await Promise.all(
        weekRanges.map(range =>
          apiService.getUserActivity(range.startWeek, range.endWeek)
        )
      );

      setKmActivityData(allData);
      return allData;
    },
    []
  );

  // Initial load of BPM data
  const { loading: initialLoadingBpm, error: errorBpmActivity } = useApi(
    async () => {
      const bpmRange = calculateLast7Days(0);
      const data = await apiService.getUserActivity(bpmRange.startWeek, bpmRange.endWeek);
      setBpmActivityData(data);
      return data;
    },
    []
  );

  // Manual fetch for KM chart navigation
  const fetchKmData = useCallback(async (offset) => {
    setLoadingKmNav(true);
    try {
      const weekRanges = calculateWeekRanges(offset);
      const allData = await Promise.all(
        weekRanges.map(range =>
          apiService.getUserActivity(range.startWeek, range.endWeek)
        )
      );
      setKmActivityData(allData);
    } catch (error) {
      console.error('Error fetching KM data:', error);
    } finally {
      setLoadingKmNav(false);
    }
  }, []);

  // Manual fetch for BPM chart navigation
  const fetchBpmData = useCallback(async (offset) => {
    setLoadingBpmNav(true);
    try {
      const bpmRange = calculateLast7Days(offset);
      const data = await apiService.getUserActivity(bpmRange.startWeek, bpmRange.endWeek);
      setBpmActivityData(data);
    } catch (error) {
      console.error('Error fetching BPM data:', error);
    } finally {
      setLoadingBpmNav(false);
    }
  }, []);

  // Navigation handlers
  const handleKmPrevious = useCallback(() => {
    const newOffset = kmPeriodOffset + 1;
    setKmPeriodOffset(newOffset);
    fetchKmData(newOffset);
  }, [kmPeriodOffset, fetchKmData]);

  const handleKmNext = useCallback(() => {
    if (kmPeriodOffset === 0) return;
    const newOffset = kmPeriodOffset - 1;
    setKmPeriodOffset(newOffset);
    fetchKmData(newOffset);
  }, [kmPeriodOffset, fetchKmData]);

  const handleBpmPrevious = useCallback(() => {
    const newOffset = bpmPeriodOffset + 1;
    setBpmPeriodOffset(newOffset);
    fetchBpmData(newOffset);
  }, [bpmPeriodOffset, fetchBpmData]);

  const handleBpmNext = useCallback(() => {
    if (bpmPeriodOffset === 0) return;
    const newOffset = bpmPeriodOffset - 1;
    setBpmPeriodOffset(newOffset);
    fetchBpmData(newOffset);
  }, [bpmPeriodOffset, fetchBpmData]);

  // Calculate current week ranges
  const weekRanges = useMemo(() => calculateWeekRanges(kmPeriodOffset), [kmPeriodOffset]);
  const bpmRange = useMemo(() => calculateLast7Days(bpmPeriodOffset), [bpmPeriodOffset]);

  // Process data for KM chart
  const weeklyKmData = useMemo(() => {
    if (!kmActivityData) return [];

    return kmActivityData.map((weekData, index) => {
      const totalKm = weekData.reduce((sum, session) => sum + session.distance, 0);
      return {
        name: weekRanges[index]?.label || `S${index + 1}`,
        km: parseFloat(totalKm.toFixed(1)),
      };
    });
  }, [kmActivityData, weekRanges]);

  // Process data for BPM chart (last 7 days)
  const heartRateData = useMemo(() => {
    if (!bpmActivityData || bpmActivityData.length === 0) return [];

    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    // Get the last 7 days from the data
    const last7Days = bpmActivityData.slice(-7);

    return last7Days.map((session) => {
      const sessionDate = new Date(session.date);
      const dayName = daysOfWeek[sessionDate.getDay() === 0 ? 6 : sessionDate.getDay() - 1];

      return {
        day: dayName,
        min: session.heartRate.min,
        max: session.heartRate.max,
        avg: session.heartRate.average,
      };
    });
  }, [bpmActivityData]);

  // Calculate this week stats from latest 4-week period
  const thisWeekStats = useMemo(() => {
    if (!kmActivityData || kmActivityData.length === 0) return null;

    const latestWeekData = kmActivityData[kmActivityData.length - 1];
    const completedRuns = latestWeekData.length;
    const goalRuns = 6;
    const totalDuration = latestWeekData.reduce((sum, s) => sum + s.duration, 0);
    const totalDistance = latestWeekData.reduce((sum, s) => sum + s.distance, 0);

    const latestRange = weekRanges[weekRanges.length - 1];

    return {
      startDate: latestRange ? new Date(latestRange.startWeek).toLocaleDateString('fr-FR') : '',
      endDate: latestRange ? new Date(latestRange.endWeek).toLocaleDateString('fr-FR') : '',
      completedRuns,
      goalRuns,
      activityDuration: totalDuration,
      distance: parseFloat(totalDistance.toFixed(1)),
    };
  }, [kmActivityData, weekRanges]);

  const weeklyGoalData = useMemo(() => {
    if (!thisWeekStats) return [];

    return [
      { name: "Réalisées", value: thisWeekStats.completedRuns, color: "#2B4BF2" },
      { name: "Restants", value: Math.max(0, thisWeekStats.goalRuns - thisWeekStats.completedRuns), color: "#E8ECFF" },
    ];
  }, [thisWeekStats]);

  // Calculate averages
  const averageKm = useMemo(() => {
    if (weeklyKmData.length === 0) return 0;
    const total = weeklyKmData.reduce((sum, week) => sum + week.km, 0);
    return (total / weeklyKmData.length).toFixed(0);
  }, [weeklyKmData]);

  const averageBpm = useMemo(() => {
    if (heartRateData.length === 0) return 0;
    const total = heartRateData.reduce((sum, day) => sum + day.avg, 0);
    return Math.round(total / heartRateData.length);
  }, [heartRateData]);

  // Date range labels
  const kmDateRange = useMemo(() => {
    if (weekRanges.length === 0) return "";
    const start = new Date(weekRanges[0].startWeek);
    const end = new Date(weekRanges[weekRanges.length - 1].endWeek);
    return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
  }, [weekRanges]);

  const bpmDateRange = useMemo(() => {
    const start = new Date(bpmRange.startWeek);
    const end = new Date(bpmRange.endWeek);
    return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
  }, [bpmRange]);

  // Loading state
  if (loadingUser || initialLoadingKm || initialLoadingBpm) {
    return (
      <div className="home-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (errorUser || errorKmActivity || errorBpmActivity) {
    return (
      <div className="home-container">
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
          <p>Erreur: {errorUser || errorKmActivity || errorBpmActivity}</p>
        </div>
      </div>
    );
  }

  if (!userInfo || !thisWeekStats) {
    return (
      <div className="home-container">
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
    totalDistance: parseFloat(userInfo.statistics.totalDistance).toFixed(0),
    avatar: userInfo.profile.profilePicture,
  };

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
                <h3 className="chart-value blue">
                  {loadingKmNav ? '...' : `${averageKm}km en moyenne`}
                </h3>
                <div className="date-navigation">
                  <button
                    className="nav-btn"
                    aria-label="4 semaines précédentes"
                    onClick={handleKmPrevious}
                    disabled={loadingKmNav}
                  >
                    <ChevronLeftIcon />
                  </button>
                  <span className="date-range">{kmDateRange}</span>
                  <button
                    className="nav-btn"
                    aria-label="4 semaines suivantes"
                    onClick={handleKmNext}
                    disabled={kmPeriodOffset === 0 || loadingKmNav}
                  >
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
                <h3 className="chart-value red">
                  {loadingBpmNav ? '...' : `${averageBpm} BPM`}
                </h3>
                <div className="date-navigation">
                  <button
                    className="nav-btn"
                    aria-label="Semaine précédente"
                    onClick={handleBpmPrevious}
                    disabled={loadingBpmNav}
                  >
                    <ChevronLeftIcon />
                  </button>
                  <span className="date-range">{bpmDateRange}</span>
                  <button
                    className="nav-btn"
                    aria-label="Semaine suivante"
                    onClick={handleBpmNext}
                    disabled={bpmPeriodOffset === 0 || loadingBpmNav}
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
              <p className="chart-subtitle">Fréquence cardiaque moyenne (7 derniers jours)</p>
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
                Moy BPM
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
