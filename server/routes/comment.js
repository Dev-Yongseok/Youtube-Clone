const express = require('express');
const router = express.Router();

const { Comment } = require('../models/Comment')

// =======================================
//              Comments
// =======================================

// 댓글 저장
router.post("/saveComment", (req, res) => {

    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if(err) return res.json({ success : false , err })

        // writer의 모든 정보를 가져와서 사용하기 위해서 CommentId를 이용해서 찾아옴!
        // populate : ObjectId를 실 객체로 ,, 중첩 사용시 성능 문제 생김.
        Comment.find({'_id' : comment._id})
            .populate('writer')
            .exec((err, result) => {
                if(err) return res.json({ success : false , err})

                res.status(200).json({success : true, result})
            })
    })
});

// 댓글 가져오기
router.post("/getComments", (req, res) => {

    Comment.find({ "postId" : req.body.videoId })
        .populate('writer')
        .exec((err, comments) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success : true , comments })
        })
})
module.exports = router;
