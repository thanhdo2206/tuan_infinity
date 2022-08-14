import * as React from 'react';
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

import ProjectSection from '../projectSection/ProjectSection';
import { applyDrag } from '../utils/DragAndDrop';
import { mapOrder } from '../../../utils/sort';
import './projectTable.css';
import {
	getProjectApi,
	updateDropSection,
	updateDropSectionApi,
} from '../../../redux/actions/ProjectAction';
import {
	addSectionApi,
	getAllSectionApi,
} from '../../../redux/actions/SectionAction';
import {
	getAllTaskInProjectApi,
	getAllTaskOrderAction,
	updateDropTask,
	updateTaskOrderInSectionApi,
} from '../../../redux/actions/TaskAction';
import ProjectAddSectionForm from '../projectSection/ProjectAddSectionForm';
import { ProgressListener } from '../../../components/ProgressTest/Progress';

const headerTable = [
	'Task name',
	'Assignee',
	'Due date',
	'Created on',
	'Priority',
	'Task Progress',
];

const styles = {
	headerTitleTable: {
		border: '1px solid #CFCBCB',
		borderLeft: 'none',
		fontSize: '13px',
		padding: '10px',
	},
	headerTable: {
		position: 'fixed',
		top: '120px',
		// right: '0',
		zIndex: '5',
		background: '#fff',
	},
	bodyTable: {
		marginTop: '150px',
	},
};
export default function ProjectTable() {
	const dispatch = useDispatch();
	const { projectId } = useParams();
	const [isAddSection, setIsAddSection] = useState(false);

	const { sectionOrder } = useSelector(
		state => state.ProjectReducer.currentProject
	);
	const sections = useSelector(state => state.SectionReducer.arrSections);
	const sectionsSort =
		sectionOrder && sections ? mapOrder(sections, sectionOrder, '_id') : [];
	const sectionsUnarchive = sectionsSort.length
		? sectionsSort.filter(section => !section.archived)
		: [];

	const tasks = useSelector(state => state.TaskReducer.arrTask);
	const taskOrders = useSelector(state => state.TaskReducer.taskOrders);

	useEffect(() => {
		async function fetchData() {
			if (projectId) {
				await dispatch(getAllSectionApi(projectId));
				await dispatch(getProjectApi(projectId));
				await dispatch(getAllTaskInProjectApi(projectId));
				// await dispatch(getAllTaskOrderAction(taskOrderInProject));
			}
		}
		fetchData();
	}, [projectId]);

	useEffect(() => {
		dispatchArrTaskOrder(sections);
	}, [sections]);

	const dispatchArrTaskOrder = async sections => {
		const taskOrderInProject = sections.map(section => {
			const sectionId = section._id;
			const taskOrder = section.taskOrder;
			return { sectionId, taskOrder };
		});
		ProgressListener.emit('start');
		await dispatch(getAllTaskOrderAction(taskOrderInProject));
		ProgressListener.emit('stop');
	};

	const handleSectionDrop = async dropResult => {
		let newSections = applyDrag(sectionsUnarchive, dropResult);
		let newSectionOrder = newSections.map(section => section._id);
		dispatch(updateDropSection(newSectionOrder));
		ProgressListener.emit('start');
		await dispatch(updateDropSectionApi(newSectionOrder, projectId));
		ProgressListener.emit('stop');
	};

	const handleTaskDrop = async (dropResult, section, taskList) => {
		const { addedIndex, payload } = dropResult;
		if (addedIndex !== null) {
			let newTasks = applyDrag(taskList, dropResult);
			let newTaskOrder = newTasks.map(task => task._id);
			await dispatch(updateDropTask(section._id, newTaskOrder, payload));
			ProgressListener.emit('start');
			await dispatch(updateTaskOrderInSectionApi(newTaskOrder, section._id));
			ProgressListener.emit('stop');
		}
	};

	const handleShowFormAddSection = () => {
		setIsAddSection(true);
	};

	const handleAddSection = async e => {
		const nameSection = e.target.value;
		const sectionNameInput = !nameSection.trim()
			? 'Untitled section'
			: nameSection;

		const newSection = {
			sectionName: sectionNameInput,
			taskOrder: [],
			projectId: projectId,
		};
		e.target.value = sectionNameInput;
		setIsAddSection(false);
		ProgressListener.emit('start');
		await dispatch(addSectionApi(newSection));
		ProgressListener.emit('stop');
		e.target.value = '';
	};

	return (
		<Box sx={{ mt: 2 }}>
			<Box>
				<Grid container style={styles.headerTable} drawerWidth='240px'>
					<Grid item xs={4} style={styles.headerTitleTable}>
						Task name
					</Grid>
					<Grid item xs={2} align='right' style={styles.headerTitleTable}>
						Assignees
					</Grid>
					<Grid item xs={2} align='right' style={styles.headerTitleTable}>
						Due date
					</Grid>
					<Grid item xs={2} align='right' style={styles.headerTitleTable}>
						Created by
					</Grid>
					<Grid
						item
						xs={2}
						align='right'
						style={{ ...styles.headerTitleTable, borderRight: 'none' }}
					>
						Priority
					</Grid>
				</Grid>
			</Box>
			<Box sx={styles.bodyTable}>
				<Container
					onDrop={handleSectionDrop}
					dragHandleSelector='.row-drag-handle'
					getChildPayload={index => sections[index]}
					// onDragStart={handleDragStart}
					// onDragEnd={handleDragEnd}
					dragClass='opacity-ghost'
					dropClass='opacity-ghost-drop'
					dropPlaceholder={{
						animationDuration: 150,
						showOnTop: true,
						className: 'cards-drop-preview',
					}}
					className='container__big'
				>
					{sectionsUnarchive.map((section, index) => {
						return (
							<Draggable key={section._id}>
								<ProjectSection
									section={section}
									indexSection={index}
									tasks={tasks}
									taskOrders={taskOrders}
									onTaskDrop={handleTaskDrop}
								/>
							</Draggable>
						);
					})}
				</Container>
			</Box>
			<Box>
				<ProjectAddSectionForm
					isDisplay={isAddSection}
					onSubmit={handleAddSection}
				/>
			</Box>
			<Box
				className='projectTable__box--addSection'
				onClick={handleShowFormAddSection}
			>
				<AddIcon className='projectTable__icon--addSection' />
				<Typography className='projectTable__typo--addSection'>
					Add Section
				</Typography>
			</Box>
		</Box>
	);
}
