const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
 
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);

        }
        cb(null, true);
    }
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================
router.post("/uploadfiles", (req, res) => {
    
    //비디오를 서버에 저장
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err})
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.fileName })
    })
})


router.post("/thumbnail", (req, res) => {
    
    // 썸네일 생성하고 비디오 러닝타임 가져오기
    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        fileDuration = metadata.format.duration
    });

    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function (filenames) {//파일이름 생성

        filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function (){//생성된 썸네일로 뭘 할지
        console.log(fileDuration)
        return res.json({ success: true, url: filePath, fileDuration: fileDuration});
    })  
    .on('error', function (err) {
        return res.json({ success: false, err});
    })
    .screenshots({ 
        count: 3,//옵션 : 카운트가 3개면 썸네일을 3개 생성하는거임 
        folder: 'uploads/thumbnails',//썸네일이 저장되는 위치
        size: '320x240',//썸네일 사이즈
        filename: 'thumbnail-%b.png'//원래이름
    })

})


router.post("/uploadVideo", (req, res) => {
    
    //비디오 정보들을 저장한다
    
    const video = new Video(req.body);
    video.save((err, doc) => {
        if (err) return res.json({ success: false, err})
        res.status(200).json({ success: true})
    }) //몽고 디비에 저장해주는것
    
})

router.get("/getVideos", (req, res) => {
    
    //비디오를 DB에서 가져와서 클라이언트에 보낸다.
    //비디오 플렛폼안에 있는 모든 비디오 
    Video.find()    
    .populate('writer')
    .exec((err, videos)=> {
        if (err) return res.status(400).send(err);
        res.status(200).json({success: true, videos})
    })
    
})

router.post("/getVideoDetail", (req, res) => {
    Video.findOne({"_id": req.body.videoId})    
    .populate('writer')
    .exec((err, videoDetail)=> {
        if (err) return res.status(400).send(err);
        res.status(200).json({success: true, videoDetail})
    })
    
    
})
router.post("/getSubscriptionVideos", (req, res) => {


    //Need to find all of the Users that I am subscribing to From Subscriber Collection 
    
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })


        //Need to Fetch all of the Videos that belong to the Users that I found in previous step. 
        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })
});
// router.post("/getSubscriptionVideos", (req, res) => {
    
//     //자신의 아이디를 가지고 구독하는 사람들을 찾는다.

//     Subscriber.find({ userFrom: req.body.userFrom })
//     .exec(( err, subscribedUser) => {
//         if (err) return res.status(400).send(err);

//         let subscribedUser = [];

//         subscriberInfo.map((subscriber, i) => {
//             subscribedUser.push(subscriber.userTo);
//         })
//             //찾은 사람들의 비디오를 가지고 온다.
//         Video.find({ writer : {$in: subscribedUser }})
//         .populate('writer')
//         .exec((err, videos) => {
//             if (err) return res.status(400).send(err);
//             res.status(200).json({success: true, videos})
//         })
//     })


// })

module.exports = router;
