import React from 'react';
import { useNavigate } from 'react-router-dom';

// Sample user data - in a real app, this would come from props or context
const sampleUser = {
    id: '123',
    name: "John Doe",
    bio: "Login to your accounts to discover grate learning opportunities, and share your achievements",
    image: "https://wallpapers.com/images/hd/beautiful-girls-1920-x-1200-picture-s0l86g6mcnu33rd6.jpg",
    coverImage: "https://images.unsplash.com/photo-1483884105135-c06ea81a7a80?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y292ZXIlMjBnaXJsfGVufDB8fDB8fHww",
    score: 10900,
    level: 23
};

const ProfileCard = ({ user = sampleUser }) => {
    const navigate = useNavigate()
    return (
        <div className="max-w-xl mx-auto rounded-2xl overflow-hidden shadow-md bg-white font-sans">
            {/* Cover Image */}
            <div className="h-36 w-full relative overflow-hidden" style={{ backgroundColor: '#8BBAB5' }}>
                <img
                    src={user.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3"}
                    alt="Cover"
                    className="absolute w-full h-full object-cover"
                />
            </div>

            {/* White Card Area */}
            <div className="p-0 bg-white relative text-center">
                {/* Profile Image */}
                <div className="relative flex justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 shadow-md"
                        style={{
                            border: '5px solid white',
                            backgroundColor: '#f0f0f0',
                            transform: 'translate(0, -30%)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}>
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"
                                style={{
                                    backgroundColor: '#e0e0e0',
                                    fontSize: '40px',
                                    fontWeight: 'bold',
                                    color: '#666'
                                }}>
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                {/* User Details */}
                <div style={{ transform: 'translateY(-30px)' }}>
                    <h2 className="text-gray-800 font-bold"
                        style={{
                            fontSize: '30px',
                            color: '#222'
                        }}>
                        {user.name}
                    </h2>
                    {/* 
                    <p className="text-gray-500"
                        style={{
                            color: '#999',
                            fontSize: '18px'
                        }}>
                        {user.username}
                    </p> */}

                    <p className="text-red-700 mx-auto"
                        style={{
                            color: '#C41E3A',
                            fontSize: '16px',
                            fontWeight: 'normal',
                            maxWidth: '400px',
                            lineHeight: '1.5'
                        }}>
                        {user.bio}
                    </p>
                </div>

                {/* Divider Line */}
                <div className="bg-gray-200"
                    style={{
                        height: '1px',
                        transform: 'translateY(-10px)',
                        backgroundColor: '#eee'
                    }}></div>

                {/* Stats */}
                <div className="flex"
                    style={{
                        borderBottom: '1px solid #eee'
                    }}>
                    <div className="flex-1"
                        style={{
                            borderRight: '1px solid #eee'
                        }}>
                        <div className="text-gray-800 font-bold"
                            style={{
                                fontSize: '26px',
                                color: '#222'
                            }}>
                            {user.score}
                        </div>
                        <div className="text-gray-400"
                            style={{
                                fontSize: '18px',
                                color: '#aaa'
                            }}>
                            Score
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="text-gray-800 font-bold"
                            style={{
                                fontSize: '26px',
                                color: '#222'
                            }}>
                            {user.level}
                        </div>
                        <div className="text-gray-400"
                            style={{
                                fontSize: '18px',
                                color: '#aaa'
                            }}>
                            Level
                        </div>
                    </div>
                </div>

                {/* Profile Button */}
                <div>
                    <button
                        onClick={() => navigate(`/users/${user.id}`)}
                        className="text-blue-500 font-bold cursor-pointer bg-transparent border-0"
                        style={{
                            color: '#1DA1F2',
                            fontSize: '18px',
                            padding: '10px 15px'
                        }}>
                        My Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;