function generateRandomNormal(mean) {
  let variance = (mean / 4) * (mean / 4);
  // Box-Muller transform to generate random numbers from a standard normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  // Adjust mean and variance
  const randomNormal = mean + Math.sqrt(variance) * z1;
  return randomNormal;
}
