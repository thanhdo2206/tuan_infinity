import * as React from 'react';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ProjectSection from '../projectSection/ProjectSection';
import { applyDrag } from '../utils/DragAndDrop';
import { mapOrder } from '../../../utils/sort';

import './projectTable.css';
import {
	getProjectApi,
	updateDropSection,
	updateDropSectionApi,
} from '../../../redux/actions/ProjectAction';
import { getAllSectionApi } from '../../../redux/actions/SectionAction';
import {
	getAllTaskInProjectApi,
	getAllTaskOrderAction,
	updateDropTask,
	updateTaskOrderInSectionApi,
} from '../../../redux/actions/TaskAction';
import ProjectTaskArchive from '../projectTaskArchive/ProjectTaskArchive';

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
		// position: 'fixed',
		// top: '120px',
		// right: '0',
		zIndex: '5',
		background: '#fff',
	},
	bodyTable: {
		// marginTop: '150px',
		position: 'relative',
		marginTop: '78px',
		zIndex: '0'
	},
};
export default function ProjectTable() {
	const dispatch = useDispatch();
	const { projectId } = useParams();
	const { sectionOrder } = useSelector(
		state => state.ProjectReducer.currentProject
	);
	const sections = useSelector(state => state.SectionReducer.arrSections);
	const sectionsSort =
		sectionOrder && sections ? mapOrder(sections, sectionOrder, '_id') : [];
	const sectionsArchive = sectionsSort.length
		? sectionsSort.filter(section => section.archived)
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

	const dispatchArrTaskOrder = sections => {
		const taskOrderInProject = sections.map(section => {
			const sectionId = section._id;
			const taskOrder = section.taskOrder;
			return { sectionId, taskOrder };
		});

		dispatch(getAllTaskOrderAction(taskOrderInProject));
	};

	const handleSectionDrop = dropResult => {
		let newSections = applyDrag(sectionsArchive, dropResult);
		let newSectionOrder = newSections.map(section => section._id);
		dispatch(updateDropSectionApi(newSectionOrder, projectId));
		dispatch(updateDropSection(newSectionOrder));
	};

	const handleTaskDrop = (dropResult, section, taskList) => {
		const { addedIndex, payload } = dropResult;
		if (addedIndex !== null) {
			let newTasks = applyDrag(taskList, dropResult);
			let newTaskOrder = newTasks.map(task => task._id);
			dispatch(updateDropTask(section._id, newTaskOrder, payload));
			dispatch(updateTaskOrderInSectionApi(newTaskOrder, section._id));
		}
	};

	const arrTaskArchive = tasks.length
		? tasks.filter(task => task.archivedTask)
		: [];
	// console.log(arrTaskArchive);

	//mảng các task archive thuộc section ko archive
	const arrTaskArchiveInSectionUnarchive = [];

	for (let i = 0; i < arrTaskArchive.length; i++) {
		const section = sections.find(
			section => section._id === arrTaskArchive[i].sectionId
		);
		if (!section.archived) {
			arrTaskArchiveInSectionUnarchive.push(arrTaskArchive[i]);
		}
	}

	return (
		<Box sx={{ mt: 2 }}>
			<Box sx={{ zIndex: '5', position: 'sticky', top: '120px' }}>
				<Grid container style={styles.headerTable} >
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

			<Box sx={{ ...styles.bodyTable, paddingTop: '4px' }}>
				<ProjectTaskArchive />
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
					{sectionsArchive.map((section, index) => {
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
		</Box>
	);
}
