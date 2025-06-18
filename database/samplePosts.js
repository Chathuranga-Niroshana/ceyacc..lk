export const samplePosts = [
    {
        id: 1,
        name: "Just finished this amazing project! I've been working on this design for weeks and finally happy with the results. Let me know what you think about the color scheme and layout. I'm planning to release this as a template soon.",
        post_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        like: 243,
        comment: 42,
        rating: 4.5,
        user: {
            id: 101,
            first_name: "Alex",
            last_name: "Morgan",
            image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg",
            isVerified: true
        },
        media: {
            type: "image",
            url: "https://as2.ftcdn.net/v2/jpg/03/39/04/49/1000_F_339044953_11prPjDx5qaevM7B7VQ22u4KvfgP4SFv.jpg"
        },
        comments: [
            {
                user: {
                    first_name: "Sarah",
                    last_name: "Johnson",
                    image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg"
                },
                text: "This looks amazing! I love the color combinations you used.",
                date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                replies: [
                    {
                        user: {
                            first_name: "Alex",
                            last_name: "Morgan",
                            image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg"
                        },
                        text: "Thanks Sarah! I spent a lot of time on the color theory for this one.",
                        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    }
                ]
            },
            {
                user: {
                    first_name: "Michael",
                    last_name: "Chen",
                    image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg"
                },
                text: "Very clean design! Would love to see how it looks on mobile as well.",
                date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                replies: []
            }
        ]
    },
    {
        id: 2,
        name: "Check out my latest tutorial on modern web development techniques. This covers everything from responsive design to performance optimization. I've included code examples and best practices that I've learned over the years.",
        post_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        like: 127,
        comment: 23,
        rating: 5,
        user: {
            id: 102,
            first_name: "Emma",
            last_name: "Wilson",
            image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg",
            isVerified: false
        },
        media: {
            type: "video",
            url: "https://www.w3schools.com/html/mov_bbb.mp4" // Big Buck Bunny sample video
        },
        comments: [
            {
                user: {
                    first_name: "David",
                    last_name: "Williams",
                    image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg"
                },
                text: "This tutorial helped me a lot with my current project. Thanks for sharing!",
                date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                replies: []
            }
        ]
    },
    {
        id: 3,
        name: "Just finished this amazing project! I've been working on this design for weeks and finally happy with the results. Let me know what you think about the color scheme and layout. I'm planning to release this as a template soon.",
        post_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        like: 243,
        comment: 42,
        rating: 4.5,
        user: {
            id: 101,
            first_name: "Alex",
            last_name: "Morgan",
            image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg",
            isVerified: true
        },
        media: {
            type: "pdf",
            url: "https://as2.ftcdn.net/v2/jpg/03/39/04/49/1000_F_339044953_11prPjDx5qaevM7B7VQ22u4KvfgP4SFv.jpg"
        },
        comments: [
            {
                user: {
                    first_name: "Sarah",
                    last_name: "Johnson",
                    image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg"
                },
                text: "This looks amazing! I love the color combinations you used.",
                date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                replies: [
                    {
                        user: {
                            first_name: "Alex",
                            last_name: "Morgan",
                            image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg"
                        },
                        text: "Thanks Sarah! I spent a lot of time on the color theory for this one.",
                        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    }
                ]
            },
            {
                user: {
                    first_name: "Michael",
                    last_name: "Chen",
                    image: "https://cdn.pixabay.com/photo/2022/04/06/11/30/girl-7115394_640.jpg"
                },
                text: "Very clean design! Would love to see how it looks on mobile as well.",
                date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                replies: []
            }
        ]
    },
]