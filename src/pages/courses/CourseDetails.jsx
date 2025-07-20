/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { ChevronLeft, Play, Pause, FileText, Award, CheckCircle, X, Download, Lock, Calendar, Clock, User, Bookmark, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../../features/courses/coursesSlice';
import logo from '../../assets/images/logo.png';
import html2canvas from 'html2canvas';

// Progress tracking utilities
const COURSE_PROGRESS_KEY = 'ceyacc_course_progress';

const getCourseProgress = (courseId) => {
    try {
        const stored = localStorage.getItem(COURSE_PROGRESS_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        return allProgress[courseId] || {
            currentMediaIndex: 0,
            completedMedia: [],
            quizCompleted: false,
            quizScore: 0,
            lastAccessed: null,
            totalTimeSpent: 0
        };
    } catch (error) {
        console.error('Error reading course progress from localStorage:', error);
        return {
            currentMediaIndex: 0,
            completedMedia: [],
            quizCompleted: false,
            quizScore: 0,
            lastAccessed: null,
            totalTimeSpent: 0
        };
    }
};

const saveCourseProgress = (courseId, progress) => {
    try {
        const stored = localStorage.getItem(COURSE_PROGRESS_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        allProgress[courseId] = {
            ...progress,
            lastAccessed: new Date().toISOString()
        };
        localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(allProgress));
    } catch (error) {
        console.error('Error saving course progress to localStorage:', error);
    }
};

// Certificate Component
const Certificate = React.forwardRef(({ studentName, courseName }, ref) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return (
        <div
            ref={ref}
            style={{
                background: '#fff',
                border: '8px double #bfdbfe',
                borderRadius: '1rem',
                boxShadow: '0 10px 15px -3px rgba(59,130,246,0.1), 0 4px 6px -4px rgba(59,130,246,0.1)',
                maxWidth: '48rem',
                margin: '2rem auto',
                position: 'relative',
                padding: '2rem'
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={logo} alt="CeyAcc Logo" style={{ height: 64, width: 64, marginBottom: 8 }} />
                    <span style={{ color: '#1d4ed8', fontWeight: 700, fontSize: 20 }}>Certified by CeyAcc</span>
                </div>
                <h1 style={{ fontSize: 32, fontFamily: 'serif', fontWeight: 700, marginBottom: 16, color: '#1e40af' }}>Certificate of Completion</h1>
                <p style={{ fontSize: 18, color: '#4b5563', marginBottom: 32 }}>This is to certify that</p>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, color: '#1f2937' }}>{studentName || "John Doe"}</h2>
                <p style={{ fontSize: 18, color: '#4b5563', marginBottom: 8 }}>has successfully completed the course</p>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32, color: '#1f2937' }}>&quot;{courseName}&quot;</h3>
                <p style={{ fontSize: 18, color: '#4b5563', marginBottom: 32 }}>on {formattedDate}</p>
            </div>
        </div>
    );
});

// Background Animation with Three.js
const BackgroundAnimation = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        let scene, camera, renderer;
        let particles;

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);

            if (mountRef.current) {
                mountRef.current.appendChild(renderer.domElement);
            }

            // Create particles
            const geometry = new THREE.BufferGeometry();
            const vertices = [];

            for (let i = 0; i < 500; i++) {
                vertices.push(
                    THREE.MathUtils.randFloatSpread(2000), // x
                    THREE.MathUtils.randFloatSpread(1000), // y
                    THREE.MathUtils.randFloatSpread(2000)  // z
                );
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            const material = new THREE.PointsMaterial({
                color: 0x3B82F6,
                size: 2,
                transparent: true,
                opacity: 0.3
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            camera.position.z = 500;

            // Handle window resize
            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            window.addEventListener('resize', handleResize);

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);

                particles.rotation.x += 0.0002;
                particles.rotation.y += 0.0002;

                renderer.render(scene, camera);
            };

            animate();

            // Cleanup function
            return () => {
                window.removeEventListener('resize', handleResize);
                if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
                    mountRef.current.removeChild(renderer.domElement);
                }
                scene.remove(particles);
                geometry.dispose();
                material.dispose();
            };
        };

        const cleanup = init();

        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 z-0" />;
};

