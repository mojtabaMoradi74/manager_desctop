// import React, { useState, useEffect } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import {   useAnimation } from "framer-motion";
// import { PlayArrow, Pause, Replay } from "@mui/icons-material";

// function AnimatedCounter({ start = 0, end = 100, duration = 2 }) {
// 	const [count, setCount] = useState(start);
// 	const [isPlaying, setIsPlaying] = useState(false);
// 	const controls = useAnimation();

// 	useEffect(() => {
// 		if (isPlaying) {
// 			controls.start({
// 				scale: [1, 1.2, 1],
// 				transition: { duration: 0.5 },
// 			});

// 			const step = start < end ? 1 : -1;
// 			const totalSteps = Math.abs(end - start);
// 			const intervalTime = (duration * 1000) / totalSteps;

// 			const timer = setInterval(() => {
// 				setCount((prev) => {
// 					const next = prev + step;
// 					if ((step > 0 && next >= end) || (step < 0 && next <= end)) {
// 						clearInterval(timer);
// 						setIsPlaying(false);
// 						return end;
// 					}
// 					return next;
// 				});
// 			}, intervalTime);

// 			return () => clearInterval(timer);
// 		}
// 	}, [isPlaying, start, end, duration, controls]);

// 	const resetCounter = () => {
// 		setIsPlaying(false);
// 		setCount(start);
// 	};
// 	useEffect(() => {}, []);

// 	return (
// 		<Box
// 			sx={{
// 				display: "flex",
// 				flexDirection: "column",
// 				alignItems: "center",
// 				gap: 2,
// 				p: 3,
// 				border: "1px solid #ddd",
// 				borderRadius: 2,
// 				maxWidth: 300,
// 				mx: "auto",
// 			}}>
// 			<motion.div animate={controls} style={{ textAlign: "center" }}>
// 				<Typography variant="h2" component="div" color="primary">
// 					{count}
// 				</Typography>
// 			</motion.div>

// 			<Box sx={{ display: "flex", gap: 1 }}>
// 				<Button variant="contained" startIcon={isPlaying ? <Pause /> : <PlayArrow />} onClick={() => setIsPlaying(!isPlaying)}>
// 					{isPlaying ? "توقف" : "شروع"}
// 				</Button>
// 				<Button variant="outlined" startIcon={<Replay />} onClick={resetCounter}>
// 					بازنشانی
// 				</Button>
// 			</Box>
// 		</Box>
// 	);
// }

// export default AnimatedCounter;
