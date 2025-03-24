module.exports = async () => {
  global.gc?.();
  process.exit(0);
};