const calculateRiskDetails = (magnitude, depth) => {
  let riskScore = 0;

  if (magnitude >= 8.0) {
    riskScore += 90;
  } else if (magnitude >= 7.0) {
    riskScore += 75;
  } else if (magnitude >= 6.0) {
    riskScore += 55;
  } else if (magnitude >= 5.0) {
    riskScore += 35;
  } else if (magnitude >= 4.0) {
    riskScore += 15;
  } else {
    riskScore += 5;
  }

  if (depth <= 15) {
    riskScore += 10;
  } else if (depth <= 35) {
    riskScore += 5;
  } else if (depth >= 100) {

    riskScore -= 5;
  }

  riskScore = Math.max(0, Math.min(100, riskScore));

  let riskLevel = 'Low';
  if (riskScore >= 75 || magnitude >= 7.0) {
    riskLevel = 'Critical';
  } else if (riskScore >= 50 || magnitude >= 6.0) {
    riskLevel = 'High';
  } else if (riskScore >= 25 || magnitude >= 4.5) {
    riskLevel = 'Moderate';
  }

  return {
    riskLevel,
    riskScore,
  };
};

export default calculateRiskDetails;
