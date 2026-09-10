const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');

// Fields that can be used as simple equality / multi-value filters
const FILTER_FIELDS = [
  'end_year',
  'topic',
  'sector',
  'region',
  'pestle',
  'source',
  'swot',
  'country',
  'city',
];

// Build a Mongo query object from req.query.
// Each filter field accepts a comma-separated list of values for multi-select filters,
// e.g. /api/insights?topic=oil,gas&region=Northern America
function buildQuery(query) {
  const mongoQuery = {};

  FILTER_FIELDS.forEach((field) => {
    if (query[field]) {
      const values = String(query[field])
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      if (values.length === 1) {
        // end_year is stored as Mixed (number or null) - try numeric match too
        if (field === 'end_year') {
          const asNum = Number(values[0]);
          mongoQuery[field] = Number.isNaN(asNum) ? values[0] : asNum;
        } else {
          mongoQuery[field] = values[0];
        }
      } else if (values.length > 1) {
        mongoQuery[field] = { $in: values };
      }
    }
  });

  // Numeric range filters: intensity, likelihood, relevance (each as min,max)
  ['intensity', 'likelihood', 'relevance'].forEach((field) => {
    const min = query[`${field}_min`];
    const max = query[`${field}_max`];
    if (min !== undefined || max !== undefined) {
      mongoQuery[field] = {};
      if (min !== undefined) mongoQuery[field].$gte = Number(min);
      if (max !== undefined) mongoQuery[field].$lte = Number(max);
    }
  });

  return mongoQuery;
}

// GET /api/insights  -> filtered list of raw records (for tables / detail views)
router.get('/', async (req, res) => {
  try {
    const query = buildQuery(req.query);
    const limit = Math.min(Number(req.query.limit) || 500, 5000);
    const data = await Insight.find(query).limit(limit).lean();
    res.json({ count: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// GET /api/insights/filters -> distinct values for every filterable field,
// used to populate dropdowns/multi-selects in the dashboard.
router.get('/filters', async (req, res) => {
  try {
    const entries = await Promise.all(
      FILTER_FIELDS.map(async (field) => {
        const values = await Insight.distinct(field);
        return [field, values.filter((v) => v !== '' && v !== null).sort()];
      })
    );
    const result = Object.fromEntries(entries);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
});

// GET /api/insights/stats -> pre-aggregated data for charts, respects the same filters
router.get('/stats', async (req, res) => {
  try {
    const match = buildQuery(req.query);

    const [byTopic, byRegion, byPestle, bySector, byCountryTop, byYear, averages] =
      await Promise.all([
        Insight.aggregate([
          { $match: match },
          { $match: { topic: { $ne: '' } } },
          {
            $group: {
              _id: '$topic',
              avgIntensity: { $avg: '$intensity' },
              avgLikelihood: { $avg: '$likelihood' },
              avgRelevance: { $avg: '$relevance' },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ]),
        Insight.aggregate([
          { $match: match },
          { $match: { region: { $ne: '' } } },
          { $group: { _id: '$region', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
          { $sort: { count: -1 } },
        ]),
        Insight.aggregate([
          { $match: match },
          { $match: { pestle: { $ne: '' } } },
          { $group: { _id: '$pestle', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Insight.aggregate([
          { $match: match },
          { $match: { sector: { $ne: '' } } },
          { $group: { _id: '$sector', count: { $sum: 1 }, avgRelevance: { $avg: '$relevance' } } },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ]),
        Insight.aggregate([
          { $match: match },
          { $match: { country: { $ne: '' } } },
          { $group: { _id: '$country', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ]),
        Insight.aggregate([
          { $match: match },
          { $match: { end_year: { $ne: null } } },
          {
            $group: {
              _id: '$end_year',
              count: { $sum: 1 },
              avgIntensity: { $avg: '$intensity' },
              avgLikelihood: { $avg: '$likelihood' },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Insight.aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              avgIntensity: { $avg: '$intensity' },
              avgLikelihood: { $avg: '$likelihood' },
              avgRelevance: { $avg: '$relevance' },
              total: { $sum: 1 },
            },
          },
        ]),
      ]);

    res.json({
      byTopic,
      byRegion,
      byPestle,
      bySector,
      byCountry: byCountryTop,
      byYear,
      averages: averages[0] || { avgIntensity: 0, avgLikelihood: 0, avgRelevance: 0, total: 0 },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

module.exports = router;
