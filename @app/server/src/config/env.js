/* Use via `node -r @app/config/env path/to/file.js` */
const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../../.env` })

require('./extra')