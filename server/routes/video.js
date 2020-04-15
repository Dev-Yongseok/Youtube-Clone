const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, "uploads/");
    },

    filename : function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter : function(req, file, cb) {
        const ext = path.extname(file.originalname);
         // 동영상이 아닐 때
        if (ext !== '.mp4') {
            return cb(new Error('only mp4 allowed'), false)
        } // 동영상 파일 일 때
         cb(null, true)
    }
});

const upload = multer({storage : storage}).single("file")
//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {

    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err){
            res.json({ success : false , err})
        }
        return res.json({success : true, url : res.req.file.path, fileName : res.req.file.fieldname })
    })
});

router.post("/uploadVideo", (req, res) => {
    
    // 비디오 정보들을 저장한다.

    new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json({ success : false , err})
        res.status(200).json({success:true})
    })
});


router.post("/thumbnail", (req, res) => {
    
    // 썸네일을 생성하고 비디오 러닝타임도 가져오기

    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata); // all metadata
        console.log(metadata.format.duration);
        // 러닝타임 가져오기
        fileDuration = metadata.format.duration;
    });
    
    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function(filenames) {
            console.log('Will generate ' + filenames.join(' ,'))
            console.log(filenames)
            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () {
            console.log('Screenshots taken')
            return res.json({success : true, url : filePath , fileDuration : fileDuration})
        })
        .on('error', function (err) {
            console.log(err)
            return res.json({ success : false , err})
        })
        .screenshots({
            count : 3,
            folder : 'uploads/thumbnails',
            size : '320x240'
        })

})

module.exports = router;