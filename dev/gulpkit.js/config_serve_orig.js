
const
  conf_dev = {
    options : {
      port           : 9039,
      browser        : 'Chrome',
      reloadThrottle : 100,
      proxy          : 'localhost:8039',
    },
  }
  ,conf_prod = false;

module.exports = {
  conf_dev,
  conf_prod,
};
