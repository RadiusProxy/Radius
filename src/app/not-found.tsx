'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';
import Image from 'next/image';

export default function PageNotFound() {
	return (
		<div className="flex h-screen items-center justify-center">
			{/* Container for mobile and desktop layouts */}
			<div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
				{/* Cat gif on top for mobile, on the left for larger screens */}
				<div className="flex-shrink-0">
					<Image
						src="/kitty.gif"
						width={300}  // dont adjust unless you're weird
						height={300}
						alt="kitty"
						className="rounded-lg" // rounded corner for kitty
					/>
				</div>

				{/* the error card */}
				<Card className="flex h-96 w-96 flex-col items-center justify-center">
					<CardTitle className="mx-auto mb-2 flex flex-col items-center justify-center">
						<ShieldX className="h-14 w-14" />
						<h2 className="mt-2 text-3xl font-semibold">404 Error</h2>
					</CardTitle>
					<CardContent className="mt-4 text-center text-base">
						Click below to go to the home page.<br /> 404 - Page not found
					</CardContent>
					<CardContent className="mt-4">
						<Button
							type="button"
							onClick={() => (window.location.href = '/')}
							className="text-muted-background text-black"
						>
							Go Home
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
