import React, { useState } from 'react'
import { Button, Input } from 'antd';
import Axios from 'axios'
import { useSelector } from 'react-redux' // functional Component 이기 때문에 redux-hook 사용
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'
const { TextArea } = Input ;

// Comment.js = Comment Lists + Root Comment Form 
function Comment(props) {
    const videoId = props.postId;

    const user = useSelector(state => state.user )
    const [CommentValue, setCommentValue] = useState("")

    // 댓글이 입력 되도록 설정함
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    // 댓글 버튼 눌렀을 때 form 도 같이 제출 되게
    const onSubmit = (event) => {
        event.preventDefault();
        setCommentValue("")
        console.log(videoId._id)

        const variables = {
            content : CommentValue,
            writer : user.userData._id ,
            postId : videoId
        }

        if(user.userData.isAuth === true ){
            Axios.post('/api/comment/saveComment', variables )
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result)

                    // 댓글 저장 후 TextArea에 남아 있는 글자 지워줌
                    setCommentValue("")

                    // Comment 에서 결과 값을 Video Detail Page로 보내줌.
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글을 저장하는데 실패 했습니다.')
                    }
                }
            )
        }else{
            alert("로그인 후 댓글을 작성해 주세요")
            window.location.href='http://localhost:3000/login'
        }
    }

    return (
        <div>
            <br />
            <h2> {props.commentCount}   Comments </h2>
            <hr/>

            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        {/* Comment Lists = (Single Comment + Reply Comment) */}
                        <SingleComment 
                            // props
                            videoDetail={props.videoDetail}
                            refreshFunction = {props.refreshFunction}
                            comment={comment}
                            postId = {props.postId}
                        />

                        <ReplyComment 
                            // props
                            postId = {props.postId}
                            parentCommentId={comment._id}
                            commentLists={props.commentLists}
                            refreshFunction = {props.refreshFunction}
                        />
                    </React.Fragment>                    
                )
            ))}

            {/* Root Comment Form */}
            <form style = {{ display : 'flex'}} onSubmit = {onSubmit}>
                <TextArea
                    style = {{ width : '100%', borderRadius : '5px' }}
                    onChange = { handleClick }
                    value = { CommentValue }
                    placeholder="Add a public comment... "
                />
                <br/>
                <Button style = {{ border : '0', color : 'white', backgroundColor : 'grey', width : '20%', height : '52px'}} onClick = {onSubmit} > COMMENT </Button>
            </form>
        </div>
    )
}

export default Comment
