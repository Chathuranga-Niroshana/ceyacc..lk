import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Card, CardContent, CardActionArea, Typography, Chip, Box, Container, Grid } from '@mui/material';
import { BookOpen, Clock, ArrowRight, Star } from 'lucide-react';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        navigate(`/courses/${course.id}`);
    };

    // Calculate difficulty level based on applicable grade/level
    const getDifficultyLevel = () => {
        const level = course.applicableLevel || course.applicableGrade || 0;
        if (level < 5) return "Beginner";
        if (level < 10) return "Intermediate";
        return "Advanced";
    };

    const difficultyColor = {
        "Beginner": "bg-green-100 text-green-800",
        "Intermediate": "bg-blue-100 text-blue-800",
        "Advanced": "bg-purple-100 text-purple-800"
    };

    return (
        <Card
            className={`overflow-hidden transition-all duration-300 h-full ${isHovered ? 'shadow-xl transform scale-105' : 'shadow-md'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardActionArea onClick={handleClick} className="h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={course.thumbnail[0] || "/api/placeholder/400/240"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-0 right-0 m-2 ${difficultyColor[getDifficultyLevel()]} px-2 py-1 rounded-full text-xs font-medium`}>
                        {getDifficultyLevel()}
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="p-4 text-white">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                <span className="text-sm">Passing Grade: {course.marksForPass}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="flex-1 flex flex-col p-4">
                    <Typography className="text-xl font-bold mb-2 line-clamp-2">{course.title}</Typography>

                    <Typography className="text-gray-600 mb-4 flex-1 line-clamp-3">
                        {course.description}
                    </Typography>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        <Chip
                            icon={<BookOpen className="w-4 h-4" />}
                            label={`Level ${course.applicableLevel || 'All'}`}
                            size="small"
                            className="bg-gray-100"
                        />
                        <Chip
                            icon={<Clock className="w-4 h-4" />}
                            label="5 hrs"
                            size="small"
                            className="bg-gray-100"
                        />
                    </div>

                    <div className={`mt-4 flex items-center text-blue-600 transition-all duration-300 ${isHovered ? 'translate-x-2' : ''}`}>
                        <span className="font-medium">Explore Course</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CourseCard