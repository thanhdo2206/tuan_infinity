import {
	archiveTaskService,
	assignTaskService,
	completeTaskService,
	createTaskService,
	getAllTaskInProjectService,
	updateTaskOrderInSectionService,
	updateTaskService,
	updateTitleTaskService,
} from '../../services/taskService';
import {
	GET_ALL_TASK_IN_PROJECT,
	GET_ALL_TASK_ORDER_IN_PROJECT,
	UPDATE_DRAG_TASK,
	UPDATE_DROP_TASK,
} from '../types/TaskTypes';
import { getAllSectionApi } from './SectionAction';

export const getAllTaskInProjectApi = projectId => {
	return async dispatch => {
		const { data } = await getAllTaskInProjectService(projectId);

		dispatch({
			type: GET_ALL_TASK_IN_PROJECT,
			dataTasks: data,
		});
	};
};

export const getAllTaskOrderAction = taskOrderInProject => {
	let action = {
		type: GET_ALL_TASK_ORDER_IN_PROJECT,
		taskOrderInProject,
	};

	return action;
};

export const updateDragTask = (sectionDragId, newTaskOrder) => {
	let action = {
		type: UPDATE_DRAG_TASK,
		sectionDragId,
		newTaskOrder,
	};

	return action;
};

export const updateDropTask = (sectionDropId, newTaskOrder, taskDrop) => {
	let action = {
		type: UPDATE_DROP_TASK,
		sectionDropId,
		newTaskOrder,
		taskDrop,
	};

	return action;
};

export const updateSectionIdTaskDragApi = (taskDrag, sectionDropId) => {
	return async dispatch => {
		const taskDrop = { ...taskDrag, sectionId: sectionDropId };
		const { data } = await updateTaskService(taskDrop);

		// dispatch(getAllTaskInProjectApi(data.projectId));
	};
};

export const updateTaskOrderInSectionApi = (newTaskOrder, sectionId) => {
	const data = { newTaskOrder, sectionId };
	return async dispatch => {
		const result = await updateTaskOrderInSectionService(data);

		dispatch(getAllSectionApi(result.data.projectId));
	};
};

export const updateTitleTaskApi = (taskId, taskName) => {
	return async dispatch => {
		const data = { taskId, taskName };
		const result = await updateTitleTaskService(data);

		dispatch(getAllTaskInProjectApi(result.data.projectId));
	};
};

export const completeTaskApi = taskId => {
	return async dispatch => {
		const result = await completeTaskService(taskId);

		dispatch(getAllTaskInProjectApi(result.data.projectId));
	};
};

export const assignTaskApi = taskUpdate => {
	return async dispatch => {
		const { data } = await updateTaskService(taskUpdate);

		dispatch(getAllTaskInProjectApi(data.projectId));
	};
};

export const setDateTaskApi = taskUpdate => {
	return async dispatch => {
		const { data } = await updateTaskService(taskUpdate);

		dispatch(getAllTaskInProjectApi(data.projectId));
	};
};

export const createTaskApi = (taskCreate, taskOrderInSection, isAddTask) => {
	return async dispatch => {
		const { data } = await createTaskService(taskCreate);
		const newTaskOrderInSection = taskOrderInSection;

		isAddTask === 1
			? newTaskOrderInSection.push(data._id)
			: newTaskOrderInSection.splice(0, 0, data._id);

		dispatch(updateTaskOrderInSectionApi(newTaskOrderInSection, data.sectionId));
		dispatch(getAllTaskInProjectApi(data.projectId));
	};
};

export const updatePriorityTaskApi = taskUpdate => {
	return async dispatch => {
		const { data } = await updateTaskService(taskUpdate);

		dispatch(getAllTaskInProjectApi(data.projectId));
	};
};

export const archiveTaskApi = task => {
	return async dispatch => {
		const result = await archiveTaskService(task);

		dispatch(getAllTaskInProjectApi(result.data.projectId));
	};
};
