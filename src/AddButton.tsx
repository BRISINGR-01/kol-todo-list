import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, ListGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { addItemToList, getColor, getColorVal, type List } from "./utils";

export default function AddButton({
	onFocus,
	onAdd,
	tab,
}: {
	onFocus: () => void;
	onAdd: (item: string) => void;
	tab: keyof List;
}) {
	const [newItem, setNewItem] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	function addItem() {
		// setIsOpen(false);
		setNewItem("");

		if (newItem.length !== 0) {
			addItemToList(tab, newItem);
			onAdd(newItem);
		}
	}

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto"; // Reset height
			inputRef.current.style.height = inputRef.current.scrollHeight + "px";
		}
	}, [newItem]);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		} else {
			inputRef.current?.blur();
		}
	}, [isOpen]);

	return (
		<ListGroup.Item
			id="add-area"
			onClick={() => {
				if (!isOpen) {
					onFocus();
					setIsOpen(true);
					inputRef.current?.focus();
				}
			}}
			onBlur={(e) => {
				if (!e.relatedTarget?.closest("#add-area")) setIsOpen(false);
			}}
		>
			<Form
				className={"w-100 d-flex " + getColor(tab)}
				onSubmit={(e: React.FormEvent) => {
					e.preventDefault();
					addItem();
				}}
			>
				<motion.div
					initial={{ width: "0", height: "1.6em" }}
					animate={{
						width: isOpen ? "100%" : "0%",
						height: isOpen ? "auto" : "1.6em",
					}}
					exit={{ width: "0" }}
					transition={{
						type: "spring",
						stiffness: 100,
						damping: 25,
						duration: 0.4,
					}}
				>
					<Form.Control
						as="textarea"
						ref={inputRef}
						autoFocus
						rows={1}
						style={{
							overflow: "hidden",
							resize: "none",
							width: "100%",
							backgroundColor: "transparent",
							color: "inherit",
						}}
						className="border-0 p-0 shadow-none w-100"
						value={newItem}
						onChange={(e) => {
							setNewItem(e.target.value);
							if (e.target.value.replace(newItem, "") === "\n") {
								addItem();
							}
						}}
						placeholder="Type..."
					/>
				</motion.div>
				<Col>
					<div>
						<motion.div
							style={{ width: "min-content" }}
							initial={{ rotateZ: "0" }}
							animate={{
								rotateZ: isOpen ? "360deg" : "0",
							}}
							transition={{
								type: "spring",
								stiffness: 100,
								damping: 25,
								duration: 0.1,
							}}
						>
							<Button
								className="border-0 py-0 shadow-none"
								variant="outline-secondary"
								disabled={!isOpen}
								onClick={() => addItem()}
							>
								<FaPlus color={getColorVal(tab)} />
							</Button>
						</motion.div>
					</div>
					<motion.div
						initial={{ translateY: "-200%", opacity: 0, height: 0 }}
						animate={{
							translateY: isOpen ? "0" : "-200%",
							opacity: isOpen ? 1 : 0,
							height: isOpen ? "auto" : 0,
						}}
						transition={{
							type: "spring",
							stiffness: 100,
							damping: 25,
							duration: 0.1,
						}}
					>
						<Button
							className="border-0 py-0 shadow-none"
							variant="outline-secondary"
							onClick={() => {
								setNewItem("");
								setIsOpen(false);
							}}
						>
							<FaX size={14} color={getColorVal(tab)} />
						</Button>
					</motion.div>
				</Col>
			</Form>
		</ListGroup.Item>
	);
}
