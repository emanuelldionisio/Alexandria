export function validate(schema) {
  return function (req, res, next) {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      console.log(err.message)
      return res.status(400).send({
        status: "error",
        message: "Formato dos dados inválidos.",
        errors: err.message
      });
    }
  };
}
