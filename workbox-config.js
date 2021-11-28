module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{css,png,js,html,json}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: './sw.js'
};