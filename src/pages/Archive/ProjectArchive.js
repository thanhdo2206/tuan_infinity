import { Box } from '@mui/material';
import React from 'react';
import ProjectHeader from './projectHeader/ProjectHeader';
import ProjectTable from './projectTable/ProjectTable';

export default function ProjectListPage() {
	return (
		<Box sx={{ position: 'relative' }}>
			<div
				style={{
					width: '100%',
					height: '50px',
					backgroundColor: '#fff',
					position: 'fixed',
					top: '84px',
					right: '0',
					zIndex: '5',
				}}
			></div>
			<ProjectTable />
		</Box>
	);
}
