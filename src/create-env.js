const fs = require('fs')
fs.writeFileSync('./.env', `API_KEY=${process.env.AUTH_KEY}\n`)