import React, { useState, useRef } from 'react';
import axios from 'axios';
import TextEditor from './TextEditor';
import { Upload, ImagePlus, Trash2, Loader2, Calendar } from 'lucide-react';

const CreateBlogs = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [useCurrentDate, setUseCurrentDate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/blog`

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDateToggle = (e) => {
    setUseCurrentDate(e.target.checked);
    if (e.target.checked) {
      setPublishDate('');
    }
  };

  const handleSubmitBlog = async () => {
    // Get content from TextEditor
    const content = editorRef.current?.innerHTML || '';

    // Validate inputs
    if (!title.trim()) {
      setError('Please add a blog title');
      return;
    }

    if (!content.trim()) {
      setError('Please add blog content');
      return;
    }

    if (!image) {
      setError('Please upload a thumbnail');
      return;
    }

    if (!useCurrentDate && !publishDate) {
      setError('Please select a publish date or use current date');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create FormData to send multipart/form-data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      //formData.append('author', import.meta.env.VITE_ADMIN_ID);
      console.log(author);
      formData.append('authorName', author);
      
      // Add date - either current date or custom date
      if (!useCurrentDate && publishDate) {
        formData.append('publishedAt', new Date(publishDate).toISOString());
      }
      
      //alert(import.meta.env.VITE_ADMIN_ID);
      // Add tags
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      formData.append('tags', JSON.stringify(tagsArray));
      
      // Append thumbnail
      formData.append('thumbnail', image);

      // Send POST request with proper content type
      const response = await axios.post(API_URL + '/post-blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form
      setTitle('');
      setTags('');
      setAuthor('');
      setImage(null);
      setPublishDate('');
      setUseCurrentDate(true);
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Show success message
      alert('Blog created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog post');
      console.error('Blog create error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create a New Blog</h2>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Author name Input */}
        <input 
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter Author name"
          className="w-full p-2 border rounded-lg mb-4"
          disabled={isLoading}
        />

        {/* Title Input */}
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title..."
          className="w-full p-2 border rounded-lg mb-4"
          disabled={isLoading}
        />

        {/* Tags Input */}
        <input 
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags (comma-separated)"
          className="w-full p-2 border rounded-lg mb-4"
          disabled={isLoading}
        />

        {/* Date Selection */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Calendar size={20} className="mr-2 text-gray-500" />
            <span className="text-gray-700">Publish Date</span>
          </div>
          
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="useCurrentDate"
              checked={useCurrentDate}
              onChange={handleDateToggle}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="useCurrentDate" className="text-sm text-gray-600">
              Use current date
            </label>
          </div>
          
          {!useCurrentDate && (
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={isLoading || useCurrentDate}
            />
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="mb-4">
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden"
            id="thumbnailUpload"
            disabled={isLoading}
          />
          <label 
            htmlFor="thumbnailUpload" 
            className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            {image ? (
              <div className="relative w-full h-full">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Uploaded Thumbnail" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveImage();
                  }} 
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  disabled={isLoading}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <ImagePlus size={48} />
                <p className="mt-2">Upload Blog Thumbnail</p>
              </div>
            )}
          </label>
        </div>

        {/* Text Editor */}
        <div className="mb-4">
          <TextEditor ref={editorRef} />
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmitBlog}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <Upload className="mr-2" />
          )}
          Publish Blog
        </button>
      </div>
    </div>
  );
};

export default CreateBlogs;
