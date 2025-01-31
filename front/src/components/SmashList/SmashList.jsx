import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import SmashCard from '../Card/SmashCard';

import { useDispatch, useSelector } from 'react-redux';
import { getRandomMatches } from '../../redux/slices/matchSlice';
import { createLike } from '../../redux/slices/smashSlice';

export default function SmashList() {
    const dispatch = useDispatch();
    const { items: users, isLoading, error } = useSelector((state) => state.match);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
          dispatch(getRandomMatches());
        }
      }, [dispatch, user]);

    const [direction, setDirection] = useState(null);

    // Motion values for rotation
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    // Tilt transformation
    const rotate = useTransform([rotateX, rotateY], ([latestX, latestY]) => latestY / 10 + latestX / 10);

    const handleAction = async (action) => {
        setDirection(action);
        if (users.length > 0 && user) {
            const matchId = users[0]._id;
            const likeData = {
                userId: user.id,
                matchId,
                type: action === 'pass' ? 2 : 1 // Type 2 for pass, 1 for smash
            };
            dispatch(createLike(likeData));
            // Retirer la carte actuelle après l'action
            setTimeout(() => {
                dispatch(getRandomMatches());
                setDirection(null);
                // Reset rotation after action
                rotateX.set(0);
                rotateY.set(0);
            }, 500);
        }
    };

    const handleMouseMove = (event, action) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left; // X position within the element
        const y = event.clientY - bounds.top;  // Y position within the element

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        const rotateAmountX = (deltaY / centerY) * 60;

        let rotateAmountY = (deltaX / centerX) * 60;

        if (action === 'pass') {
            rotateAmountY = Math.min(rotateAmountY, 0);
        } else if (action === 'smash') {
            rotateAmountY = Math.max(rotateAmountY, 0);
        }

        rotateX.set(rotateAmountX);
        rotateY.set(rotateAmountY);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    const handleDragEnd = (event, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset + velocity > 200) {
            handleAction('smash');
        } else if (offset + velocity < -200) {
            handleAction('pass');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white select-none relative">
            <div className="flex items-center justify-between w-full relative z-5">
                {/* Zone PASS à gauche */}
                <motion.div
                    className="h-full sm:h-[50rem] md:h-[54rem] lg:h-[58rem] w-1/2 bg-gradient-to-r from-red-900 via-red-700 to-red-500 flex items-center justify-center cursor-pointer p-4 relative"
                    onClick={() => handleAction('pass')}
                    onMouseMove={(e) => handleMouseMove(e, 'pass')}
                    onMouseLeave={handleMouseLeave}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence>
                        {direction === 'pass' && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.3 }}
                                className="absolute text-white text-9xl font-extrabold drop-shadow-lg"
                            >
                                PASS !
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <span className="text-white text-6xl font-extrabold drop-shadow-lg">
                        {direction === 'pass' ? '' : 'PASS'}
                    </span>
                </motion.div>

                {/* Zone SMASH à droite */}
                <motion.div
                    className="h-full sm:h-[50rem] md:h-[54rem] lg:h-[58rem] w-1/2 bg-gradient-to-l from-lime-600 via-lime-500 to-lime-200 flex items-center justify-center cursor-pointer p-4 relative"
                    onClick={() => handleAction('smash')}
                    onMouseMove={(e) => handleMouseMove(e, 'smash')}
                    onMouseLeave={handleMouseLeave}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence>
                        {direction === 'smash' && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.3 }}
                                className="absolute text-white text-9xl font-extrabold drop-shadow-lg"
                            >
                                SMASH !
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <span className="text-white text-6xl font-extrabold drop-shadow-lg">
                        {direction === 'smash' ? '' : 'SMASH'}
                    </span>
                </motion.div>
            </div>

            {/* SmashCard au centre */}
            <div className="flex items-center justify-center w-full absolute z-6 pointer-events-none">
                <AnimatePresence>
                    {users.length > 0 && (
                        <motion.div
                            key={users[0]._id}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 0.85, opacity: 1 }}
                            exit={{
                                x: direction === 'smash' ? 500 : -500,
                                rotate: direction === 'smash' ? 30 : -30,
                                opacity: 0,
                            }}
                            transition={{ duration: 0.5 }}
                            className="relative z-0 pointer-events-auto"
                            style={{ rotate: rotate }}
                            drag="x"
                            dragConstraints={false}
                            dragElastic={0.2}
                            onDrag={(e, info) => {
                                // Inclinaison pendant le drag
                                rotateX.set(info.offset.y / 2);
                                rotateY.set(info.offset.x / 2);
                            }}
                            onDragEnd={handleDragEnd}
                        >
                            <SmashCard {...users[0]} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {users.length === 0 && (
                <p className="absolute bottom-10 text-xl text-gray-300 select-none">Aucune carte disponible</p>
            )}
        </div>
    );
}