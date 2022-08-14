import React from 'react';
import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TooltipCustomize } from '../../components/ToolTip/ToolTip';
import { useSelector, useDispatch } from 'react-redux';
import { completeTaskApi } from '../../redux/actions/TaskAction';
import { ProgressListener } from '../../components/ProgressTest/Progress';

export default function CompleteTask(props) {
	const { task } = props;
	const dispatch = useDispatch();

	const handleCompleteIncompleteTask = async () => {
		ProgressListener.emit('start');

		await dispatch(completeTaskApi(task._id));
		ProgressListener.emit('stop');
	};
	return (
		<Box className='box__complete-task' onClick={handleCompleteIncompleteTask}>
			{task.taskStatus ? (
				<TooltipCustomize title='Mark task incomplete' placement='bottom'>
					<CheckCircleIcon
						className='icon__checkCircle icon__complete'
						sx={{ fontSize: '18px', marginRight: ' 10px' }}
					/>
				</TooltipCustomize>
			) : (
				<TooltipCustomize title='Mark task complete' placement='bottom'>
					<CheckCircleOutlineIcon
						className='icon__checkCircle icon__incomplete'
						sx={{ fontSize: '18px', marginRight: ' 10px' }}
					/>
				</TooltipCustomize>
			)}
		</Box>
	);
}
