import React from 'react';
import Select from 'react-select';

const selectStyles = {
  control: (base) => ({
    ...base,
    background: '#0f1117',
    borderColor: '#333a4d',
    minHeight: 34,
  }),
  menu: (base) => ({ ...base, background: '#1a1f2e', zIndex: 20 }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? '#262b3a' : '#1a1f2e',
    color: '#e6e8ee',
    fontSize: 13,
  }),
  multiValue: (base) => ({ ...base, background: '#262b3a' }),
  multiValueLabel: (base) => ({ ...base, color: '#e6e8ee' }),
  singleValue: (base) => ({ ...base, color: '#e6e8ee' }),
  input: (base) => ({ ...base, color: '#e6e8ee' }),
  placeholder: (base) => ({ ...base, color: '#6d7488', fontSize: 13 }),
};

// field key -> {label, optionsKey}
const FIELDS = [
  { key: 'end_year', label: 'End Year' },
  { key: 'topic', label: 'Topic' },
  { key: 'sector', label: 'Sector' },
  { key: 'region', label: 'Region' },
  { key: 'pestle', label: 'PEST(LE)' },
  { key: 'source', label: 'Source' },
  { key: 'swot', label: 'SWOT' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
];

export default function FilterBar({ options, filters, onChange, onReset }) {
  const handleSelect = (key, selected) => {
    onChange({ ...filters, [key]: (selected || []).map((s) => s.value) });
  };

  return (
    <div className="filters-panel">
      <h2>Filters</h2>
      {FIELDS.map(({ key, label }) => {
        const opts = (options[key] || []).map((v) => ({ value: v, label: String(v) }));
        const value = (filters[key] || []).map((v) => ({ value: v, label: String(v) }));
        return (
          <div className="filter-group" key={key}>
            <label>{label}</label>
            <Select
              isMulti
              styles={selectStyles}
              options={opts}
              value={value}
              onChange={(sel) => handleSelect(key, sel)}
              placeholder={`Any ${label.toLowerCase()}`}
              noOptionsMessage={() => 'No options'}
            />
          </div>
        );
      })}

      <div className="filter-group">
        <label>Intensity (min - max)</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="min"
            value={filters.intensity_min ?? ''}
            onChange={(e) => onChange({ ...filters, intensity_min: e.target.value })}
            style={{ width: '50%', background: '#0f1117', border: '1px solid #333a4d', color: '#e6e8ee', borderRadius: 6, padding: 6 }}
          />
          <input
            type="number"
            placeholder="max"
            value={filters.intensity_max ?? ''}
            onChange={(e) => onChange({ ...filters, intensity_max: e.target.value })}
            style={{ width: '50%', background: '#0f1117', border: '1px solid #333a4d', color: '#e6e8ee', borderRadius: 6, padding: 6 }}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Likelihood (min - max)</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="min"
            value={filters.likelihood_min ?? ''}
            onChange={(e) => onChange({ ...filters, likelihood_min: e.target.value })}
            style={{ width: '50%', background: '#0f1117', border: '1px solid #333a4d', color: '#e6e8ee', borderRadius: 6, padding: 6 }}
          />
          <input
            type="number"
            placeholder="max"
            value={filters.likelihood_max ?? ''}
            onChange={(e) => onChange({ ...filters, likelihood_max: e.target.value })}
            style={{ width: '50%', background: '#0f1117', border: '1px solid #333a4d', color: '#e6e8ee', borderRadius: 6, padding: 6 }}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Relevance (min - max)</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="min"
            value={filters.relevance_min ?? ''}
            onChange={(e) => onChange({ ...filters, relevance_min: e.target.value })}
            style={{ width: '50%', background: '#0f1117', border: '1px solid #333a4d', color: '#e6e8ee', borderRadius: 6, padding: 6 }}
          />
          <input
            type="number"
            placeholder="max"
            value={filters.relevance_max ?? ''}
            onChange={(e) => onChange({ ...filters, relevance_max: e.target.value })}
            style={{ width: '50%', background: '#0f1117', border: '1px solid #333a4d', color: '#e6e8ee', borderRadius: 6, padding: 6 }}
          />
        </div>
      </div>

      <button className="reset-btn" onClick={onReset}>Reset all filters</button>
    </div>
  );
}
