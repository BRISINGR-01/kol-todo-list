import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { ListGroup } from "react-bootstrap";
import "./App.css";
import { getColor, type List } from "./utils";

export default function ListItem({
	item,
	i,
	tab,
	onDelete,
	nowEditing,
	setNowEditing,
}: {
	tab: keyof List;
	item: string;
	i: number;
	setNowEditing: (n: number) => void;
	onDelete: () => void;
	nowEditing: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20, height: 0 }}
			transition={{ duration: 0.3, delay: i * 0.05 }} // Staggered delay
			style={{
				position: "relative",
				zIndex: i,
			}}
			key={item}
		>
			<motion.div
				style={{ position: "absolute", width: "100%", transform: "translateY(-100%)" }}
				initial={{ x: "100%" }} // Start off-screen (right)
				animate={{ x: nowEditing === i ? "0%" : "100%" }} // Slide into view
				exit={{ x: "100%" }} // Slide back out to the right when editing is done
				transition={{
					type: "spring",
					stiffness: 100,
					damping: 25,
					duration: 0.2,
				}}
			>
				<ListGroup.Item action variant="danger" onBlur={() => setNowEditing(-1)} onClick={onDelete}>
					Delete
				</ListGroup.Item>
			</motion.div>
			<motion.div
				initial={{ x: "0%" }}
				animate={{ x: nowEditing === i ? "-100%" : "0%" }} // Slide into view
				exit={{ x: "0%" }} // Slide back out to the right when editing is done
				transition={{
					type: "spring",
					stiffness: 100,
					damping: 25,
					duration: 0.2,
				}}
			>
				<ListGroup.Item className={getColor(tab)} key={i} action onClick={() => setNowEditing(i)}>
					{item}
				</ListGroup.Item>
			</motion.div>
		</motion.div>
	);
}
