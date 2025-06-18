import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Typography, Box, Container, Grid } from '@mui/material';
import { courses } from '../../../database/sampleCourses';
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


// Main Courses Component
const Courses = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

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

                <Grid container spacing={4}>
                    {courses.map((course, index) => (
                        <Grid item xs={12} sm={6} md={6} key={index}>
                            <CourseCard course={course} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default Courses;