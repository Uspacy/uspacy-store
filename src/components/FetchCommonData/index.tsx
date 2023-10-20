import React, { useEffect } from 'react';

import { useAppDispatch } from '../../hooks/redux';
import { fetchDepartments } from '../../store/departments/actions';
import { fetchProfile } from '../../store/profile/actions';
import { fetchUsers } from '../../store/users/actions';

const FetchCommonData: React.FC = () => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(fetchProfile());
		dispatch(fetchUsers());
		dispatch(fetchDepartments());
	}, []);
	return null;
};

export default FetchCommonData;
