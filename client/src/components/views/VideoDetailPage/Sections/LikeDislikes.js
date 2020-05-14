import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd' ;
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)

    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikeAction, setDisLikeAction] = useState(null)

    let variable = {}
    
    if(props.video) {
        variable = { videoId : props.videoId , userId :props.userId}
    } else {
        // variable = { commentId : , userId : }
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


    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                         theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                         onClick
                    />
                </Tooltip>
            </span>
            <span style={{ paddingLeft : '8px',paddingRight : '8px', cursor : 'auto'}}> {Likes} </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                         theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
                         onClick
                    />
                </Tooltip>
            </span>
            <span style={{ paddingLeft : '8px',paddingRight : '8px', cursor : 'auto'}}> {Dislikes} </span>
        </div>
    )
}

export default LikeDislikes
