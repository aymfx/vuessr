const express = require('express')
const app = express()

const microcache = require('route-cache')
var routeCache = require('route-cache');
app.get('/index', routeCache.cacheSeconds(20), (req, res) => {
    console.log('you will only see this every 20 seconds.');
    res.send('this response will be cached');
})
/* app.get('/index', (req, res) => {
    console.log('you will only see this every 20 seconds.');
    res.send('this response will be cached');
}) */
app.use('/api', express.static('api'));

app.listen(3000, () => {
    console.log(`server started at localhost:${3000}`)
})