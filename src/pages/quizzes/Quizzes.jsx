/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainButton from '../../components/button/MainButton';
import InputField from '../../components/input/InputField';
import { BookOpen, CheckCircle, XCircle, Award, Search } from 'lucide-react';
import * as THREE from 'three';
import { quizzes } from '../../../database/sampleQuizzes';

// Quiz card component with animation
const QuizCard = ({ quiz, index }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleAnswerSelect = (answerIndex) => {
        setSelectedAnswer(answerIndex);
    };

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            const correct = selectedAnswer === quiz.correctAnswer;
            setIsCorrect(correct);
            setShowResult(true);

            // Log the interactingScore to console
            console.log(`Quiz "${quiz.title}" interactingScore: ${quiz.interactingScore}`);
        }
    };

    const handleReset = () => {
        setSelectedAnswer(null);
        setShowResult(false);
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
                    <img
                        src={quiz.media[0]}
                        alt={quiz.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h3 className="text-xl font-bold text-white px-4 text-center">
                            {quiz.title}
                        </h3>
                    </div>
                </div>

                {/* Content section */}
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <BookOpen size={20} className="text-red-700 mr-2" />
                        <p className="text-gray-600">
                            {quiz.description}
                        </p>
                    </div>

                    <h4 className="text-lg font-bold mb-4">
                        {quiz.question}
                    </h4>

                    {/* Answer options */}
                    <div className="space-y-3 mb-6">
                        {quiz.answers.map((answer, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div
                                    onClick={() => !showResult && handleAnswerSelect(idx)}
                                    className={`p-3 cursor-pointer border-2 rounded-md shadow-sm transition-all ${showResult
                                        ? idx === quiz.correctAnswer
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
                                        {showResult && idx === quiz.correctAnswer && <CheckCircle size={20} className="text-green-500" />}
                                        {showResult && selectedAnswer === idx && idx !== quiz.correctAnswer && <XCircle size={20} className="text-red-500" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-between">
                        {showResult ? (
                            <div className="w-full">
                                <div className="flex items-center mb-4">
                                    {isCorrect ? (
                                        <div className="flex items-center text-green-600">
                                            <Award size={24} className="mr-2" />
                                            <p>
                                                Correct! +{quiz.interactingScore} points
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
                                label="Submit Answer"
                                onClick={handleSubmit}
                                disabled={selectedAnswer === null}
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
    const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes);

    // Effect for search filtering
    useEffect(() => {
        const results = quizzes.filter(quiz =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuizzes(results);
    }, [searchTerm]);

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

                {/* Quiz Grid */}
                <div className="grid grid-cols-1  gap-6">
                    {filteredQuizzes.length > 0 ? (
                        filteredQuizzes.map((quiz, index) => (
                            <QuizCard quiz={quiz} index={index} key={index} />
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-16">
                            <p className="text-xl text-gray-500">
                                No quizzes found matching your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quizzes;