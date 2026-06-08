function errorHandler (err, req, res, next){
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        message: message,
        stack : process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

function notFound (req, res, next){
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export { errorHandler, notFound };