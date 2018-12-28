const fs = require('fs')
fs.writeFileSync('./.env', `AUTH_KEY=${process.env.AUTH_KEY}\n BACKEND_URL=${process.env.BACKEND_URL}\n`)