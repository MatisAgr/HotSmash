import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import SmashCard from '../Card/SmashCard';
import { NAME_APP } from '../../constants/NameApp';

import { useDispatch, useSelector } from 'react-redux';
import { getRandomMatches } from '../../redux/slices/matchSlice';
import { createLike } from '../../redux/slices/smashSlice';

export default function SmashList() {
    const dispatch = useDispatch();
    const { items: users, isLoading, error } = useSelector((state) => state.match);
    const user = useSelector((state) => state.auth.user);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (user) {
          dispatch(getRandomMatches());
        }
      }, [dispatch, user]);

    useEffect(() => {
        setCurrentIndex(0);
    }, []);

    const [direction, setDirection] = useState(null);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    const rotate = useTransform([rotateX, rotateY], ([latestX, latestY]) => latestY / 10 + latestX / 10);

    const handleAction = async (action) => {
        setDirection(action);
        if (users.length > 0 && user) {
            const matchId = users[currentIndex]._id;
            const likeData = {
                userId: user.id,
                matchId,
                type: action === 'pass' ? 2 : 1
            };
            dispatch(createLike(likeData));
            setTimeout(() => {
                if (currentIndex >= 4) {
                    dispatch(getRandomMatches());
                    console.log('reset')
                    setCurrentIndex(0);
                }
                else{
                    setCurrentIndex((currentIndex) => currentIndex + 1);
                    setDirection(null);
                    rotateX.set(0);
                    rotateY.set(0);
                }
                console.log('currentIndex', currentIndex)   
              }, 500);
        }
    };

    const handleMouseMove = (event, action) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

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
        <div className="flex items-center justify-center min-h-screen bg-white select-none relative bg-gradient-to-r from-blue-500 via-pink-500 to-red-500">
            <div className="flex items-center justify-between w-full relative z-5">
                {/* Zone PASS à gauche */}
                <motion.div
                    className="h-full sm:h-[50rem] md:h-[54rem] lg:h-[58rem] w-1/2 flex items-center justify-center cursor-pointer p-4 relative"
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
                    className="h-full sm:h-[50rem] md:h-[54rem] lg:h-[58rem] w-1/2 flex items-center justify-center cursor-pointer p-4 relative"
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
            <AnimatePresence mode="wait">
                {users.length > 0 && currentIndex < users.length && (
                    <motion.div
                        key={users[currentIndex]._id}
                        initial={{ scale: 0.85, opacity: 0, x: 0 }}
                        animate={{ scale: 0.85, opacity: 1, x: 0 }}
                        exit={{
                            opacity: 0,
                            x: direction === 'smash' ? 300 : direction === 'pass' ? -300 : 0,
                            rotate: direction === 'smash' ? 15 : direction === 'pass' ? -15 : 0,
                            transition: { duration: 0.5, ease: "easeInOut" }
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative z-0 pointer-events-auto"
                        style={{ rotate: rotate }}
                        drag="x"
                        dragConstraints={false}
                        dragElastic={0.2}
                        onDrag={(e, info) => {
                            rotateX.set(info.offset.y / 2);
                            rotateY.set(info.offset.x / 2);
                        }}
                        onDragEnd={handleDragEnd}
                    >
                        <SmashCard {...users[currentIndex]} />
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            {users.length === 0 && (
                <div className="absolute bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white text-xl py-4 px-6 rounded-3xl shadow-lg select-none text-center">
                    <div className='text-4xl mb-2'> 
                        🤯
                    </div>
                    <div className='text-2xl font-bold'>Aucune carte disponible</div>
                    <div className='text-lg mt-2'>Vous avez fini {NAME_APP}</div>
                </div>
            )}
        </div>
    );
}