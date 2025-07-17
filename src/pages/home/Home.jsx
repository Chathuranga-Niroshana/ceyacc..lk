import React, { useEffect } from 'react'
import PostCard from '../../components/widgets/PostCard';
import MostEngagingUsers from './MostEngagingUsers'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPost } from '../../features/posts/postSlice';


const Home = () => {
    const posts = useSelector((state) => state.posts.allPosts);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchPost()(dispatch).then((result) => {
            if (fetchPost.fulfilled.match(result)) {
                console.log('Posts fetched successfully:', result.payload);
            } else {
                console.error('Failed to fetch posts:', result.error.message);
            }
        }).catch((error) => {
            console.error('Error fetching posts:', error);
        });
    }, [dispatch])
    return (
        <div className=''>
            {/* today most engaging 5 users */}
            <div className='flex flex-col justify-center items-center'>
                <MostEngagingUsers />
            </div>

            {/* posts */}
            <div className='flex flex-col justify-center items-center gap-10 mt-10'>
                {posts?.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

export default Home