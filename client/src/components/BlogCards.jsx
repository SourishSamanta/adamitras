import React, { useState } from 'react';

const BlogCards = ({ blog }) => {
    const [imageError, setImageError] = useState(false);

    // Convert Google Drive URL to a direct image link
    const getDirectImageURL = (url) => {
        const match = url.match(/(?:file\/d\/|id=)([^\/?]+)/);
        return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
    };

    const imageURL = getDirectImageURL(blog.imageURL);
    console.log("Image URL:", imageURL);

    return (
        <div className='flex flex-col md:w-[20vw] md:h-[25vw] w-[40vw] h-[55vw] p-1 bg-[#FFF4CE] border border-[#EFC740] rounded-lg shadow-md mx-2 my-3'>
            <div className='bg-white w-full h-1/2 rounded-md overflow-hidden'>
                <img 
                    src={`https://drive.usercontent.google.com/download?id=1w8Nfy8wGo-LE3QZMLIhZevkbRNn7qFh0&export=view&authuser=0`} 
                    alt={blog.title} 
                    className='w-full h-full object-cover object-center' 
                    onError={() => setImageError(true)} // Only sets error once
                />
            </div>
            <div className='lg:p-4 lg:pt-5 p-2'>
                <h4 className='lg:text-xl text-sm font-semibold'>{blog.title}</h4>
                <p className='text-xs text-gray-600 mt-2'>{blog.desc}</p>
            </div>
        </div>
    );
};

export default BlogCards;
