import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState('')
    const [Subscribed, setSubscribed] = useState('')

    useEffect(() => {
    
        let variable = { userTo : props.userTo}
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아 오지 못했습니다.')
                }
            })
    

        let subscribedVariable = { userTo : props.userTo, userFrom : localStorage.getItem('userId')}
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아 오지 못했습니다.')
                }
            })
    }, [])


    const onSubscribe = (e) => {

        let subscribedVariable = {
            userTo : props.userTo ,
            userFrom : props.userFrom
        }

        // 이미 구독 중 이라면
        if(Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribed(SubscribeNumber -1 )
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소하는데 실패했습니다...')
                    }
                })

        // 아직 구독 하지 않은 상태 일 때
        } else {
            Axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(SubscribeNumber +1 )
                    setSubscribed(!Subscribed)
                } else {
                    alert('구독하는데 실패했습니다...')
                }
            })
        }
    }
    
    return (
        <div>
            <button
                style = {{
                    backgroundColor : `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius : '4px',
                    color : 'white' , padding : '14px', 
                    fontWeight : '500', fontSize : '1rem', textTransform : 'uppercase'    
                
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
