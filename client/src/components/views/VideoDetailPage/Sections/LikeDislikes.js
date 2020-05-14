import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd' ;
import Axios from 'axios';
import { useSelector } from 'react-redux';

function LikeDislikes(props) {

    const user = useSelector( state => state.user )

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)

    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikeAction, setDisLikeAction] = useState(null)

    let variable = {}
    
    if(props.video) {
        variable = { videoId : props.videoId , userId :props.userId}
    } else {
        variable = { commentId : props.commentId , userId : props.userId}
    }

    // 좋아요
    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                if(response.data.success) {
                    // 얼마나 많은 좋아요를 받았는지
                    setLikes(response.data.likes.length)

                    // 내가 이미 그 좋아요를 눌렀는지
                    response.data.likes.map(like => {
                        if(like.userId === props.userId){
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert('Likes에서 정보를 가져오는데 실패했습니다.')
                }
            })
    }, [])

    // 싫어요
    useEffect(() => {
        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                if(response.data.success) {
                    // 얼마나 많은 싫어요를 받았는지
                    setDislikes(response.data.dislikes.length)

                    // 내가 이미 그 싫어요를 눌렀는지
                    response.data.dislikes.map(dislike => {
                        if(dislike.userId === props.userId){
                            setDisLikeAction('disliked')
                        }
                    })
                } else {
                    alert('DisLikes에서 정보를 가져오는데 실패했습니다.')
                }
            })
    }, [])

    // 좋아요 버튼을 눌렀을 때
    const onLike = () => {
        if(user.userData.isAuth === true){
            if(LikeAction === null){    
                // 아무것도 클릭 되어 있지 않다면 ==> 좋아요 1 올리기
                Axios.post('/api/like/upLike', variable)
                    .then(response => {
                        if(response.data.success) {
                            setLikes(Likes + 1)
                            setLikeAction('liked')
    
                            // 싫어요버튼이 이미 클릭 되어 있다면 ==> 좋아요 1 올리고, 싫어요 1 내리기
                            if(DisLikeAction !== null){     
                                setDisLikeAction(null)
                                setDislikes(Dislikes - 1)
                            }
                        } else {
                            alert('Like를 올리지 못하였습니다.')
                        }
                    })
            } else {
                // 좋아요 버튼이 이미 클릭 되어 있다면 ==> 좋아요 1내리기
                Axios.post('/api/like/unLike', variable)
                    .then(response => {
                        if(response.data.success) {
                            setLikes(Likes - 1)
                            setLikeAction(null)
                        } else {
                            alert('Like를 내리지 못하였습니다.')
                        }
                    })
            }
        }else{
            alert("로그인 후 댓글을 작성해 주세요")
            window.location.href='http://localhost:3000/login'
        }
    }

    // 싫어요 버튼을 눌렀을 때
    const onDislike = () => {
        if(user.userData.isAuth === true){
            if(DisLikeAction === null){
                // 아무것도 클릭 되어 있지 않다면 ==> 싫어요 1 올리기
                Axios.post('/api/like/upDislike', variable)
                    .then(response => {
                        if(response.data.success) {
                            setDislikes(Dislikes + 1)
                            setDisLikeAction('disliked')
    
                            // 좋아요 버튼이 이미 클릭 되어 있다면 ==> 싫어요 1 올리고, 좋아요 1 내리기
                            if(LikeAction !== null){
                                setLikeAction(null)
                                setLikes(Likes -1)
                            }
                        } else {
                            alert('Dislike를 올리지 못하였습니다.')
                        } 
                    })
            } else {
                // 싫어요 버튼이 이미 클릭 되어 있다면 ==> 싫어요 1 내리기
                Axios.post('/api/like/unDislike', variable)
                    .then(response => {
                        if(response.data.success){
                            setDislikes(Dislikes - 1)
                            setDisLikeAction(null)
                        } else {
                            alert('Dislike를 내리지 못하였습니다.')
                        }
                    })
            }
        } else {
            alert("로그인 후 댓글을 작성해 주세요")
            window.location.href='http://localhost:3000/login'
        }
    }
    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
            </span>
            <span style={{ paddingLeft : '8px',paddingRight : '8px', cursor : 'auto'}}> {Likes} </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
            </span>
            <span style={{ paddingLeft : '8px',paddingRight : '8px', cursor : 'auto'}}> {Dislikes} </span>
        </div>
    )
}

export default LikeDislikes
