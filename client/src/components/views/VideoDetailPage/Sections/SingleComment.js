import React, {useState} from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("")

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const handChange = (event) => {
        setCommentValue(event.currentTarget.value);

    }

    const onSubmit = (event) => {
        event.preventDefault();
        
        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        }
        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if (response.data.success) {
                props.refreshFunction(response.data.result);
                setCommentValue("");
                setOpenReply(false);
            } else {
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }

    const actions = [
        
        <span onClick={openReply} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment 
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image } />}
                content={<p>{props.comment.content}</p>}
            />
        {OpenReply && 
            <form style={{display: 'flex'}} onSubmit={onSubmit} >
                <TextArea
                    style={{width: '100%', borderRadius: '5px'}}
                    onChange={handChange}
                    value={CommentValue}
                    placeholder='코멘트를 작성해 주세요'
                />
                <br />
                <Button style={{width: '20%', height:'52px'}} onClick={onSubmit} >Submit</Button>

            </form>
        }
        </div>
    )
}

export default SingleComment
