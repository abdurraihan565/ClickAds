const errorResponse = (
  res,
  { statusCode = 500, message = 'enternal servar error' }
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
//success reponse handeler
const successResponse = (
  res,
  { statusCode = 200, message = 'success', payload = {} }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    payload,
  });
};
module.exports = { errorResponse, successResponse };
