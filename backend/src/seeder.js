import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Earthquake from './models/Earthquake.js';
import calculateRiskDetails from './utils/riskCalculator.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });
const DATA_FILE = join(__dirname, '..', 'data', 'global_earthquakes_10yrs_M4.5_2025-12-10.json');
const BATCH_SIZE = 500;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quakevision');
    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};
const parseNum = (val, isInt = false) => {
  if (val === null || val === undefined || val === '') return null;
  const num = isInt ? parseInt(val, 10) : parseFloat(val);
  return isNaN(num) ? null : num;
};
const transformRecord = (raw) => {
  const latitude = parseFloat(raw.latitude);
  const longitude = parseFloat(raw.longitude);
  const depth = parseFloat(raw.depth);
  const magnitude = parseFloat(raw.mag);
  if (isNaN(latitude) || isNaN(longitude) || isNaN(depth) || isNaN(magnitude)) {
    return null;
  }
  const { riskLevel } = calculateRiskDetails(magnitude, depth);
  return {
    time: new Date(raw.time),
    latitude,
    longitude,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    depth,
    magnitude,
    magType: raw.magType || '',
    nst: parseNum(raw.nst, true),
    gap: parseNum(raw.gap),
    dmin: parseNum(raw.dmin),
    rms: parseNum(raw.rms),
    net: raw.net || '',
    place: raw.place || 'Unknown',
    type: raw.type || 'earthquake',
    status: raw.status || '',
    locationSource: raw.locationSource || '',
    magSource: raw.magSource || '',
    updated: raw.updated ? new Date(raw.updated) : undefined,
    horizontalError: parseNum(raw.horizontalError),
    depthError: parseNum(raw.depthError),
    magError: parseNum(raw.magError),
    magNst: parseNum(raw.magNst, true),
    riskLevel,
  };
};
const seedDatabase = async () => {
  try {
    console.log('\n🌍 QuakeVision Database Seeder');
    console.log('━'.repeat(50));
    console.log(`📂 Reading dataset: ${DATA_FILE}`);
    const rawData = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    console.log(`📊 Total raw records found: ${rawData.length}`);
    console.log('🔄 Transforming and validating records...');
    const transformedData = rawData.map(transformRecord).filter(Boolean);
    console.log(`✅ Valid records after transformation: ${transformedData.length}`);
    console.log(`⚠️  Skipped invalid records: ${rawData.length - transformedData.length}`);
    const existingCount = await Earthquake.countDocuments();
    if (existingCount > 0) {
      console.log(`\n🗑️  Clearing ${existingCount} existing earthquake records...`);
      await Earthquake.deleteMany({});
      console.log('✅ Existing data cleared.');
    }
    console.log(`\n📥 Inserting ${transformedData.length} records in batches of ${BATCH_SIZE}...`);
    let inserted = 0;
    for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
      const batch = transformedData.slice(i, i + BATCH_SIZE);
      await Earthquake.insertMany(batch, { ordered: false });
      inserted += batch.length;
      const progress = ((inserted / transformedData.length) * 100).toFixed(1);
      process.stdout.write(`\r   Progress: ${inserted}/${transformedData.length} (${progress}%)`);
    }
    console.log('\n');
    const finalCount = await Earthquake.countDocuments();
    console.log('━'.repeat(50));
    console.log(`🎉 Seeding Complete!`);
    console.log(`   Total documents in database: ${finalCount}`);
    const riskSummary = await Earthquake.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    console.log('\n📈 Risk Level Distribution:');
    riskSummary.forEach((r) => {
      console.log(`   ${r._id}: ${r.count} earthquakes`);
    });
    const magStats = await Earthquake.aggregate([
      {
        $group: {
          _id: null,
          avgMagnitude: { $avg: '$magnitude' },
          maxMagnitude: { $max: '$magnitude' },
          minMagnitude: { $min: '$magnitude' },
          avgDepth: { $avg: '$depth' },
        },
      },
    ]);
    if (magStats.length > 0) {
      const s = magStats[0];
      console.log('\n📊 Dataset Statistics:');
      console.log(`   Average Magnitude: ${s.avgMagnitude.toFixed(2)}`);
      console.log(`   Max Magnitude:     ${s.maxMagnitude}`);
      console.log(`   Min Magnitude:     ${s.minMagnitude}`);
      console.log(`   Average Depth:     ${s.avgDepth.toFixed(2)} km`);
    }
    console.log('\n━'.repeat(50));
  } catch (error) {
    console.error(`\n❌ Seeding failed: ${error.message}`);
    if (error.code === 'ENOENT') {
      console.error('\n⚠️  Dataset file not found!');
      console.error(`   Please place your JSON file at:`);
      console.error(`   ${DATA_FILE}`);
    }
  }
};
const destroyData = async () => {
  try {
    const count = await Earthquake.countDocuments();
    await Earthquake.deleteMany({});
    console.log(`\n🗑️  Destroyed ${count} earthquake records from database.`);
  } catch (error) {
    console.error(`\n❌ Destroy failed: ${error.message}`);
  }
};
const run = async () => {
  await connectDB();
  if (process.argv.includes('-d') || process.argv.includes('--destroy')) {
    await destroyData();
  } else {
    await seedDatabase();
  }
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed.');
  process.exit(0);
};
run();
