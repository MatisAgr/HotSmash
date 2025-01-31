import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLikesByUserId } from '../../redux/slices/smashSlice';

const UserLikes = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.profile);
    const likes = useSelector((state) => state.smash.likes);
    const likesStatus = useSelector((state) => state.smash.status);

    useEffect(() => {
        if (user) {
            dispatch(getLikesByUserId(user.id));
        }
    }, [dispatch, user]);

    if (likesStatus === 'loading') {
        return <p>Loading likes...</p>;
    }

    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">User Likes</h2>
            {likes.length > 0 ? (
                <ul className="list-disc list-inside">
                    {likes.map((like) => (
                        <li key={like.id}>{like.matchId}</li>
                    ))}
                </ul>
            ) : (
                <p>No likes found.</p>
            )}
        </div>
    );
};

export default UserLikes;