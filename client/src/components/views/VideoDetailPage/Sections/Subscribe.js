import React, {useEffect, useState} from 'react';
import Axios from 'axios';


function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

 

    const onSubscribe = () => {

        let subscribedVarlable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        //이미 구독 중
        if (Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', subscribedVarlable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(SubscribeNumber - 1)
                    setSubscribed(!Subscribed)
                } else {
                    alert( '구독 취소 하는데 실패 했습니다.')
                }
            }) 
        // 아직 구독 전
        } else {
            Axios.post('/api/subscribe/Subscribe', subscribedVarlable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                } else {
                    alert( '구독 하는데 실패 했습니다.')
                }
            }) 

        }
    }
    useEffect(() => {
        let variable = {userTo: props.userTo}

        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then( response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert( '구독자 수 정보를 받아오지 못했습니다.');
                }
            })

        let SubscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

        Axios.post('/api/subscribe/subscribed', SubscribedVariable )
        .then(response => {
            if (response.data.success) {
                // setSubscribed(response.data.Subscribed)
            } else {
                alert( '정보를 받아오지 못했습니다.' );
            }
        })
    }, [])
    return (
        <div>
            <button
                style={{ backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                color: 'white', padding: '10px 16px', border: 'none',
                fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}
                onClick={onSubscribe}
            >
               {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
