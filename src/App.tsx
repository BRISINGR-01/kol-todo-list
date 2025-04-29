import "bootstrap/dist/css/bootstrap.min.css";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button, Container, Form, ListGroup, Tab, Tabs } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import "./App.css";
import ListItem from "./ListItem";
import { addItemToList, getColor, getColorVal, getData, removeItemFromList, TABS, type List } from "./utils";

export default function App() {
	const [list, setList] = useState<List | null>(null);
	const [activeTab, setActiveKey] = useState(TABS[0]);
	const [listItems, setListItems] = useState<string[]>([TABS[0]]);
	const [isAdding, setIsAdding] = useState(false);
	const [nowEditing, setNowEditing] = useState(-1);
	const [newItem, setNewItem] = useState("");
	const newItemRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (list) setListItems(list[activeTab]);
		setNowEditing(-1);
		setIsAdding(false);
	}, [activeTab]);

	useEffect(() => {
		newItemRef.current?.addEventListener("blur", () => {
			setIsAdding(false);
			setNowEditing(-1);
		});
		getData().then((data) => {
			setList(data);
			setListItems(data[activeTab]);
		});
	}, []);

	function addItem() {
		addItemToList(activeTab, newItem);
		setIsAdding(false);
		if (newItem.trim()) {
			setListItems([newItem.trim(), ...listItems]);
			setNewItem("");
		}
	}

	return (
		<div className="d-flex flex-column justify-content-top" style={{ height: "100vh", paddingTop: "10vh" }}>
			<Container style={{ maxHeight: "80vh" }}>
				<Tabs activeKey={activeTab} onSelect={(k) => k && setActiveKey(k as keyof List)}>
					{TABS.map((tab) => (
						<Tab key={tab} eventKey={tab} title={<span className={getColor(tab)}>{tab}</span>}>
							<ListGroup className="mt-3" style={{ overflowX: "hidden" }}>
								{isAdding ? (
									<ListGroup.Item className="d-flex align-items-center">
										<Form
											ref={newItemRef}
											className={"w-100 d-flex " + getColor(activeTab)}
											onSubmit={(e: React.FormEvent) => {
												e.preventDefault();
												addItem();
											}}
											onBlur={(e) => {
												if (e.relatedTarget?.id !== "add-button") setIsAdding(false);
											}}
										>
											<Form.Control
												autoFocus
												style={{ backgroundColor: "transparent", color: "inherit" }}
												className="border-0 p-0 shadow-none"
												value={newItem}
												onChange={(e) => {
													setNewItem(e.target.value);
												}}
												placeholder="Type..."
											/>
											<Button
												id="add-button"
												className="border-0 py-0 shadow-none"
												variant="outline-secondary"
												onClick={() => addItem()}
											>
												<FaPlus color={getColorVal(tab)} />
											</Button>
										</Form>
									</ListGroup.Item>
								) : (
									<ListGroup.Item
										action
										onClick={() => setIsAdding(true)}
										className="d-flex justify-content-center align-items-center"
										style={{ height: "2.5em" }}
									>
										<FaPlus color={getColorVal(tab)} fontSize={"1em"} />
									</ListGroup.Item>
								)}
								{listItems.length === 0 ? (
									<ListGroup.Item className="d-flex justify-content-center align-items-center">No items</ListGroup.Item>
								) : (
									<AnimatePresence initial={true}>
										{listItems.map((item, i) => (
											<ListItem
												key={i}
												item={item}
												i={i}
												onDelete={() => {
													setNowEditing(-1);
													removeItemFromList(tab, item);
													setListItems([...listItems.slice(0, i), ...listItems.slice(i + 1)]);
												}}
												tab={tab}
												nowEditing={nowEditing}
												setNowEditing={setNowEditing}
											/>
										))}
									</AnimatePresence>
								)}
							</ListGroup>
						</Tab>
					))}
				</Tabs>
			</Container>
		</div>
	);
}
