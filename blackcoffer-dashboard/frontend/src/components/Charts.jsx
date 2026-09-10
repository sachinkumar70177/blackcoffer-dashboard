import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const COLORS = [
  "#5b8def",
  "#f5a623",
  "#7ed957",
  "#e85c5c",
  "#b06cf0",
  "#3fc9c9",
  "#f778a1",
  "#c9d34d",
  "#6c7bff",
  "#ff9f6c",
];

const tooltipStyle = {
  background: "#1a1f2e",
  border: "1px solid #333a4d",
  borderRadius: 8,
  fontSize: 12,
  color: "#e6e8ee",
};
const axisStyle = { fontSize: 11, fill: "#8b93a7" };

export function KpiRow({ averages }) {
  const a = averages || {};
  const cards = [
    { label: "Total Records", value: a.total ?? 0 },
    { label: "Avg Intensity", value: (a.avgIntensity ?? 0).toFixed(2) },
    { label: "Avg Likelihood", value: (a.avgLikelihood ?? 0).toFixed(2) },
    { label: "Avg Relevance", value: (a.avgRelevance ?? 0).toFixed(2) },
  ];
  return (
    <div className="kpi-row">
      {cards.map((c) => (
        <div className="kpi-card" key={c.label}>
          <div className="label">{c.label}</div>
          <div className="value">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

export function TopicIntensityChart({ data }) {
  const chartData = (data || []).map((d) => ({
    topic: d._id || "Unknown",
    Intensity: +d.avgIntensity.toFixed(2),
    Likelihood: +d.avgLikelihood.toFixed(2),
    Relevance: +d.avgRelevance.toFixed(2),
    count: d.count,
  }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#262b3a" />
        <XAxis
          dataKey="topic"
          tick={axisStyle}
          interval={0}
          angle={-35}
          textAnchor="end"
          height={70}
        />
        <YAxis tick={axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Intensity" fill="#5b8def" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Likelihood" fill="#f5a623" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Relevance" fill="#7ed957" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RegionPieChart({ data }) {
  const chartData = (data || []).map((d) => ({
    name: d._id || "Unknown",
    value: d.count,
  }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={110}
          label={(e) => `${e.name} (${e.value})`}
        >
          {chartData.map((entry, i) => (
            <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PestleBarChart({ data }) {
  const chartData = (data || []).map((d) => ({
    name: d._id || "Unknown",
    count: d.count,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262b3a" />
        <XAxis type="number" tick={axisStyle} />
        <YAxis type="category" dataKey="name" tick={axisStyle} width={100} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill="#b06cf0" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SectorRelevanceChart({ data }) {
  const chartData = (data || []).map((d) => ({
    sector: d._id || "Unknown",
    Records: d.count,
    "Avg Relevance": +d.avgRelevance.toFixed(2),
  }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, left: 0, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#262b3a" />
        <XAxis
          dataKey="sector"
          tick={axisStyle}
          interval={0}
          angle={-35}
          textAnchor="end"
          height={90}
        />
        <YAxis tick={axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Records" fill="#3fc9c9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Avg Relevance" fill="#ff9f6c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CountryChart({ data }) {
  const chartData = (data || []).map((d) => ({
    country: d._id || "Unknown",
    count: d.count,
    avgIntensity: +d.avgIntensity.toFixed(2),
  }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, left: 0, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#262b3a" />
        <XAxis
          dataKey="country"
          tick={axisStyle}
          interval={0}
          angle={-35}
          textAnchor="end"
          height={90}
        />
        <YAxis tick={axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill="#6c7bff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function YearTrendChart({ data }) {
  const chartData = (data || [])
    .filter((d) => d._id !== null && d._id !== "")
    .map((d) => ({
      year: d._id,
      "Avg Intensity": +d.avgIntensity.toFixed(2),
      "Avg Likelihood": +d.avgLikelihood.toFixed(2),
      count: d.count,
    }))
    .sort((a, b) => a.year - b.year);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#262b3a" />
        <XAxis dataKey="year" tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="Avg Intensity"
          stroke="#5b8def"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="Avg Likelihood"
          stroke="#f5a623"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopicRadar({ data }) {
  const chartData = (data || []).slice(0, 8).map((d) => ({
    topic: d._id || "Unknown",
    Intensity: +d.avgIntensity.toFixed(2),
    Likelihood: +d.avgLikelihood.toFixed(2),
    Relevance: +d.avgRelevance.toFixed(2),
  }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={chartData} outerRadius={110}>
        <PolarGrid stroke="#262b3a" />
        <PolarAngleAxis
          dataKey="topic"
          tick={{ fontSize: 10, fill: "#8b93a7" }}
        />
        <PolarRadiusAxis tick={{ fontSize: 10, fill: "#8b93a7" }} />
        <Radar
          name="Intensity"
          dataKey="Intensity"
          stroke="#5b8def"
          fill="#5b8def"
          fillOpacity={0.35}
        />
        <Radar
          name="Likelihood"
          dataKey="Likelihood"
          stroke="#f5a623"
          fill="#f5a623"
          fillOpacity={0.25}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function IntensityLikelihoodScatter({ records }) {
  const chartData = (records || []).map((r) => ({
    x: r.likelihood,
    y: r.intensity,
    z: r.relevance || 1,
    name: r.topic || r.title,
  }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262b3a" />
        <XAxis type="number" dataKey="x" name="Likelihood" tick={axisStyle} />
        <YAxis type="number" dataKey="y" name="Intensity" tick={axisStyle} />
        <ZAxis type="number" dataKey="z" range={[40, 240]} name="Relevance" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={tooltipStyle}
        />
        <Scatter data={chartData} fill="#7ed957" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
