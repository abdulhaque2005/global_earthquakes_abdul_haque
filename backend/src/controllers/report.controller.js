import Report from '../models/Report.js';

export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('earthquakeId').populate('generatedBy', 'name email');
    return res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) { next(error); }
};

export const createReport = async (req, res, next) => {
  try {
    const { location, intensity, description } = req.body;

    // Map User-Felt form data to the Report schema
    if (location && description) {
      const userReport = await Report.create({
        title: `Felt Report: ${location}`,
        summary: description,
        type: 'User-Felt',
        metrics: { intensity, location },
        generatedBy: req.user.id
      });
      return res.status(201).json({ success: true, data: userReport });
    }

    const report = await Report.create({
      ...req.body,
      generatedBy: req.user.id
    });
    return res.status(201).json({ success: true, data: report });
  } catch (error) { next(error); }
};

export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Report not found.' });
    return res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
