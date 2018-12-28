if (process.env.NODE_ENV === 'production') {
	module.exports.frontEndSecret = process.env.AUTH_KEY;
	module.exports.backendUrl = process.env.BACKEND_URL;
}
else {
	module.exports.frontEndSecret = 'currentFrontendSecret';
	module.exports.backendUrl = 'http://localhost:3000';
}