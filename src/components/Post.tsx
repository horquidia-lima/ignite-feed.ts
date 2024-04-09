import {format, formatDistanceToNow} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react'


interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content {
    type: 'paragraph' | 'link';
    content: string;
}

export interface PostType {
    id: number;
    author: Author;
    publishedAt: Date;
    content: Content[];
}

interface PostProps {
    post: PostType;
}

export function Post({post}: PostProps){
    const [comments, setComments] = useState([
        'Post muito bacana, hein?'
    ])

    const [newCommentText, setNewCommentText] = useState('')

    const publishedDateFormatted = format(post.publishedAt, "d 'de' LLLL 'as' HH:mm'h'", {
        locale: ptBR,
    })

    const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
        locale: ptBR,
        addSuffix: true,
    })

    function handleCreateNewComment(event: FormEvent){
        event.preventDefault()
        
        //imperativa - const newCommentText = event.target.comment.value
        setComments([...comments,newCommentText])
        setNewCommentText('')

        //event.target.comment.value = ''
    }

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>){
        event.target.setCustomValidity('')
        setNewCommentText(event.target.value)
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>){
        event.target.setCustomValidity('Esse campo e obrigatorio')
    }

    function deleteComment(commentToDelete: string){
        const commentWithoutDeleteOne = comments.filter(comment =>{
            return comment != commentToDelete
        })
        setComments(commentWithoutDeleteOne)
    }

    const isNewCommentEmpty = newCommentText.length === 0

    return(
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={post.author.avatarUrl}/>
                    <div className={styles.authorInfo}>
                        <strong>{post.author.name}</strong>
                        <span>{post.author.role}</span>
                    </div>
                </div>

                <time title={publishedDateFormatted} dateTime={post.publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}
                </time>
            </header>

            <div className={styles.content}>
                {post.content.map(line => {
                    if(line.type === 'paragraph') {
                        return <p key={line.content}>{line.content}</p>
                    }else if(line.type === 'link'){
                        return <p key={line.content}><a href="">{line.content}</a></p>
                    }
                })} 
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.comentForm}>
                <strong>Deixe seu feedback</strong>

                <textarea
                    name='comment'
                    placeholder='Nossa, adorei amigo!'
                    value={newCommentText}
                    onChange={handleNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    required
                />

                <footer>
                    <button type='submit'disabled={isNewCommentEmpty}>
                        Publicar
                    </button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {
                    comments.map( comment =>{
                        return( 
                        <Comment 
                            key={comment} 
                            content={comment}
                            onDeleteComment={deleteComment}
                        />
                        )
                    })
                }
            </div>
        </article>
    )
}