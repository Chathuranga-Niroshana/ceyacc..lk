/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import TeacherRegister from './TeacherRegister';
import StudentDataRegister from './StudentDataRegister';
import RegisterOne from './RegisterOne';
import { provinces } from '../../data/provinces';
import { districts } from '../../data/districts';
import { useDispatch } from 'react-redux';
import { register } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [userType, setUserType] = useState(1);
    const [userData, setUserData] = useState({
        image: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNo: '',
        role: 1,
        sex: 'male',
    });

    const [errors, setErrors] = useState({});

    const [teacherData, setTeacherData] = useState({
        dob: '',
        nic: '',
        subjectsTaught: [],
        teachingExperience: '',
        schoolName: '',
        schoolAddressLineOne: '',
        city: '',
        district: '',
        province: '',
    });

    const [studentData, setStudentData] = useState({
        dob: '',
        grade: '',
        schoolName: '',
        schoolAddressLineOne: '',
        city: '',
        district: '',
        province: '',
    });

    // Reset form data if user type changes
    useEffect(() => {
        setUserData(prev => ({
            ...prev,
            role: userType
        }));
    }, [userType]);

    // Handle step changes based on user type
    const nextPage = () => {
        if (currentPage == 1) {
            if (userType == 2) {
                setCurrentPage(2);
            } else {
                setCurrentPage(3);
            }
        } else if (currentPage == 2) {
            // Only teachers will see page 2
            handleSubmit();
        } else {
            handleSubmit();
        }
    };

    // Go back to previous page
    const prevPage = () => {
        setCurrentPage(1);
    };

    // Handle final submission
    const handleSubmit = async () => {
        console.log('Submitting registration data:');
        console.log('User Data:', userData);
        const formattedUserData = {
            image: userData.image,
            cover_image: null,
            name: userData.name,
            bio: "",
            email: userData.email,
            password: userData.password,
            mobile_no: userData.mobileNo,
            sex: userData.sex,
            role_id: Number(userData.role)
        }
        const formattedStudentData = {
            dob: studentData.dob,
            school_name: studentData.schoolName,
            address_line_one: studentData.schoolAddressLineOne,
            city: studentData.district,
            province: studentData.province,
            student: {
                grade: studentData.grade
            }
        }
        const formattedTeacherData = {
            dob: teacherData.dob,
            school_name: teacherData.schoolName,
            address_line_one: teacherData.schoolAddressLineOne,
            city: teacherData.district,
            province: teacherData.province,
            nic: teacherData.nic,
            teacher: {
                subjects_taught: teacherData.subjectsTaught,
                teaching_experience: teacherData.teachingExperience
            }
        }

        if (userType === 2) {
            console.log('Teacher Data:', teacherData);
            try {
                const response = await dispatch(register({ ...formattedUserData, ...formattedTeacherData })).unwrap()
                console.log(response.data)
                alert('Registration submitted successfully!');
            } catch (error) {
                console.log(error)
                alert("Registration Failed. Please Try again")
            }
        } else {
            console.log('Student Data:', studentData);
            try {
                const response = await dispatch(register({ ...formattedUserData, ...formattedStudentData })).unwrap()
                console.log(response.data)
                alert('Registration submitted successfully!');
            } catch (error) {
                console.log(error)
                alert("Registration Failed. Please Try again")
            }
        }
    };

    return (
        <div className='min-h-screen '>
            {currentPage === 1 && (
                <RegisterOne
                    nextPage={nextPage}
                    userType={userType}
                    setUserType={setUserType}
                    userData={userData}
                    setUserData={setUserData}
                    errors={errors}
                    setErrors={setErrors}
                />
            )}

            {currentPage === 2 && (
                <TeacherRegister
                    nextPage={nextPage}
                    prevPage={prevPage}
                    userData={userData}
                    teacherData={teacherData}
                    setTeacherData={setTeacherData}
                    errors={errors}
                    setErrors={setErrors}
                    provinces={provinces}
                    districts={districts}
                />
            )}

            {currentPage === 3 && (
                <StudentDataRegister
                    nextPage={nextPage}
                    prevPage={prevPage}
                    userData={userData}
                    studentData={studentData}
                    setStudentData={setStudentData}
                    errors={errors}
                    setErrors={setErrors}
                    provinces={provinces}
                    districts={districts}
                />
            )}
        </div>
    );
};

export default Register;