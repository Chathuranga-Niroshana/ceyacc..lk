import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Typography, Box, Container, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/courses/coursesSlice';
import CourseCard from '../../components/widgets/CourseCard'
import { categories } from '../../data/courseCategories';

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

            for (let i = 0; i < 1000; i++) {
                vertices.push(
                    THREE.MathUtils.randFloatSpread(2000), // x
                    THREE.MathUtils.randFloatSpread(1000), // y
                    THREE.MathUtils.randFloatSpread(2000)  // z
                );
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            const material = new THREE.PointsMaterial({
                color: 0x3B82F6,
                size: 3,
                transparent: true,
                opacity: 0.5
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

                particles.rotation.x += 0.0005;
                particles.rotation.y += 0.0005;

                renderer.render(scene, camera);
            };

            animate();

            // Cleanup function
            return () => {
                window.removeEventListener('resize', handleResize);
                if (mountRef.current) {
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

// Enhanced Course Card Component


// Course tracking utilities
const COURSE_TRACKING_KEY = 'ceyacc_course_interactions';

const getCourseInteractions = () => {
    try {
        const stored = localStorage.getItem(COURSE_TRACKING_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Error reading course interactions from localStorage:', error);
        return {};
    }
};

const saveCourseInteraction = (courseId, interactionType = 'view') => {
    try {
        const interactions = getCourseInteractions();
        const now = new Date().toISOString();

        if (!interactions[courseId]) {
            interactions[courseId] = {
                views: 0,
                lastViewed: null,
                interactions: []
            };
        }

        interactions[courseId].views += 1;
        interactions[courseId].lastViewed = now;
        interactions[courseId].interactions.push({
            type: interactionType,
            timestamp: now
        });

        // Keep only last 10 interactions per course
        if (interactions[courseId].interactions.length > 10) {
            interactions[courseId].interactions = interactions[courseId].interactions.slice(-10);
        }

        localStorage.setItem(COURSE_TRACKING_KEY, JSON.stringify(interactions));
    } catch (error) {
        console.error('Error saving course interaction to localStorage:', error);
    }
};

// Main Courses Component
const Courses = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [courseInteractions, setCourseInteractions] = useState({});
    const dispatch = useDispatch();

    // Get courses from Redux store
    const { allCourses, loading, error } = useSelector((state) => state.courses);

    // Fetch courses on component mount
    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    // Load course interactions from localStorage
    useEffect(() => {
        setCourseInteractions(getCourseInteractions());
    }, []);

    // Handle course click/view
    const handleCourseClick = (courseId) => {
        saveCourseInteraction(courseId, 'view');
        // Update local state to reflect the new interaction
        setCourseInteractions(getCourseInteractions());
    };

    // Filter courses based on selected category
    const filteredCourses = allCourses.filter(course => {
        if (selectedCategory === "All") return true;
        // You can add category filtering logic here based on your course data structure
        return course.applicableGrade === selectedCategory || course.applicableLevel?.toString() === selectedCategory;
    });

    return (
        <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-blue-50 py-12">
            <BackgroundAnimation />

            <Container className="relative z-10">
                <div className="text-center mb-12">
                    <Typography className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Explore Our Courses
                    </Typography>
                    <Typography className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover a wide range of interactive courses designed to help you master new skills and advance your career.
                    </Typography>
                    {Object.keys(courseInteractions).length > 0 && (
                        <Typography className="text-sm text-gray-500 mt-2">
                            You've viewed {Object.keys(courseInteractions).length} courses recently
                        </Typography>
                    )}
                </div>

                <Box className="mb-8 flex justify-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </Box>

                {/* Loading State */}
                {loading && (
                    <Box className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <Typography className="mt-2 text-gray-600">Loading courses...</Typography>
                    </Box>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Box className="text-center py-16">
                        <Typography className="text-red-600 mb-4">Error loading courses: {error}</Typography>
                        <button
                            onClick={() => dispatch(fetchCourses())}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </Box>
                )}

                {/* Courses Grid */}
                {!loading && !error && (
                    <div className="space-y-6">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course, index) => (
                                <div key={course.id || index}>
                                    <CourseCard
                                        course={course}
                                        onClick={() => handleCourseClick(course.id)}
                                        interactionData={courseInteractions[course.id]}
                                    />
                                </div>
                            ))
                        ) : (
                            <Box className="text-center py-16">
                                <Typography className="text-xl text-gray-500">
                                    {selectedCategory === "All"
                                        ? "No courses available."
                                        : `No courses found in ${selectedCategory} category.`
                                    }
                                </Typography>
                            </Box>
                        )}
                    </div>
                )}

                {/* Course Interaction Stats (Optional - for debugging) */}
                {process.env.NODE_ENV === 'development' && Object.keys(courseInteractions).length > 0 && (
                    <Box className="mt-8 p-4 bg-gray-100 rounded-lg">
                        <Typography variant="h6" className="mb-2">Course Interaction Stats (Dev)</Typography>
                        <div className="text-sm text-gray-600">
                            {Object.entries(courseInteractions).map(([courseId, data]) => (
                                <div key={courseId} className="mb-1">
                                    Course {courseId}: {data.views} views, Last: {new Date(data.lastViewed).toLocaleDateString()}
                                </div>
                            ))}
                        </div>
                    </Box>
                )}
            </Container>
        </div>
    );
};

export default Courses;