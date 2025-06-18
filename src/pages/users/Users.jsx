import React, { useEffect, useState, useRef, useCallback } from 'react';
import MostEngagingUsers from '../home/MostEngagingUsers';
import HeaderTabs from '../../components/layout/Tabs';
import { PiStudentDuotone } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { LuSchool } from "react-icons/lu";
import { SlUserFollowing } from "react-icons/sl";
import SearchField from '../../components/layout/SearchField';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchFollowing,
    fetchStudents,
    fetchTeachers,
    clearStudents,
    clearFollowing,
    clearTeachers
} from '../../features/users/usersSlice';
import UserCard from '../../components/widgets/UserCard';

const tabs = [
    { icon: <PiStudentDuotone />, name: "Students" },
    { icon: <GiTeacher />, name: "Teachers" },
    { icon: <LuSchool />, name: "My School" },
    { icon: <SlUserFollowing />, name: "Following" },
];

const Users = () => {
    const [value, setValue] = useState(0);
    const previousValue = useRef(0);
    const dispatch = useDispatch();

    const { students, teachers, following } = useSelector((state) => state.users);

    const getUsersByTab = (tabIndex) => {
        switch (tabIndex) {
            case 0: return students;
            case 1: return teachers;
            case 2: return []; // assuming My School has no data currently
            case 3: return following;
            default: return [];
        }
    };

    const fetchDataByTab = useCallback((tabIndex) => {
        switch (tabIndex) {
            case 0: return dispatch(fetchStudents());
            case 1: return dispatch(fetchTeachers());
            case 3: return dispatch(fetchFollowing());
            default: return;
        }
    }, [dispatch]);

    const clearDataByTab = useCallback((tabIndex) => {
        switch (tabIndex) {
            case 0: return dispatch(clearStudents());
            case 1: return dispatch(clearTeachers());
            case 3: return dispatch(clearFollowing());
            default: return;
        }
    }, [dispatch]);

    useEffect(() => {
        fetchDataByTab(value);
        return () => {
            clearDataByTab(previousValue.current);
        };
    }, [value, fetchDataByTab, clearDataByTab]);

    useEffect(() => {
        previousValue.current = value;
    }, [value]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            {/* Most Engaging Users */}
            <div className='flex flex-col justify-center items-center'>
                <MostEngagingUsers />
            </div>

            {/* Tabs and Search */}
            <div className='flex flex-row justify-center items-center gap-2 mb-2'>
                <SearchField />
            </div>
            <div className='flex flex-row w-full justify-center items-center gap-2 mb-2'>
                <HeaderTabs tabs={tabs} value={value} handleChange={handleChange} />
            </div>

            {/* Users List */}
            <div className='flex flex-col items-center gap-10'>
                {getUsersByTab(value).map((user) => (
                    <UserCard user={user} key={user.id} />
                ))}
            </div>
        </div>
    );
};

export default Users;
