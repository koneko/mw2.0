require("dotenv").config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const path = require('path')
const fs = require("fs");
const { exec, spawn } = require("child_process");
const ffmpeg = require('fluent-ffmpeg')
// app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/script.js'))
})

app.get("/api/path", async (req, res) => {
    let path = req.query.q
    console.log(path)
    if (!path) return res.send('No path provided.')
    fs.readdir(path, (err, files) => {
        res.send(files)
    })
    // res.send()
})

app.get('/api/file', async (req, res) => {
    let path = req.query.q
    if(path.endsWith('.mp4')) {
        return res.sendFile(path)
    }
    console.log(path)
    res.set('Content-Type', 'video/webm')
    //var result = new ffmpeg({source: path}).format('mp4').pipe(res, {end: true})
    // ffmpeg.ffmpeg(path.toString(), ['pipe:1'], 'ffmpegOutput.mp4', prog => {
        
    // })
    let ffmpeg = spawn('ffmpeg', [
        '-i', path,
        '-f', 'webm',
        '-'
    ]);
    ffmpeg.stdout.pipe(res);
    // ffmpeg.stderr.on('data', (data) => {
    //     console.log(data);
    // });
    // let ffmpeg = exec(`ffmpeg -i ${path} ffmpegOutput.mp4 -progress pipe:1`)
    //         // redirect transcoded ip-cam stream to http response
    //         ffmpeg.stdout.pipe(res);

    //         // error logging
    //         ffmpeg.stderr.setEncoding('utf8');      
    //         ffmpeg.stderr.on('data', (data) => {
    //             console.log(data);
    //         });
        
    // res.on("close", () => { ffmpeg.kill(); });

})

const readPath = async (path) => {
    let out = await fs.readdir(path, (err, files) => {
        return files
    })
    return out

}

app.listen(port, () => console.log('Listening on port ' + port))