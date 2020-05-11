import React, { useEffect, useState } from 'react'
import {Row, Col, List, Avatar} from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'

function VideoDetailPage(props) {

    const videoId  = props.match.params.videoId
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])
    const [CommentCount, setCommentCount] = useState("")

    useEffect(() => {

        // 비디오 정보 가져오기
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.videoDetail.filePath)
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다.')
                }
            })
            
        // 댓글 정보 가져오기
        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.comments)
                    setCommentCount(response.data.comments.length)
                    setComments(response.data.comments)
                } else {
                    alert('댓글 정보를 가져오는데 실패 했습니다.')
                }
            })
    }, [])

    // Comment에서 보내온 결과로 댓글을 저장함
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    if(VideoDetail.writer){
        // console.log(VideoDetail)
        // 로그인 되어 있는 계정의 채널일  경우 구독 버튼 X
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId')
            && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>

        return (
            <Row>
                <Col lg={18} xs={24}>
    
                    <div style={{ width : '100%' , padding : '3rem 4rem'}}>
                        <video style = {{ width : '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                        
                        <List.Item
                            actions={ [ subscribeButton ] }
                        >
                            <List.Item.Meta 
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
    
                        {/* ======== comments =========*/}
                        < Comment // Props ▼
                            refreshFunction = { refreshFunction }
                            commentLists = { Comments }
                            commentCount = { CommentCount }
                            postId = {videoId}
                            videoDetail = { VideoDetail }
                        />
                    </div>
    
                </Col>
    
                {/* Side Video */}
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>


            </Row>
        )


    } else {
        return(
            <div><h2>Loading....</h2></div>
        )
    }
    
}

export default VideoDetailPage
