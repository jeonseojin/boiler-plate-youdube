import Axios from 'axios';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import SingleComment from './SingleComment'
import { Button, Input } from 'antd';
const { TextArea } = Input;

function Comment(props) {
    const user = useSelector(state => state.user);
    const videoId = props.postId;
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }
        console.log(variables)
        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if (response.data.success) {
                props.refreshFunction(response.data.result)
                setcommentValue("")
            } else {
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />
            {/* Comment lists */}
            {props.commentLists && props.commentLists.map((comment, index) =>(
                (!comment.responseTo &&
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                )
        ))}

            {/* Root Comment form */}

            <form style={{display: 'flex'}} onSubmit={onSubmit} >
                <TextArea
                    style={{width: '100%', borderRadius: '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='코멘트를 작성해 주세요'
                />
                <br />
                <Button style={{width: '20%', height:'52px'}} onClick={onSubmit} >Submit</Button>

            </form>
        </div>
    )
}

export default Comment
