if (process.env.NODE_ENV === 'production') {
	module.exports.frontEndSecret = '(ul#|]g0$iEILV!ao&i|924@gV0b~WYw)sQlVdGyU+yS)5zZ.-w7gH-AxIDmzOZ';
	module.exports.backendUrl = 'https://aflapp.bellatrix.uberspace.de/nodejs';
}
else {
	module.exports.frontEndSecret = 'currentFrontendSecret';
	module.exports.backendUrl = 'http://localhost:3000';
}