require('dotenv').config()
const clientID = process.env.clientID
const clientSecret = process.env.clientSecret
const token = process.env.token
const Slack = require('slack')
const request = require('request')
const fastify = require('fastify')()
const bot = new Slack({token})

const loginURL = `https://slack.com/oauth/authorize?scope=identity.basic&client_id=${clientID}`


fastify.get('/oauth', function (req, rep) {
  debugger;
  const oauthAccessURL = `https://slack.com/api/oauth.access?client_id=${clientID}&client_secret=${clientSecret}&code=${req.query.code}`
  request(oauthAccessURL, (err, response, body) => {
    debugger;
  })
  rep.send();
})

fastify.listen(8000, '0.0.0.0', function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})






bot.chat.postMessage({channel:"@coquet",text:"meow"}).then(console.log, console.error)

