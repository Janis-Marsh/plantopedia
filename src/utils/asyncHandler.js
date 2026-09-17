const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = asyncHandler

// In an effort to never have to create an another try catch  block or have to copy paste it we have created a wrapper function