/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainButton from '../../components/button/MainButton';
import InputField from '../../components/input/InputField';
import { BookOpen, CheckCircle, XCircle, Award, Search } from 'lucide-react';
import * as THREE from 'three';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes, createQuizInteraction, fetchQuizInteractions } from '../../features/quizzes/quizzesSlice';

// Quiz card component with animation
const QuizCard = ({ quiz, index }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userAnswer, setUserAnswer] = useState(null);
    const dispatch = useDispatch();

    const handleAnswerSelect = (answerIndex) => {
        setSelectedAnswer(answerIndex);
    };

    const handleSubmit = async () => {
        if (selectedAnswer !== null) {
            setIsSubmitting(true);
            try {
                // Convert 0-based index to 1-based index for API
                const answerId = selectedAnswer + 1;

                // Submit answer to API
                const result = await dispatch(createQuizInteraction({
                    quizId: quiz.id,
                    answerId: answerId
                })).unwrap();

                // Store user's answer locally
                setUserAnswer(result);

                // Check if answer is correct
                const correct = answerId === quiz.correct_answer;
                setIsCorrect(correct);
                setShowResult(true);

                console.log(`Quiz "${quiz.title}" answered with answer ID: ${answerId}`);
            } catch (error) {
                console.error("Error submitting answer:", error);
                // You can show error toast here
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleReset = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setUserAnswer(null);
    };

    // Staggered animation for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.2
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full mb-8"
        >
            <div className="overflow-hidden rounded-lg shadow-lg bg-white">
                <div className={`h-2 w-full ${showResult ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-red-700'}`}></div>

                {/* Media section */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    {quiz.media_url_one ? (
                        quiz.media_url_one.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                                src={quiz.media_url_one}
                                alt={quiz.title}
                                className="w-full h-full object-cover"
                            />
                        ) : quiz.media_url_one.match(/\.(mp4|webm|mov)$/i) ? (
                            <video
                                src={quiz.media_url_one}
                                controls
                                className="w-full h-full object-cover"
                            />
                        ) : quiz.media_url_one.match(/\.pdf$/i) ? (
                            <iframe
                                src={quiz.media_url_one}
                                title="PDF"
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Unsupported media type
                            </div>
                        )
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                            <BookOpen size={48} className="text-red-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h3 className="text-xl font-bold px-4 text-center">
                            {quiz.title}
                        </h3>
                    </div>
                </div>

                {/* Content section */}
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <BookOpen size={20} className="text-red-700 mr-2" />
                        <p className="text-gray-600">
                            {quiz.description || "No description available"}
                        </p>
                    </div>

                    <h4 className="text-lg text-black font-bold mb-4">
                        {quiz.question}
                    </h4>

                    {/* Answer options */}
                    <div className="space-y-3 mb-6">
                        {[
                            quiz.answer_one,
                            quiz.answer_two,
                            quiz.answer_three,
                            quiz.answer_four,
                            quiz.answer_five
                        ].filter(answer => answer && answer.trim() !== "").map((answer, idx) => (
                            <motion.div
                                key={idx + 1}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div
                                    onClick={() => !showResult && handleAnswerSelect(idx)}
                                    className={`p-3 cursor-pointer text-neutral-800 border-2 rounded-md shadow-sm transition-all ${showResult
                                        ? idx + 1 === quiz.correct_answer
                                            ? 'border-green-500 bg-green-50'
                                            : selectedAnswer === idx
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200'
                                        : selectedAnswer === idx
                                            ? 'border-red-700 bg-red-50'
                                            : 'border-gray-200 hover:border-red-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <p>{answer}</p>
                                        {showResult && idx + 1 === quiz.correct_answer && <CheckCircle size={20} className="text-green-500" />}
                                        {showResult && selectedAnswer === idx && idx + 1 !== quiz.correct_answer && <XCircle size={20} className="text-red-500" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* User Answer Display */}
                    {userAnswer && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-center mb-2">
                                <BookOpen size={16} className="text-blue-600 mr-2" />
                                <p className="text-sm font-medium text-blue-800">Your Answer</p>
                            </div>
                            <p className="text-sm text-blue-700">
                                Submitted on: {new Date(userAnswer.created_at).toLocaleString()}
                            </p>
                            {userAnswer.user && (
                                <p className="text-xs text-blue-600 mt-1">
                                    By: {userAnswer.user.name}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-between">
                        {showResult ? (
                            <div className="w-full">
                                <div className="flex items-center mb-4">
                                    {isCorrect ? (
                                        <div className="flex items-center text-green-600">
                                            <Award size={24} className="mr-2" />
                                            <p>
                                                Correct! Answer submitted successfully
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-red-600">
                                            Incorrect. Try again!
                                        </p>
                                    )}
                                </div>
                                <MainButton
                                    label="Try Another Question"
                                    onClick={handleReset}
                                    fullWidth
                                />
                            </div>
                        ) : (
                            <MainButton
                                label={isSubmitting ? "Submitting..." : "Submit Answer"}
                                onClick={handleSubmit}
                                disabled={selectedAnswer === null || isSubmitting}
                                fullWidth
                            />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// 3D Animation Component
const ThreeJSBackground = () => {
    const containerRef = React.useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Set up scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#f8fafc');

        // Camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 200, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, 200);
        containerRef.current.appendChild(renderer.domElement);

        // Create floating quiz-related objects
        const geometry = new THREE.IcosahedronGeometry(0.5, 0);
        const material = new THREE.MeshStandardMaterial({
            color: '#BA0A0C',
            roughness: 0.5,
            metalness: 0.2
        });

        const spheres = [];
        for (let i = 0; i < 10; i++) {
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.x = (Math.random() - 0.5) * 10;
            sphere.position.y = (Math.random() - 0.5) * 5;
            sphere.position.z = (Math.random() - 0.5) * 5;
            sphere.scale.setScalar(Math.random() * 0.3 + 0.1);
            scene.add(sphere);
            spheres.push({
                mesh: sphere,
                speed: Math.random() * 0.01 + 0.005
            });
        }

        // Light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 2);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);

            spheres.forEach(sphere => {
                sphere.mesh.rotation.x += sphere.speed;
                sphere.mesh.rotation.y += sphere.speed * 0.8;
            });

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / 200;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, 200);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} className="h-48 w-full"></div>;
};

// Main Quiz component
const Quizzes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();

    // Get quizzes from Redux store
    const { allQuizzes, loading, error } = useSelector((state) => state.quizzes);

    // Fetch quizzes on component mount
    useEffect(() => {
        dispatch(fetchQuizzes());
    }, [dispatch]);

    // Filter quizzes based on search term
    const filteredQuizzes = allQuizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* 3D Header Background */}
            <div className="relative overflow-hidden h-48">
                <ThreeJSBackground />
                <div className="absolute inset-0 flex items-center justify-center flex-col px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl font-bold text-red-700 text-center">
                            Interactive Quizzes
                        </h1>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <p className="text-gray-600 text-center max-w-lg mt-2">
                            Test your knowledge with our interactive quizzes and track your progress
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 -mt-6">
                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8"
                >
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <InputField
                        id="search"
                        label="Search Quizzes"
                        placeholder="Enter keywords to find quizzes..."
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                        <p className="mt-2 text-gray-600">Loading quizzes...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-16">
                        <p className="text-red-600 mb-4">Error loading quizzes: {error}</p>
                        <MainButton
                            label="Try Again"
                            onClick={() => dispatch(fetchQuizzes())}
                        />
                    </div>
                )}

                {/* Quiz Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredQuizzes.length > 0 ? (
                            filteredQuizzes.map((quiz, index) => (
                                <QuizCard quiz={quiz} index={index} key={quiz.id} />
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-16">
                                <p className="text-xl text-gray-500">
                                    {searchTerm ? 'No quizzes found matching your search.' : 'No quizzes available.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quizzes;