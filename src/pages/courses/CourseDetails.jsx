/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ChevronLeft, Play, Pause, FileText, Award, CheckCircle, X, Download, Lock, Calendar, Clock, User, Bookmark, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

// Sample course data based on your CreateCourse structure
const sampleCourse = {
    id: "1",
    thumbnail: ["https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto"],
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build your first website. This comprehensive course covers everything from basic HTML tags to advanced JavaScript concepts. By the end of this course, you'll be able to create responsive websites from scratch.",
    media: [
        "https://example.com/lesson1-intro.mp4",
        "https://example.com/lesson2-html-basics.mp4",
        "https://example.com/lesson3-css-styling.mp4",
        "https://example.com/lesson4-javascript-intro.mp4"
    ],
    resources: [
        "https://example.com/html-cheatsheet.pdf",
        "https://example.com/css-guide.pdf",
        "https://example.com/javascript-reference.pdf"
    ],
    questions: [
        {
            question: "Which tag is used to create a hyperlink in HTML?",
            answers: ["<link>", "<a>", "<href>", "<url>"],
            correctAnswer: 1,
            marks: 10
        },
        {
            question: "Which CSS property is used to change the text color?",
            answers: ["text-color", "font-color", "color", "foreground-color"],
            correctAnswer: 2,
            marks: 10
        },
        {
            question: "Which of the following is not a JavaScript data type?",
            answers: ["string", "boolean", "integer", "undefined"],
            correctAnswer: 2,
            marks: 10
        },
        {
            question: "What does CSS stand for?",
            answers: ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
            correctAnswer: 2,
            marks: 10
        },
        {
            question: "Which HTML element is used to specify a header for a document or section?",
            answers: ["<head>", "<header>", "<top>", "<heading>"],
            correctAnswer: 1,
            marks: 10
        }
    ],
    marksForPass: 75,
    applicableGrade: 10,
    applicableLevel: 10,
    instructor: "Sarah Johnson",
    duration: "5 hours",
    createdAt: "2025-01-15",
    students: 3240,
    isPrivate: false
};

