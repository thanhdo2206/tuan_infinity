import React from 'react';
import './verifyEmail.css';

export default function VerifyEmail() {
	return (
		<div className='container'>
			<div className='container__verify'>
				<img
					style={{ marginBottom: '40px', width: '234px' }}
					src='./img/logoInfinity.png'
					alt='Logo'
				/>
				
				<div>
					<p className='text__verify'>Please verify your email address</p>
					<p className='text__google'>
						Get started with Infinity ! Continue with Google to verify
					</p>
				</div>
			</div>
		</div>
	);
}
