import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, getUserProfile } from '../../features/auth/authSlice';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import cloudinaryUpload from '../../utils/cloudinaryInstance';

const EditProfile = () => {
    const dispatch = useDispatch();
    const { userProfile, loading, error } = useSelector((state) => state.auth);
    const [form, setForm] = useState({
        name: '',
        email: '',
        bio: '',
        mobile_no: '',
        dob: '',
        school_name: '',
        address_line_one: '',
        city: '',
        province: '',
        sex: '',
        image: '',
        cover_image: '',
        teacher: null,
        student: null,
    });
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ image: 0, cover_image: 0 });
    const [uploading, setUploading] = useState({ image: false, cover_image: false });

    useEffect(() => {
        if (!userProfile) {
            dispatch(getUserProfile());
        } else {
            setForm({
                name: userProfile.name || '',
                email: userProfile.email || '',
                bio: userProfile.bio || '',
                mobile_no: userProfile.mobile_no || '',
                dob: userProfile.dob ? userProfile.dob.split('T')[0] : '',
                school_name: userProfile.school_name || '',
                address_line_one: userProfile.address_line_one || '',
                city: userProfile.city || '',
                province: userProfile.province || '',
                sex: userProfile.sex || '',
                image: userProfile.image || '',
                cover_image: userProfile.cover_image || '',
                teacher: userProfile.teacher
                    ? {
                        subjects_taught: userProfile.teacher.subjects_taught || [],
                        teaching_experience: userProfile.teacher.teaching_experience || '',
                    }
                    : null,
                student: userProfile.student
                    ? {
                        grade: userProfile.student.grade || '',
                        is_completed: userProfile.student.is_completed || false,
                    }
                    : null,
            });
        }
    }, [userProfile, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTeacherChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            teacher: { ...prev.teacher, [name]: value },
        }));
    };

    const handleStudentChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            student: { ...prev.student, [name]: value },
        }));
    };

    const handleSubjectsChange = (e) => {
        const { value } = e.target;
        setForm((prev) => ({
            ...prev,
            teacher: { ...prev.teacher, subjects_taught: value.split(',').map((s) => s.trim()) },
        }));
    };

    // Cloudinary upload handler using utility
    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading((prev) => ({ ...prev, [field]: true }));
        setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
        const url = await cloudinaryUpload(file, (progress) => setUploadProgress((prev) => ({ ...prev, [field]: progress })));
        if (url) {
            setForm((prev) => ({ ...prev, [field]: url }));
        } else {
            alert('Upload failed. Please try again.');
        }
        setUploading((prev) => ({ ...prev, [field]: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userProfile) return;
        setSuccess(false);
        const updateData = { ...form };
        // Remove empty teacher/student if not present
        if (!userProfile.teacher) delete updateData.teacher;
        if (!userProfile.student) delete updateData.student;
        try {
            await dispatch(updateUserProfile({ userId: userProfile.id, updateData })).unwrap();
            setSuccess(true);
            dispatch(getUserProfile());
        } catch (err) {
            setSuccess(false);
        }
    };

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <form
                className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
                {success && (
                    <div className="flex items-center mb-4 text-emerald-400 bg-emerald-500/10 rounded-lg p-3">
                        <CheckCircle className="w-5 h-5 mr-2" /> Profile updated successfully!
                    </div>
                )}
                {error && (
                    <div className="flex items-center mb-4 text-red-400 bg-red-500/10 rounded-lg p-3">
                        <AlertTriangle className="w-5 h-5 mr-2" /> {error}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Image Upload */}
                    <div>
                        <label className="block text-white mb-1">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'image')}
                            className="mb-2"
                        />
                        {uploading.image && (
                            <>
                                <Loader2 className="w-5 h-5 text-blue-400 animate-spin mb-2" />
                                <progress value={uploadProgress.image} max="100" className="w-full mb-2">{uploadProgress.image}%</progress>
                            </>
                        )}
                        {form.image && (
                            <img src={form.image} alt="Profile Preview" className="w-20 h-20 rounded-full mb-2 object-cover" />
                        )}
                        <input
                            type="text"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="Or paste image URL"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
                        />
                    </div>
                    {/* Cover Image Upload */}
                    <div>
                        <label className="block text-white mb-1">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*,video/*,application/pdf"
                            onChange={(e) => handleFileUpload(e, 'cover_image')}
                            className="mb-2"
                        />
                        {uploading.cover_image && (
                            <>
                                <Loader2 className="w-5 h-5 text-blue-400 animate-spin mb-2" />
                                <progress value={uploadProgress.cover_image} max="100" className="w-full mb-2">{uploadProgress.cover_image}%</progress>
                            </>
                        )}
                        {form.cover_image && (
                            <img src={form.cover_image} alt="Cover Preview" className="w-full h-24 object-cover rounded mb-2" />
                        )}
                        <input
                            type="text"
                            name="cover_image"
                            value={form.cover_image}
                            onChange={handleChange}
                            placeholder="Or paste cover image URL"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Bio</label>
                        <input
                            type="text"
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Mobile No</label>
                        <input
                            type="text"
                            name="mobile_no"
                            value={form.mobile_no}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">School Name</label>
                        <input
                            type="text"
                            name="school_name"
                            value={form.school_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Address</label>
                        <input
                            type="text"
                            name="address_line_one"
                            value={form.address_line_one}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Province</label>
                        <input
                            type="text"
                            name="province"
                            value={form.province}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Sex</label>
                        <select
                            name="sex"
                            value={form.sex}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                {/* Teacher Fields */}
                {userProfile.teacher && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-blue-300 mb-4">Teacher Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white mb-1">Subjects Taught (comma separated)</label>
                                <input
                                    type="text"
                                    name="subjects_taught"
                                    value={form.teacher?.subjects_taught?.join(', ') || ''}
                                    onChange={handleSubjectsChange}
                                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-1">Teaching Experience</label>
                                <input
                                    type="text"
                                    name="teaching_experience"
                                    value={form.teacher?.teaching_experience || ''}
                                    onChange={handleTeacherChange}
                                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                    </div>
                )}
                {/* Student Fields */}
                {userProfile.student && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-purple-300 mb-4">Student Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white mb-1">Grade</label>
                                <input
                                    type="number"
                                    name="grade"
                                    min="1"
                                    max="13"
                                    value={form.student?.grade || ''}
                                    onChange={handleStudentChange}
                                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;