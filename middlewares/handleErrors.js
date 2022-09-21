export const handleErrors = () => {
  return (err, _req, res, _next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong!'

    return res.status(errorStatus).json({
      success: false,
      stack: err.stack,
      errorMessage,
      errorStatus
    })
  }
}
