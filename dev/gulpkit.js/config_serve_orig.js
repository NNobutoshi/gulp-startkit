
const
  conf_dev = {
    enable : !!JSON.parse( process.env.SERVE_ENV || 'false' ),
    options : {
      port           : 9039,
      browser        : 'Chrome',
      reloadThrottle : 100,
      proxy          : 'localhost:8039',
    },
  }
  // vagrant 用
  // conf_dev = {
  //   options : {
  //     reloadThrottle : 100,
  //     proxy          : 'localhost',
  //     open           : false,
  //   },
  // }
  ,conf_prod = false
;

module.exports = {
  conf_dev,
  conf_prod,
};
