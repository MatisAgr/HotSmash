import React, { useEffect } from 'react';
import PostComponent from '../../components/Card/PostComponent';
import { getAllPosts, getPostsBefore } from '../../redux/slices/postSlice';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function PostList() {
    const dispatch = useDispatch();
    const { isLoading, error, lastTimestamp, hasMore, posts } = useSelector((state) => state.posts);

    useEffect(() => {
        if (posts.length === 0) {
            dispatch(getAllPosts({ limit: 5 })); // Assurer que le limit est passé ici
        }
    }, [dispatch, posts.length]);

    const fetchMorePosts = () => {
        if (lastTimestamp) {
            dispatch(getPostsBefore({ timestamp: lastTimestamp, limit: 5 }));
        }
    };

    if (isLoading && posts.length === 0) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchMorePosts}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more posts</p>}
            scrollableTarget="scrollableDiv" // Ajouter scrollableTarget
        >
            <div id="scrollableDiv">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostComponent
                            key={post._id}
                            author={post.author}
                            title={post.title}
                            content={post.content}
                            date={new Date(post.createdAt).toLocaleString('fr-FR')}
                        />
                    ))
                ) : (
                    <div>No posts available</div>
                )}
            </div>
        </InfiniteScroll>
    );
}