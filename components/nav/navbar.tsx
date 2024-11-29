"use client";

import React from 'react';
import { Button } from '../ui/button';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function NavBar() {
const { isSignedIn } = useUser();


return (
	<div className='flex justify-between items-center p-4 bg-primary'>
	<div>
		<p className='text-4xl text-background'>One Note</p>
	</div>
	<div>
		{isSignedIn ? (
			<UserButton  />
		) : (
			<SignInButton>
		<Button className='text-xl' variant="secondary">Sign In</Button>
			</SignInButton>
		)}
	</div>
	</div>
);
}
