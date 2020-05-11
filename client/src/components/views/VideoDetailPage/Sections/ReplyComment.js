import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {
        let commentNumber = 0;
        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId){
                commentNumber ++
            }
        })

        setChildCommentNumber(commentNumber)

    }, [])

    const renderReplyComment = (parentCommentId) =>
        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {/* Comment Lists = (Single Comment + Reply Comment) */}
                {
                    comment.responseTo === parentCommentId &&
                    <div>
                        <SingleComment 
                            // props
                            key ={index}
                            refreshFunction = {props.refreshFunction}
                            comment={comment}
                            postId = {props.videoId}
                        />

                        <ReplyComment 
                            // props
                            parentCommentId={comment._id}
                            refreshFunction={props.refreshFunction}
                            postId={props.postId}
                            commentLists={props.commentLists}
                        />
                    </div>
                }
            </React.Fragment>
        ))

        const onHandleChange = () => {
            setOpenReplyComments(!OpenReplyComments)
        }

    return (
        <div>
            { ChildCommentNumber > 0 &&
                <p style={{ fontSize : '14px', margin : 0, color : 'grey'}} onClick = {onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            { OpenReplyComments &&
                renderReplyComment(props.parentCommentId) 
            }
        </div>
    )
}

export default ReplyComment
