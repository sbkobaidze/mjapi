require('dotenv').config()

const express = require('express')
const { Midjourney } = require('midjourney')
const app = express()

app.use(express.json())

app.listen('8080', () => {
    console.log('listening on this shitt prort')
})


app.post('/createImage', async (req, res) => {
    const { prompt } = req.body



    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = new Midjourney({
        ServerId: process.env.DISCORD_SERVER_ID,
        ChannelId: process.env.DISCORD_CHANNEL_ID,
        SalaiToken: process.env.DISCORD_SALAI_TOKEN,
      HuggingFaceToken:process.env.HUGGINGFACE_TOKEN,
        Debug: false,
        Ws: true, //enable ws is required for remix mode (and custom zoom)
    });
  
  console.log('test')
  await client.init();
    

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        console.log("imagine.start", prompt);
        client
          .Imagine(prompt, (uri, progress) => {
            console.log("imagine.loading", uri);
            controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
          })
          .then((msg) => {
            console.log("imagine.done", msg);
            controller.enqueue(encoder.encode(JSON.stringify(msg)));
            client.Close();
            controller.close();
          })
          .catch((err) => {
            console.log("imagine.error", err);
            client.Close();
            controller.close();
          });
      },
    });
     new Response(readable, {})
})