// Certificate Component
const Certificate = ({ studentName, courseName, date, onDownload }) => {
    const certificateRef = useRef();

    const handleDownload = () => {
        onDownload(certificateRef.current);
    };

    return (
        <div className="p-8 bg-white border-8 border-double border-blue-200 rounded-lg shadow-lg max-w-3xl mx-auto my-8" ref={certificateRef}>
            <div className="text-center">
                <div className="mb-6">
                    <svg className="mx-auto h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-serif font-bold mb-4 text-blue-800">Certificate of Completion</h1>
                <p className="text-lg text-gray-600 mb-8">This is to certify that</p>
                <h2 className="text-2xl font-bold mb-8 text-gray-800">{studentName || "John Doe"}</h2>
                <p className="text-lg text-gray-600 mb-2">has successfully completed the course</p>
                <h3 className="text-xl font-bold mb-8 text-gray-800">"{courseName}"</h3>
                <p className="text-lg text-gray-600 mb-8">on {date}</p>

                <div className="mt-16 mb-8 border-t border-gray-300 pt-4">
                    <div className="flex justify-around">
                        <div className="text-center">
                            <div className="h-px w-40 bg-black mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Instructor Signature</p>
                        </div>
                        <div className="text-center">
                            <div className="h-px w-40 bg-black mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Date</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 right-4">
                <button
                    onClick={handleDownload}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <Download className="w-5 h-5 mr-1" />
                    <span>Download</span>
                </button>
            </div>
        </div>
    );
};

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
const VideoPlayer = ({ src, onComplete, isActive }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef(null);

    // Handle video completion
    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
            const handleTimeUpdate = () => {
                const current = videoElement.currentTime;
                const duration = videoElement.duration;
                setProgress((current / duration) * 100);

                // Mark as completed when 95% watched
                if ((current / duration) >= 0.95) {
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
    }, [onComplete]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Format time from seconds to MM:SS
    const formatTime = (timeInSeconds) => {
        if (!timeInSeconds) return "00:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const currentTime = videoRef.current ? videoRef.current.currentTime : 0;

    return (
        <div className={`relative rounded-lg overflow-hidden bg-black ${isActive ? 'block' : 'hidden'}`}>
            <video
                ref={videoRef}
                className="w-full aspect-video"
                poster={sampleCourse.thumbnail[0]}
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
                    {questions.map((question, index) => {
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
                    {question.answers.map((answer, index) => (
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
    // Normally you would use the ID to fetch course data
    // const { id } = useParams();
    const course = sampleCourse; // Using hardcoded data

    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [completedMedia, setCompletedMedia] = useState([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [userName, setUserName] = useState("");
    const [showNameInput, setShowNameInput] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    // Calculate progress percentage
    const progressPercentage = Math.round((completedMedia.length / course.media.length) * 100);
    const allMediaCompleted = completedMedia.length === course.media.length;

    // Handle media completion
    const handleMediaComplete = () => {
        if (!completedMedia.includes(currentMediaIndex)) {
            setCompletedMedia([...completedMedia, currentMediaIndex]);
        }
    };

    // Handle quiz completion
    const handleQuizComplete = (score) => {
        setQuizCompleted(true);
        setShowNameInput(true);
    };

    // Generate certificate
    const handleGenerateCertificate = () => {
        if (userName.trim() !== "") {
            setShowCertificate(true);
        }
    };

    // Download certificate (mock function)
    const handleDownloadCertificate = (certificateElement) => {
        // In a real app, you would use html2canvas or similar to convert to image/PDF
        console.log("Downloading certificate for:", userName);
        alert("Certificate download started!");
        // Implementation would depend on your preferred method (html2canvas, jsPDF, etc.)
    };

    // Format today's date for the certificate
    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
            <BackgroundAnimation />

            <div className="container mx-auto px-4 relative z-10">
                {/* Back Navigation */}
                <div className="py-4">
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        <span>Back to Courses</span>
                    </button>
                </div>

                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-1" />
                            <span>Instructor: {course.instructor}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Created: {course.createdAt}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Bookmark className="w-4 h-4 mr-1" />
                            <span>Level: {course.applicableLevel}</span>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">{course.description}</p>

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
                                {course.media.map((mediaUrl, index) => (
                                    <VideoPlayer
                                        key={index}
                                        src={mediaUrl}
                                        onComplete={() => handleMediaComplete()}
                                        isActive={currentMediaIndex === index}
                                    />
                                ))}

                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-2">
                                        Lesson {currentMediaIndex + 1}: {
                                            ["Introduction", "HTML Basics", "CSS Styling", "JavaScript Fundamentals"][currentMediaIndex]
                                        }
                                    </h2>

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
                                                if (currentMediaIndex < course.media.length - 1) {
                                                    setCurrentMediaIndex(currentMediaIndex + 1);
                                                } else if (allMediaCompleted) {
                                                    setShowQuiz(true);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${(currentMediaIndex < course.media.length - 1) ||
                                                (currentMediaIndex === course.media.length - 1 && allMediaCompleted)
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-blue-200 text-blue-400 cursor-not-allowed'
                                                }`}
                                            disabled={
                                                (currentMediaIndex === course.media.length - 1 && !allMediaCompleted) ||
                                                (currentMediaIndex < course.media.length - 1 && !completedMedia.includes(currentMediaIndex))
                                            }
                                        >
                                            {currentMediaIndex < course.media.length - 1 ? 'Next Lesson' : 'Take Quiz'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : showCertificate ? (
                            <Certificate
                                studentName={userName}
                                courseName={course.title}
                                date={formattedDate}
                                onDownload={handleDownloadCertificate}
                            />
                        ) : (
                            <Quiz
                                questions={course.questions}
                                passingPercentage={course.marksForPass}
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
                                {course.media.map((_, index) => {
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
                                                    Lesson {index + 1}: {["Introduction", "HTML Basics", "CSS Styling", "JavaScript Fundamentals"][index]}
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
                                {course.resources.map((resource, index) => {
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
                                                    {["HTML Cheatsheet", "CSS Guide", "JavaScript Reference"][index]}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {fileType} Document
                                                </p>
                                            </div>
                                            <Download className="w-4 h-4 text-gray-400" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Course Statistics */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold mb-4">Course Statistics</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-blue-50 rounded-md text-center">
                                    <p className="text-sm text-blue-600 mb-1">Students</p>
                                    <p className="text-xl font-bold text-blue-800">{course.students.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-md text-center">
                                    <p className="text-sm text-green-600 mb-1">Completion Rate</p>
                                    <p className="text-xl font-bold text-green-800">78%</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-md text-center">
                                    <p className="text-sm text-yellow-600 mb-1">Avg. Rating</p>
                                    <p className="text-xl font-bold text-yellow-800">4.8/5</p>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-md text-center">
                                    <p className="text-sm text-indigo-600 mb-1">Reviews</p>
                                    <p className="text-xl font-bold text-indigo-800">342</p>
                                </div>
                            </div>
                        </div>

                        {/* Instructor Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold mb-4">About the Instructor</h2>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium">{course.instructor}</h3>
                                    <p className="text-sm text-gray-500">Web Development Specialist</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Sarah is a seasoned web developer with over 10 years of experience in building responsive,
                                user-friendly websites. She specializes in modern web technologies and has helped
                                thousands of students master the fundamentals of web development.
                            </p>
                            <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm transition-colors">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Michael T.",
                                rating: 5,
                                comment: "This course was exactly what I needed to start my web development journey. The instructor explains concepts clearly and the hands-on approach really helps solidify the learning.",
                                date: "April 2, 2025"
                            },
                            {
                                name: "Sophia L.",
                                rating: 4,
                                comment: "Great introduction to web development. I especially loved the JavaScript section. Could use more exercises, but overall very satisfied with what I learned.",
                                date: "March 15, 2025"
                            },
                            {
                                name: "David W.",
                                rating: 5,
                                comment: "Fantastic course! I went from knowing nothing about coding to building my own website. The certificate was a nice touch too - already added it to my LinkedIn profile!",
                                date: "February 28, 2025"
                            }
                        ].map((review, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{review.name}</h3>
                                            <p className="text-sm text-gray-500">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors">
                            View All Reviews
                        </button>
                    </div>
                </div>

                {/* Related Courses */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Advanced JavaScript",
                                instructor: "Sarah Johnson",
                                students: 2140,
                                rating: 4.7,
                                image: "https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto"
                            },
                            {
                                title: "Responsive Web Design",
                                instructor: "Michael Chen",
                                students: 1850,
                                rating: 4.9,
                                image: "https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto"
                            },
                            {
                                title: "Full Stack Development",
                                instructor: "Jessica Williams",
                                students: 3120,
                                rating: 4.8,
                                image: "https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto"
                            }
                        ].map((relatedCourse, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${relatedCourse.image})` }}>
                                    <div className="w-full h-full flex items-end bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <h3 className="text-white font-bold text-lg">{relatedCourse.title}</h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">
                                            <User className="w-3 h-3 inline mr-1" />
                                            {relatedCourse.instructor}
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {relatedCourse.rating}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-4">
                                        <Bookmark className="w-3 h-3 inline mr-1" />
                                        {relatedCourse.students.toLocaleString()} students enrolled
                                    </div>
                                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm">
                                        View Course
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 bg-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Take Your Skills to the Next Level?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join our community of over 10,000 learners and explore our complete web development curriculum.
                        From beginner to advanced, we have courses for every skill level.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors">
                            Browse All Courses
                        </button>
                        <button className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-md font-medium transition-colors">
                            Join Membership
                        </button>
                    </div>
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