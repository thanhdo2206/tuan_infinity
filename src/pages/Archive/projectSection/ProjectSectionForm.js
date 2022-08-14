import { Box, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorSharpIcon from '@mui/icons-material/DragIndicatorSharp';
import ShortTextIcon from '@mui/icons-material/ShortText';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	MODAL_ACTION_CLOSE,
	MODAL_ACTION_CONFIRM,
} from '../../../constants/constants';
import { deleteSectionAction } from '../../../redux/actions/ProjectAction';
import ConfirmModal from '../../../components/Modal/ConfirmModal';
import {
	archiveSectionApi,
	unArchiveSectionApi,
	updateTitleSectionApi,
} from '../../../redux/actions/SectionAction';
import ButtonProjectList from '../../../components/ButtonProjectList/ButtonProjectList';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import { ProgressListener } from '../../../components/ProgressTest/Progress';

const styles = {
	textTitle: {
		cursor: 'pointer',
		fontWeight: 'bold',
		textTransform: 'capitalize',
	},
	icon: {
		fontSize: '15px',
	},
	iconHover: {
		fontSize: '17px',
	},
	titleBlockAfterActive: {
		backgroundColor: '#fff',
	},
	titleBlockBeforeActive: {
		backgroundColor: '#fff',
		borderRadius: '10px',
		border: '1px solid grey',
	},
};

export default function ProjectSectionForm(props) {
	const {
		onMouseDown,
		onMouseUp,
		isExpand,
		onClickExpandButton,
		sectionId,
		sectionName,
		onClickAddTaskAbove,
		onClickAddSectionAbove,
		onClickAddSectionBelow,
	} = props;

	const [isShowMenuSection, setIsShowMenuSection] = useState(false);
	const [isShowModalUnarchiveSection, setShowModalUnarchiveSection] =
		useState(false);

	const dispatch = useDispatch();
	const searchInput = useRef(null);

	const toggleModal = () => {
		setShowModalUnarchiveSection(!isShowModalUnarchiveSection);
	};

	const handleShowMenuSection = () => {
		setIsShowMenuSection(!isShowMenuSection);
	};

	const handleModalUnArchiveSection = async type => {
		if (type === MODAL_ACTION_CONFIRM) {
			ProgressListener.emit('start');
			await dispatch(unArchiveSectionApi(sectionId));
			ProgressListener.emit('stop');
		}
		setIsShowMenuSection(false);
		setShowModalUnarchiveSection(false);
	};

	const handleEditTitleSection = e => {
		const titleSection = e.target.value;
		const titleSectionEdit = !titleSection.trim()
			? 'Untitled section'
			: titleSection;

		const dataSection = {
			sectionId: sectionId,
			sectionName: titleSectionEdit,
		};
		searchInput.current.value = titleSectionEdit;
		dispatch(updateTitleSectionApi(dataSection));
	};

	const handleKeyPress = value => {
		if (value.key === 'Enter') {
			searchInput.current.blur();
		}
	};

	return (
		<Grid item className='title__content ' sx={{ marginLeft: '20px' }}>
			{/* <Box
				className='row-drag-handle'
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
			>
				<ButtonProjectList
					icon={<DragIndicatorSharpIcon style={styles.icon} />}
					id='title__icon--hover'
				/>
			</Box> */}
			<ButtonProjectList
				icon={
					isExpand ? (
						<ExpandMoreIcon style={styles.icon} />
					) : (
						<ChevronRightIcon style={styles.icon} />
					)
				}
				id='title_button--expand'
				onClickButton={onClickExpandButton}
			/>
			<TextField
				onBlur={handleEditTitleSection}
				sx={{
					width: '175px',
					'& .MuiOutlinedInput-root:hover': {
						'& > fieldset': {
							borderColor: 'gray',
						},
					},
					'& .MuiOutlinedInput-root.Mui-focused': {
						'& > fieldset': {
							borderColor: '#0057B7',
						},
					},
					'& .MuiOutlinedInput-root': {
						'& > fieldset': {
							borderColor: 'white',
							borderRadius: '10px',
						},
					},
					'&': {
						input: {
							padding: '10px',
							fontWeight: 'bold',
							fontSize: '15px',
						},
					},
					borderColor: 'white',
				}}
				placeholder={'Write a section name'}
				className='Box__input--addTask'
				defaultValue={sectionName}
				onKeyPress={handleKeyPress}
				inputRef={searchInput}
				InputProps={{
					readOnly: true,
				}}
			/>
			{/* <Box sx={{ position: 'relative' }}>
				<ButtonProjectList
					icon={<AddIcon style={styles.icon} />}
					id='title__button--addTask'
					onClickButton={onClickAddTaskAbove}
				/>
				<Typography id='addTask__span--hover'>Add Task</Typography>
			</Box> */}
			<Box sx={{ position: 'relative' }}>
				<ButtonProjectList
					icon={<MoreHorizIcon style={styles.icon} />}
					id='title__button--showMore'
					onClickButton={handleShowMenuSection}
				/>
				<Box
					className='dropMenu--Section'
					sx={{ border: '1px solid grey', borderRadius: '5px' }}
					display={isShowMenuSection ? 'block' : 'none'}
				>
					{/* <ButtonProjectList
						icon={<ShortTextIcon style={styles.icon} />}
						id='dropItem__button--addSection'
						text='Add Section'
					/>
					<Box className='drop__block--addSection'>
						<ButtonProjectList
							icon={<ArrowUpwardIcon style={styles.icon} />}
							id='dropItem__button--addSectionAbove'
							text='Add section above'
							onClickButton={onClickAddSectionAbove}
						/>
						<ButtonProjectList
							icon={<ArrowDownwardIcon style={styles.icon} />}
							id='dropItem__button--addSectionBelow'
							text='Add section below'
							onClickButton={onClickAddSectionBelow}
						/>
					</Box> */}
					<ButtonProjectList
						icon={
							<UnarchiveOutlinedIcon style={styles.icon} id='button-delSection' />
						}
						id='dropItem__button--delSection'
						text='Unarchive Section'
						onClickButton={toggleModal}
					/>
					<ConfirmModal
						show={isShowModalUnarchiveSection}
						title='Unarchive this section'
						content={
							<span>
								Are you sure you want to unarchive this section <b>{sectionName}</b>?
							</span>
						}
						onAction={handleModalUnArchiveSection}
						nameBtnConfirm='Unarchive section'
					/>
				</Box>
			</Box>
		</Grid>
	);
}
