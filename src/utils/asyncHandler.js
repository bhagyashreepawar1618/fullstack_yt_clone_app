//const asyncHandler = () => {};

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (e) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: er.message,
//     });
//   }
// };

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export default asyncHandler;
