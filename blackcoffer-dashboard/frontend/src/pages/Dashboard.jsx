import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import {
  KpiRow,
  TopicIntensityChart,
  RegionPieChart,
  PestleBarChart,
  SectorRelevanceChart,
  CountryChart,
  YearTrendChart,
  TopicRadar,
  IntensityLikelihoodScatter,
} from "../components/Charts";
import { fetchFilterOptions, fetchStats, fetchInsights } from "../api";
import "../dashboard.css";

const EMPTY_FILTERS = {
  end_year: [],
  topic: [],
  sector: [],
  region: [],
  pestle: [],
  source: [],
  swot: [],
  country: [],
  city: [],
  intensity_min: "",
  intensity_max: "",
  likelihood_min: "",
  likelihood_max: "",
  relevance_min: "",
  relevance_max: "",
};

export default function Dashboard() {
  const [options, setOptions] = useState({});
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilterOptions()
      .then(setOptions)
      .catch(() =>
        setError("Could not load filter options. Is the backend API running?"),
      );
  }, []);

  const loadData = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, insightsRes] = await Promise.all([
        fetchStats(currentFilters),
        fetchInsights(currentFilters, 300),
      ]);
      setStats(statsRes);
      setRecords(insightsRes.data || []);
    } catch (e) {
      setError(
        "Could not load dashboard data. Is the backend API + MongoDB running?",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleReset = () => setFilters(EMPTY_FILTERS);

  const topicData = useMemo(() => stats?.byTopic || [], [stats]);

  return (
    <div className="app">
      <div className="header">
        <div>
          <Link to="/" className="back-link">
            &larr; Blackcoffer
          </Link>
          <h1>Insights Dashboard</h1>
          <div className="subtitle">
            Intensity · Likelihood · Relevance across Topics, Sectors, Regions
            &amp; Countries
          </div>
        </div>
      </div>

      <div className="layout">
        <FilterBar
          options={options}
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />

        <div>
          {error && <div className="error">{error}</div>}
          {loading && <div className="loading">Loading dashboard…</div>}

          {!loading && !error && stats && (
            <>
              <KpiRow averages={stats.averages} />

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Avg Intensity / Likelihood / Relevance by Topic</h3>
                  <TopicIntensityChart data={topicData} />
                </div>

                <div className="chart-card">
                  <h3>Records by Region</h3>
                  <RegionPieChart data={stats.byRegion} />
                </div>

                <div className="chart-card">
                  <h3>Records by PEST(LE) Category</h3>
                  <PestleBarChart data={stats.byPestle} />
                </div>

                <div className="chart-card">
                  <h3>Sector: Volume vs Avg Relevance</h3>
                  <SectorRelevanceChart data={stats.bySector} />
                </div>

                <div className="chart-card">
                  <h3>Top Countries by Record Count</h3>
                  <CountryChart data={stats.byCountry} />
                </div>

                <div className="chart-card">
                  <h3>Trend by End Year</h3>
                  <YearTrendChart data={stats.byYear} />
                </div>

                <div className="chart-card">
                  <h3>Topic Profile (Radar)</h3>
                  <TopicRadar data={topicData} />
                </div>

                <div className="chart-card">
                  <h3>Intensity vs Likelihood (bubble = Relevance)</h3>
                  <IntensityLikelihoodScatter records={records} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
