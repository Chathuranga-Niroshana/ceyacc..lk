import React from 'react'
import PostCard from '../../components/widgets/PostCard';
import { samplePosts } from '../../../database/samplePosts';

const LiveClasses = () => {
    return (
        <div className='flex flex-col justify-center items-center gap-10 mt-10'>
            {samplePosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}

export default LiveClasses