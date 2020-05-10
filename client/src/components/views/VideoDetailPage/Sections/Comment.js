import React, { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux' // functional Component 이기 때문에 redux-hook 사용

// Comment.js = Comment Lists + Root Comment Form 
function Comment(props) {
    const videoId = props.postId;

    const user = useSelector(state => state.user )
    const [commentValue, setCommentValue] = useState("")

    // 댓글이 입력 되도록 설정함
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    // 댓글 버튼 눌렀을 때 form 도 같이 제출 되게
    const onSubmit = (event) => {
        event.preventDefault();

        console.log(videoId)

        const variables = {
            content : commentValue,
            writer : user.userData._id ,
            postId : videoId
        }

        if(user.userData.isAuth == true){
            Axios.post('/api/comment/saveComment', variables )
            .then(response => {
                if (response.data.success) {
                    console.log(variables)
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
            <p> Comments </p>
            <hr/>

            {/* Comment Lists = (Single Comment + Reply Comment) */}

            {/* Root Comment Form */}

            <form style = {{ display : 'flex' }} onSubmit = {onSubmit}>
                <textarea
                    style = {{ width : '100%', borderRadius : '5px' }}
                    onChange = { handleClick }
                    value = { commentValue }
                    placeholder="Add a public comment... "
                />
                <br/>
                <button style = {{ border : '0', color : 'white', backgroundColor : 'grey', width : '20%', height : '52px'}} onClick = {onSubmit} > COMMENT </button>
            </form>
        </div>
    )
}

export default Comment
