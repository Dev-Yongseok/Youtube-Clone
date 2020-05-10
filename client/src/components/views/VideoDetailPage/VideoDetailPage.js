import React, { useEffect, useState } from 'react'
import {Row, Col, List, Avatar} from 'antd'
import Axios from 'axios'
import SideVideo from '../VideoDetailPage/Sections/SideVideo'
import Subscribe from '../VideoDetailPage/Sections/Subscribe'
import Comment from '../VideoDetailPage/Sections/Comment'

function VideoDetailPage(props) {

    const videoId  = props.match.params.videoId
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    
    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.videoDetail.filePath)
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다.')
                }
            })
            
    }, [])

    if(VideoDetail.writer){
        // console.log(VideoDetail)
        // 로그인 되어 있는 계정의 채널일  경우 구독 버튼 X
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId')
            && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>

        return (
            <Row gutter={[16, 16]}>
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
    
                        {/* comments */}
                        < Comment // Props ▼
                            postId = {videoId}
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