// Video Player Component
const getYouTubeEmbedUrl = (url) => {
    // Handles both youtu.be and youtube.com links
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
};

const VideoPlayer = ({ src, onComplete, isActive, poster, isCompleted }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef(null);

    // Check if the src is a YouTube URL
    const youtubeEmbedUrl = getYouTubeEmbedUrl(src);

    useEffect(() => {
        if (youtubeEmbedUrl) return; // Don't run for YouTube
        const videoElement = videoRef.current;
        if (videoElement) {
            const handleTimeUpdate = () => {
                const current = videoElement.currentTime;
                const duration = videoElement.duration;
                setProgress((current / duration) * 100);
                if ((current / duration) >= 0.95 && !isCompleted) {
                    onComplete();
                }
            };
            const handleDurationChange = () => {
                setDuration(videoElement.duration);
            };
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
            videoElement.addEventListener('durationchange', handleDurationChange);
            return () => {
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
                videoElement.removeEventListener('durationchange', handleDurationChange);
            };
        }
    }, [onComplete, youtubeEmbedUrl, isCompleted]);

    const togglePlay = () => {
        if (youtubeEmbedUrl) return; // No play/pause for iframe
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (timeInSeconds) => {
        if (!timeInSeconds) return "00:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const currentTime = videoRef.current ? videoRef.current.currentTime : 0;

    if (youtubeEmbedUrl) {
        return (
            <div className={`relative rounded-lg overflow-hidden bg-black ${isActive ? 'block' : 'hidden'}`}>
                <iframe
                    width="100%"
                    height="400"
                    src={youtubeEmbedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                ></iframe>
                {isActive && !isCompleted && (
                    <div className="p-4 text-center">
                        <button
                            onClick={onComplete}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Mark as Watched
                        </button>
                    </div>
                )}
                {isCompleted && (
                    <div className="p-4 text-center text-green-600 font-semibold">Lesson completed</div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative rounded-lg overflow-hidden bg-black ${isActive ? 'block' : 'hidden'}`}>
            <video
                ref={videoRef}
                className="w-full aspect-video"
                poster={poster || undefined}
                onClick={togglePlay}
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex flex-col">
                    {/* Progress bar */}
                    <div className="w-full bg-gray-400 h-1 rounded-full mb-2 cursor-pointer"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos = (e.clientX - rect.left) / rect.width;
                            if (videoRef.current) {
                                videoRef.current.currentTime = pos * duration;
                            }
                        }}
                    >
                        <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    {/* Controls */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={togglePlay}
                            className="text-white hover:text-blue-400 focus:outline-none"
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>
                        <div className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>
                </div>
            </div>
            {isCompleted && (
                <div className="p-2 text-center text-green-600 font-semibold bg-white/80 absolute top-2 right-2 rounded">Lesson completed</div>
            )}
        </div>
    );
};

// Quiz Component
const Quiz = ({ questions, passingPercentage, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(-1));
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [passed, setPassed] = useState(false);

    // Calculate total possible marks
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 10), 0);

    // Calculate passing mark threshold
    const passingMark = Math.round((passingPercentage / 100) * totalMarks);

    const handleAnswer = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const goToNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateScore();
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        let totalScore = 0;

        questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                totalScore += question.marks;
            }
        });

        setScore(totalScore);

        const hasPassedQuiz = totalScore >= passingMark;
        setPassed(hasPassedQuiz);

        if (hasPassedQuiz) {
            // Trigger success confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Notify parent component
            onComplete(totalScore);
        }
    };

    if (showResults) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Quiz Results</h2>

                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                        {passed ? (
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        ) : (
                            <X className="w-12 h-12 text-red-500" />
                        )}
                    </div>

                    <h3 className="text-xl font-bold mt-4">
                        {passed ? 'Congratulations! You Passed!' : 'Keep Learning and Try Again'}
                    </h3>

                    <p className="text-gray-600 mt-2">
                        Your score: {score} out of {totalMarks} ({Math.round((score / totalMarks) * 100)}%)
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Passing score: {passingMark} ({passingPercentage}%)
                    </p>
                </div>

                <div className="space-y-4">
                    {questions?.map((question, index) => {
                        const isCorrect = answers[index] === question.correctAnswer;

                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-md ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                    }`}
                            >
                                <div className="flex items-start">
                                    <div className={`flex-shrink-0 mt-1 ${isCorrect ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {isCorrect ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <X className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium">{question.question}</p>
                                        <p className="text-sm mt-1">
                                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                                {question.answers[answers[index]]}
                                            </span>
                                        </p>
                                        {!isCorrect && (
                                            <p className="text-sm text-green-600 mt-1">
                                                Correct answer: {question.answers[question.correctAnswer]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!passed && (
                    <button
                        onClick={() => {
                            setCurrentQuestion(0);
                            setAnswers(Array(questions.length).fill(-1));
                            setShowResults(false);
                        }}
                        className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Quiz Assessment</h2>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Question {currentQuestion + 1} of {questions.length}
                </span>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">{question.question}</h3>

                <div className="space-y-3">
                    {question.answers?.map((answer, index) => (
                        <button
                            key={index}
                            className={`w-full text-left p-3 rounded-md border transition-colors ${answers[currentQuestion] === index
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            onClick={() => handleAnswer(index)}
                        >
                            <div className="flex items-center">
                                <div className={`w-5 h-5 flex-shrink-0 mr-2 rounded-full border ${answers[currentQuestion] === index
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-400'
                                    }`}>
                                    {answers[currentQuestion] === index && (
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" />
                                        </svg>
                                    )}
                                </div>
                                <span>{answer}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${currentQuestion > 0
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </button>

                <button
                    onClick={goToNextQuestion}
                    disabled={answers[currentQuestion] === -1}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${answers[currentQuestion] !== -1
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-200 text-blue-400 cursor-not-allowed'
                        }`}
                >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
                </button>
            </div>

            <div className="mt-8 pt-4 border-t">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

// Main Course Details Component
const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get course from Redux store
    const { currentCourse, loading, error } = useSelector((state) => state.courses);
    const { currentUser, userProfile } = useSelector((state) => state.auth);

    // Progress state
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [completedMedia, setCompletedMedia] = useState([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [userName, setUserName] = useState(userProfile?.name || currentUser?.name || "");
    const [showNameInput, setShowNameInput] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    // Memoized values for performance
    const courseId = useMemo(() => Number(id), [id]);
    const hasMedia = useMemo(() => currentCourse?.media && currentCourse.media.length > 0, [currentCourse]);
    const hasQuestions = useMemo(() => currentCourse?.questions && currentCourse.questions.length > 0, [currentCourse]);
    const progressPercentage = useMemo(() => {
        if (!currentCourse) return 0;
        const totalLessons = hasMedia ? currentCourse.media.length : (hasQuestions ? 1 : 0);
        return totalLessons > 0 ? Math.round((completedMedia.length / totalLessons) * 100) : 0;
    }, [currentCourse, completedMedia, hasMedia, hasQuestions]);
    const allMediaCompleted = useMemo(() => {
        return hasMedia ? completedMedia.length === currentCourse.media.length : false;
    }, [hasMedia, completedMedia, currentCourse]);

    // Certificate ref for download
    const certificateRef = useRef();

    // Fetch course data on component mount
    useEffect(() => {
        if (id) {
            console.log('Fetching course with ID:', id);
            dispatch(fetchCourseById(Number(id)));
        }
    }, [dispatch, id]);

    // Debug: Log course data when it changes
    useEffect(() => {
        if (currentCourse) {
            console.log('Course data loaded:', currentCourse);
        }
    }, [currentCourse]);

    // Load progress from localStorage when course is loaded
    useEffect(() => {
        if (currentCourse && id) {
            const savedProgress = getCourseProgress(id);
            setCurrentMediaIndex(savedProgress.currentMediaIndex || 0);
            setCompletedMedia(savedProgress.completedMedia || []);
            setQuizCompleted(savedProgress.quizCompleted || false);
            setQuizScore(savedProgress.quizScore || 0);
            setSessionStartTime(new Date());
        }
    }, [currentCourse, id]);

    // Save progress whenever it changes
    useEffect(() => {
        if (currentCourse && id) {
            const progress = {
                currentMediaIndex,
                completedMedia,
                quizCompleted,
                quizScore,
                totalTimeSpent: getCourseProgress(id).totalTimeSpent || 0
            };
            saveCourseProgress(id, progress);
        }
    }, [currentCourse, id, currentMediaIndex, completedMedia, quizCompleted, quizScore]);

    // Progress calculations are now memoized above

    // Enhanced: Mark media as completed only if not already completed
    const handleMediaComplete = (mediaIndex = currentMediaIndex) => {
        if (!completedMedia.includes(mediaIndex)) {
            const newCompletedMedia = [...completedMedia, mediaIndex];
            setCompletedMedia(newCompletedMedia);
        }
    };

    // Handle quiz completion
    const handleQuizComplete = (score) => {
        setQuizCompleted(true);
        setQuizScore(score);
        setShowNameInput(true);
    };

    // Generate certificate
    const handleGenerateCertificate = () => {
        if (userName.trim() !== "") {
            setShowCertificate(true);
        }
    };

    // Download certificate as image
    const handleDownloadCertificate = async () => {
        if (!certificateRef.current) return;
        certificateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(res => setTimeout(res, 300));
        const canvas = await html2canvas(certificateRef.current, { useCORS: true, backgroundColor: null });
        const link = document.createElement('a');
        link.download = `certificate-${userName || 'user'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // Format today's date for the certificate
    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !currentCourse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">
                        {error ? `Error loading course: ${error}` : 'Course not found'}
                    </p>
                    <p className="text-gray-600 mb-4">Course ID: {id}</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
            <BackgroundAnimation />

            <div className="container mx-auto px-4 relative z-10">
                {/* Back Navigation */}
                <div className="py-4">
                    <button
                        onClick={() => navigate('/courses')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        <span>Back to Courses</span>
                    </button>
                </div>

                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{currentCourse.title}</h1>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-1" />
                            <span>Instructor: {currentCourse.instructor || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{currentCourse.duration || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Created: {new Date(currentCourse.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Bookmark className="w-4 h-4 mr-1" />
                            <span>Level: {currentCourse.applicableLevel}</span>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">{currentCourse.description}</p>

                    <div className="flex items-center mt-2">
                        <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="ml-4 text-sm font-medium text-gray-600">
                            {progressPercentage}% complete
                        </span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Video/Quiz Content */}
                    <div className="lg:col-span-2">
                        {!showQuiz && !showCertificate ? (
                            /* Video Player */
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                {currentCourse.media && currentCourse.media.length > 0 ? (
                                    currentCourse.media?.map((mediaUrl, index) => (
                                        <VideoPlayer
                                            key={index}
                                            src={mediaUrl}
                                            onComplete={() => handleMediaComplete(index)}
                                            isActive={currentMediaIndex === index}
                                            poster={currentCourse.thumbnail && currentCourse.thumbnail[0]}
                                            isCompleted={completedMedia.includes(index)}
                                        />
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Play className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Media Available</h3>
                                        <p className="text-gray-500">This course doesn't have any video lessons yet.</p>
                                    </div>
                                )}

                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-2">
                                        {currentCourse.media && currentCourse.media.length > 0
                                            ? `Lesson ${currentMediaIndex + 1}`
                                            : 'Course Overview'
                                        }
                                    </h2>

                                    {currentCourse.media && currentCourse.media.length > 0 ? (
                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                onClick={() => currentMediaIndex > 0 && setCurrentMediaIndex(currentMediaIndex - 1)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium ${currentMediaIndex > 0
                                                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                disabled={currentMediaIndex === 0}
                                            >
                                                Previous Lesson
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (currentCourse.media && currentMediaIndex < currentCourse.media.length - 1) {
                                                        setCurrentMediaIndex(currentMediaIndex + 1);
                                                    } else if (allMediaCompleted) {
                                                        setShowQuiz(true);
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-md text-sm font-medium ${(currentCourse.media && currentMediaIndex < currentCourse.media.length - 1) ||
                                                    (currentCourse.media && currentMediaIndex === currentCourse.media.length - 1 && allMediaCompleted)
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : 'bg-blue-200 text-blue-400 cursor-not-allowed'
                                                    }`}
                                                disabled={
                                                    (currentCourse.media && currentMediaIndex === currentCourse.media.length - 1 && !allMediaCompleted) ||
                                                    (currentCourse.media && currentMediaIndex < currentCourse.media.length - 1 && !completedMedia.includes(currentMediaIndex))
                                                }
                                            >
                                                {currentCourse.media && currentMediaIndex < currentCourse.media.length - 1 ? 'Next Lesson' : 'Take Quiz'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h3 className="text-lg font-medium text-blue-800 mb-2">Course Information</h3>
                                                <div className="space-y-2 text-sm text-blue-700">
                                                    <p><strong>Title:</strong> {currentCourse.title}</p>
                                                    <p><strong>Description:</strong> {currentCourse.description}</p>
                                                    <p><strong>Level:</strong> {currentCourse.applicableLevel}</p>
                                                    <p><strong>Grade:</strong> {currentCourse.applicableGrade}</p>
                                                    <p><strong>Passing Marks:</strong> {currentCourse.marksForPass}%</p>
                                                    {currentCourse.questions && (
                                                        <p><strong>Questions:</strong> {currentCourse.questions.length}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {currentCourse.questions && currentCourse.questions.length > 0 && (
                                                <button
                                                    onClick={() => setShowQuiz(true)}
                                                    className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                                                >
                                                    Start Quiz
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : showCertificate ? (
                            <>
                                <Certificate
                                    ref={certificateRef}
                                    studentName={userName}
                                    courseName={currentCourse.title}
                                />
                                <div className="flex justify-center mt-4">
                                    <button
                                        type="button"
                                        onClick={handleDownloadCertificate}
                                        className="flex items-center text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded shadow border border-blue-200"
                                    >
                                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                        </svg>
                                        <span>Download Certificate</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Quiz
                                questions={currentCourse.questions || []}
                                passingPercentage={currentCourse.marksForPass || 75}
                                onComplete={handleQuizComplete}
                            />
                        )}

                        {/* Certificate Name Input */}
                        {showNameInput && !showCertificate && (
                            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                <h2 className="text-xl font-bold mb-4">Generate Your Certificate</h2>
                                <p className="text-gray-600 mb-4">
                                    Congratulations on passing the quiz! Enter your name as you'd like it to appear on your certificate.
                                </p>

                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleGenerateCertificate}
                                        disabled={!userName.trim()}
                                        className={`px-4 py-2 rounded-md ${userName.trim()
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-200 text-blue-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Generate Certificate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Course Information */}
                    <div className="space-y-6">
                        {/* Progress Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold mb-4">Your Progress</h2>
                            <div className="flex items-center mb-4">
                                <div className="flex-1">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="ml-4 text-sm font-medium text-gray-600">
                                    {progressPercentage}% complete
                                </span>
                            </div>

                            <div className="space-y-3">
                                {currentCourse.media && currentCourse.media?.map((_, index) => {
                                    const isCompleted = completedMedia.includes(index);
                                    const isCurrent = currentMediaIndex === index;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentMediaIndex(index)}
                                            className={`w-full flex items-center p-3 rounded-md border transition-colors ${isCurrent
                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                : isCompleted
                                                    ? 'bg-green-50 border-green-200 text-green-700'
                                                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <div className="mr-3">
                                                {isCompleted ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : isCurrent ? (
                                                    <Play className="w-5 h-5 text-blue-500" />
                                                ) : (
                                                    <Lock className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <span className="font-medium">
                                                    Lesson {index + 1}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}

                                <button
                                    className={`w-full flex items-center p-3 rounded-md border transition-colors ${showQuiz
                                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                                        : quizCompleted
                                            ? 'bg-green-50 border-green-200 text-green-700'
                                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    onClick={() => allMediaCompleted && setShowQuiz(true)}
                                    disabled={!allMediaCompleted}
                                >
                                    <div className="mr-3">
                                        {quizCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : showQuiz ? (
                                            <CheckSquare className="w-5 h-5 text-blue-500" />
                                        ) : (
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <span className="font-medium">Final Quiz</span>
                                    </div>
                                </button>

                                <button
                                    className={`w-full flex items-center p-3 rounded-md border transition-colors ${showCertificate
                                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                                        : quizCompleted
                                            ? 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    onClick={() => quizCompleted && !showCertificate && setShowNameInput(true)}
                                    disabled={!quizCompleted}
                                >
                                    <div className="mr-3">
                                        {showCertificate ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Award className="w-5 h-5 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <span className="font-medium">Certificate</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Resources Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold mb-4">Course Resources</h2>
                            <div className="space-y-3">
                                {currentCourse.resources && currentCourse.resources.length > 0 ? (
                                    currentCourse.resources?.map((resource, index) => {
                                        const fileName = resource.split('/').pop();
                                        const fileType = fileName.split('.').pop().toUpperCase();

                                        return (
                                            <a
                                                key={index}
                                                href={resource}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="w-10 h-10 flex-shrink-0 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        Resource {index + 1}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {fileType} Document
                                                    </p>
                                                </div>
                                                <Download className="w-4 h-4 text-gray-400" />
                                            </a>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No resources available for this course.</p>
                                )}
                            </div>
                        </div>

                        {/* Course Statistics */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold mb-4">Course Statistics</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-blue-50 rounded-md text-center">
                                    <p className="text-sm text-blue-600 mb-1">Your Progress</p>
                                    <p className="text-xl font-bold text-blue-800">{progressPercentage}%</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-md text-center">
                                    <p className="text-sm text-green-600 mb-1">Lessons Completed</p>
                                    <p className="text-xl font-bold text-green-800">{completedMedia.length}/{currentCourse.media?.length || 0}</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-md text-center">
                                    <p className="text-sm text-yellow-600 mb-1">Quiz Score</p>
                                    <p className="text-xl font-bold text-yellow-800">{quizCompleted ? `${quizScore}%` : 'Not taken'}</p>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-md text-center">
                                    <p className="text-sm text-indigo-600 mb-1">Last Accessed</p>
                                    <p className="text-xs font-bold text-indigo-800">
                                        {getCourseProgress(id).lastAccessed
                                            ? new Date(getCourseProgress(id).lastAccessed).toLocaleDateString()
                                            : 'First time'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Resume Notice */}
                        {getCourseProgress(id).lastAccessed && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">Welcome Back!</h3>
                                <p className="text-sm text-blue-700">
                                    You last accessed this course on {new Date(getCourseProgress(id).lastAccessed).toLocaleDateString()}.
                                    Your progress has been automatically restored.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 bg-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Take Your Skills to the Next Level?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join our community of over 10,000 learners and explore our complete web development curriculum.
                        From beginner to advanced, we have courses for every skill level.
                    </p>
                    {/* <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors">
                            Browse All Courses
                        </button>
                        <button className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-md font-medium transition-colors">
                            Join Membership
                        </button>
                    </div> */}
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">E-Learning Platform</h3>
                            <p className="text-gray-600 text-sm">
                                Empowering learners worldwide with high-quality education and practical skills.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Learn</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-blue-600">Browse Courses</a></li>
                                <li><a href="#" className="hover:text-blue-600">Certificates</a></li>
                                <li><a href="#" className="hover:text-blue-600">Career Paths</a></li>
                                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Stay Connected</h3>
                            <div className="flex space-x-4 mb-4">
                                <a href="#" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                                    {/* Facebook icon */}
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                                    {/* Twitter icon */}
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                                    {/* LinkedIn icon */}
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                                    {/* Instagram icon */}
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
                                </a>
                            </div>
                            <p className="text-gray-600 text-sm">Subscribe to our newsletter for updates</p>
                            <div className="mt-2 flex">
                                <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors text-sm">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <p>© 2025 E-Learning Platform. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CourseDetails;