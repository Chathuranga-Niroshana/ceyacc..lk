import React from 'react'
import PostCard from '../../components/widgets/PostCard';
import MostEngagingUsers from './MostEngagingUsers'
import { samplePosts } from '../../../database/samplePosts';


const Home = () => {
    return (
        <div className=''>
            {/* today most engaging 5 users */}
            <div className='flex flex-col justify-center items-center'>
                <MostEngagingUsers />
            </div>

            {/* posts */}
            <div className='flex flex-col justify-center items-center gap-10 mt-10'>
                {samplePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

export default Home