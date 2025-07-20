import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';

const SafeImage = ({ src, alt, className, width = '100%', height = 128, style, ...props }) => {
    const [error, setError] = useState(false);
    if (error) {
        return (
            <Skeleton
                variant="rectangular"
                width={width}
                height={height}
                className={className}
                animation="wave"
                sx={{ borderRadius: 2, ...style }}
            />
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            style={style}
            onError={() => setError(true)}
            {...props}
        />
    );
};

export default SafeImage; 