const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like')
const { Dislike } = require('../models/Dislike')

//===================================
//              Like
//===================================

router.post("/getLikes", (req, res) => {
    
    let variable = {}

    if(req.body.videoId){   // 비디오에 대한 Like 일 경우
        variable = { videoId : req.body.videoId }
    } else {                // 댓글에 대한 Like 일 경우
        variable = { commentId : req.body.commentId }
    }
    
    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success : true , likes })
        })
})

// Like 올리기
router.post("/upLike", (req, res) => {
    
    let variable = {}

    if(req.body.videoId){   // 비디오에 대한 Like 일 경우
        variable = { videoId : req.body.videoId , userId : req.body.userId }
    } else {                // 댓글에 대한 Like 일 경우
        variable = { commentId : req.body.commentId , userId : req.body.userId}
    }
    
    // Like Collection에 클릭 정보를 넣어줌.
    const like = new Like(variable)

    like.save((err, likeResult) => {
        if(err) return res.json({success : false , err})
        
        // 만약 DisLike 이 이미 클릭 되어있다면 , DisLike를 1 줄인다.
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => {
                if(err) return res.status(400).json({success : false , err})
                res.status(200).json({success : true })
            })

    })

})

// Like 버튼이 눌린 상태에서 Like를 또 눌렀을 때 ( 좋아요 취소! )
router.post("/unLike", (req, res) => {
    
    let variable = {}

    if(req.body.videoId){   // 비디오에 대한 Like 일 경우
        variable = { videoId : req.body.videoId , userId : req.body.userId}
    } else {                // 댓글에 대한 Like 일 경우
        variable = { commentId : req.body.commentId , userId : req.body.userId}
    }
    
    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({ success : false , err})
            res.status(200).json({success : true})
        })

})

//===================================
//              Dislike
//===================================

// DisLike 정보 가져오기
router.post("/getDislikes", (req, res) => {
    
    let variable = {}

    if(req.body.videoId){   // 비디오에 대한 DisLike 일 경우
        variable = { videoId : req.body.videoId }
    } else {                // 댓글에 대한 DisLike 일 경우
        variable = { commentId : req.body.commentId }
    }
    
    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success : true , dislikes })
        })
})

// Dislike 올리기
router.post("/upDislike", (req, res) => {
    
    let variable = {}

    if(req.body.videoId){   // 비디오에 대한 DisLike 일 경우
        variable = { videoId : req.body.videoId , userId : req.body.userId}
    } else {                // 댓글에 대한 DisLike 일 경우
        variable = { commentId : req.body.commentId , userId : req.body.userId}
    }
    
    // Dislike Collection에 클릭 정보를 넣어줌.
    const dislike = new Dislike(variable)

    dislike.save((err, dislikeResult) => {
        if(err) return res.json({success : false , err})
        
        // 만약 Like 가 이미 클릭 되어있다면 , Like를 1 줄인다.
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if(err) return res.status(400).json({success : false , err})
                res.status(200).json({success : true })
            })

    })

})

// Dislike 버튼이 눌린 상태에서 Dislike를 또 눌렀을 때 ( 싫어요 취소! )
router.post("/unDislike", (req, res) => {
    
    let variable = {}

    if(req.body.videoId){   // 비디오에 대한 DisLike 일 경우
        variable = { videoId : req.body.videoId , userId : req.body.userId}
    } else {                // 댓글에 대한 DisLike 일 경우
        variable = { commentId : req.body.commentId , userId : req.body.userId}
    }
    
    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({ success : false , err})
            res.status(200).json({success : true})
        })
})

module.exports = router;
