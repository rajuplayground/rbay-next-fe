'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	role?: 'primary' | 'secondary' | 'success' | 'danger';
}

export default function Button({ role = 'primary', className = '', children, ...props }: ButtonProps) {
	const baseClasses = 'py-2 px-4 flex justify-center items-center text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-full';

	const roleClasses = {
		primary: 'bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300',
		secondary: 'bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300',
		success: 'bg-green-500 hover:bg-green-700 disabled:bg-green-300',
		danger: 'bg-red-500 hover:bg-red-700 disabled:bg-red-300'
	};

	return (
		<button className={`${baseClasses} ${roleClasses[role]} ${className}`} {...props}>
			{children}
		</button>
	);
}
