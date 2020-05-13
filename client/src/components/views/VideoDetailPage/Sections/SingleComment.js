import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import Axios from 'axios';
import { useSelector } from 'react-redux';
const { TextArea } = Input ;

function SingleComment(props) {

    const user = useSelector(state => state.user )

    const [OpenReply, setOpenReply] = useState(false)
    const [ReplyValue, setReplyValue] = useState("")

    // 대댓글 버튼 
    const onClickReplyOpen = ( ) => {
        setOpenReply(!OpenReply);
        console.log(!OpenReply ? "Open" : "Close" )
    }

    const onHandleChange = (event) => {
        setReplyValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        const variables = {
            content : ReplyValue,
            writer : user.userData._id ,
            postId : props.postId ,
            responseTo : props.comment._id
        }

        if(user.userData.isAuth === true){
            Axios.post('/api/comment/saveComment', variables )
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result)

                    // 댓글 저장 후 TextArea에 남아 있는 글자 지워줌
                    setReplyValue("")
                    setOpenReply(!OpenReply)
                    // Comment로 보냄 (Comment를 거쳐서 VideoDetail에 도달)
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

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">  
            Reply
        </span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar 
                            src ={props.comment.writer.image}
                            alt ="User Image"/>
                        }
                content = {<p>{props.comment.content}</p>}
            />

            {/* Default = false */}
            { OpenReply && // Click Reply => Open Reply Form
                    //Reply Form 
                    <form style={{ display: 'flex'}} onSubmit={onSubmit} >
                        <TextArea
                            style={{ width: '100%', borderRadius: '5px' }}
                            onChange={onHandleChange}
                            value={ReplyValue}
                            placeholder="Add a public reply... "
                        />
                        <br />
                        <Button style={{ border: '0', color: 'white', backgroundColor: 'grey', width: '20%', height: '52px' }} onClick={onSubmit} > COMMENT </Button>
                    </form>
            }



        </div>
    )
}

export default SingleComment
