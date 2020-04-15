import React, { useEffect } from 'react'
// import { FaCode } from "react-icons/fa";
import { Card, /*Icon,  Avatar, */ Col, Typography, Row } from 'antd';
import Axios from 'axios'
const { Title } = Typography
const { Meta  } = Card;

function LandingPage() {
    useEffect(() => {
       Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success){
                console.log(response.data)
            } else {
                alert('비디오 가져오기를 실패 했습니다.')
            }
        })

    }, [])


    return (
        <div style={{ width : '85%', margin : '3rem auto'}}>
            <Title level={2}> Recomended </Title>
            <hr/>
            <Row gutter={[32, 16]}>
                
                <Col lg={6} md ={8} xs={24}>
                    {/* <a href={`video/post/${video._id}`} > */}
                        {/* <img style={{ width : '100%'}} src={`http:localhost:5000/${video.thumnail}`} alt="thumnail" /> */}
                        <div style={{position : 'relative'}}>
                            <div className="duration">
                                {/* <span>{minutes} : {seconds}</span> */}
                            </div>
                        </div>
                    {/* </a> */}
                    <br />
                    <Meta 
                        // avatar = {
                        //     <Avatar src = {video.writer.image} />
                        // }
                        // title = {video.title}
                        description=""
                    />
                    {/* <span>{video.writer.name} </span><br/> */}
                    {/* <span style={{ marginLeft : '3rem'}}>{video.views} views</span> - <span>{moment(video.createAt).format("MM")}</span> */}
                </Col>

            </Row>
        </div>
    )
}

export default LandingPage
