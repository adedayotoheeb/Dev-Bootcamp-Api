/*jshint esversion: 6 */
/*jshint esversion: 8*/
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
