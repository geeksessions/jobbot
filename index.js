require('dotenv').config()
const clientID = process.env.clientID
const clientSecret = process.env.clientSecret
const token = process.env.token
const Slack = require('slack')
const request = require('request')
const fastify = require('fastify')()
const bot = new Slack({token})
const pouchdb = require('pouchdb')
const ws = require('ws')

// const loginURL = `https://slack.com/oauth/authorize?scope=identity.basic&client_id=${clientID}`

// fastify.get('/oauth', function (req, rep) {
//   const oauthAccessURL = `https://slack.com/api/oauth.access?client_id=${clientID}&client_secret=${clientSecret}&code=${req.query.code}`
//   request(oauthAccessURL, (err, response, body) => {
//   })
//   rep.send();
// })

// fastify.listen(8000, '0.0.0.0', function (err) {
//   if (err) throw err
//   console.log(`server listening on ${fastify.server.address().port}`)
// })

const DB = new pouchdb("http://jobbot:jobz-for-tha-baes@localhost:5984/jobboard")

DB.allDocs().then((data)=>{
  console.log("mamammama",data)
}).catch(console.error)

function isMessage(message) {
  if (message.type !== 'message') {
    return false;
  }

  return true;
}

function isPinnedMessage(message) {
  const isItAMessage = isMessage(message)
  const isPinned = message.subtype === 'pinned_item'

  return isItAMessage && isPinned;
}

function extractPost(message) {
  const attachement = message.attachments[0]
  let post = {
    timestamp: attachement.ts,
    author_id: attachement.author_id,
    author_name: attachement.author_subname,
    author_icon: attachement.author_icon,
    raw: attachement.text,
    mrkdwn_in: attachement.mrkdwn_in
  }
  
  return post
}

bot.rtm.connect().then(({url}) => {
  const RTMWS = new ws(url);
  RTMWS.on('open', function open() {
    // RTMWS.send('something');
  });
  
  RTMWS.on('message', (response) => {
    data = JSON.parse(response)

    if (isPinnedMessage(data)) {
      const post = extractPost(data)
      console.log(post)
      DB.post(post).then(console.log).catch(console.error)
    }
  });
}).catch(console.error)


// bot.chat.postMessage({channel:"@coquet",text:"meow"}).then(console.log, console.error)

