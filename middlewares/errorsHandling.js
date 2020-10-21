module.exports = (err, req, res, next) => {
    switch (err.name) {
        case "JsonWebTokenError":
            return res.status(401).json({
                code: 401,
                type: 'Unauthorized',
                name: err.name,
                errors: `invalid token`
            })
            break;
        case "SequelizeValidationError":
            let errors = err.errors.map(el => {
                return {
                    message: el.message
                }
            })
            return res.status(400).json({
                code: 400,
                type: 'Bad Request',
                errors
            })
            break;
        case 'SequelizeUniqueConstraintError':
            errors = err.errors.map(el => {
                return {
                    message: el.message
                };
            });
            return res.status(400).json({
                errors
            });
            break;

        case 'BadRequest':
            return res.status(400).json({
                code: 400,
                type: 'Bad Request',
            })
            break;

        case 'NotFound':
            return res.status(404).json({
                code: 404,
                type: 'Not Found',
            })
            break;

        case 'InvalidLogin':
            return res.status(400).json({
                errors: {
                    type: 'Bad Request',
                    msg: 'Invalid email/password'
                }
            })
            break;

        case 'Error':
            return res.status(404).json({
                code: 404,
                type: 'Not Found',
            })
            break;
        default:
            return res.status(500).json({
                errors: {
                    type: 'Internal Server Error',
                    status: 500
                }
            })
            break;
    }
}