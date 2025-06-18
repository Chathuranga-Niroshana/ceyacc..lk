import React, { useState, useEffect } from 'react';
import TeacherRegister from './TeacherRegister';
import StudentDataRegister from './StudentDataRegister';
import RegisterOne from './RegisterOne';
import { provinces } from '../../data/provinces';
import { districts } from '../../data/districts';

const Register = () => {
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
        sex: 1,
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
    const handleSubmit = () => {
        console.log('Submitting registration data:');
        console.log('User Data:', userData);

        if (userType === 2) {
            console.log('Teacher Data:', teacherData);
        } else {
            console.log('Student Data:', studentData);
        }

        // Here you would make an API call to register the user
        // For now, we'll just show an alert
        alert('Registration submitted successfully!');
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