import React, {useEffect, useState} from 'react';
import Axios from 'axios';

function Subscribe(props) {

    const [SubscibeNumber, setSubscibeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        let variable = {userTo: props.userTo}

        Axios.post('/api/suvscribe/subscribeNumber', variable)
            .then( response => {
                if (response.data.success) {
                    setSubscibeNumber(response.data.SubscibeNumber)
                } else {
                    alert( '구독자 수 정보를 받아오지 못했습니다.');
                }
            })

        let SubscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

        Axios.post('/api/subscribe/subscribed', SubscribedVariable )
        .then(response => {
            if (response.data.success) {
                setSubscribed(response.data.Subscribed)
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
                onClick
            >
               {SubscibeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
