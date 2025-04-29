import "bootstrap/dist/css/bootstrap.min.css";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Col, Container, ListGroup, Tab, Tabs } from "react-bootstrap";
import AddButton from "./AddButton";
import "./App.css";
import ListItem from "./ListItem";
import { getColor, getData, removeItemFromList, TABS, type List } from "./utils";

export default function App() {
	const [list, setList] = useState<List | null>(null);
	const [activeTab, setActiveKey] = useState<keyof List>(TABS[0]);
	const [listItems, setListItems] = useState<string[]>([]);
	const [nowEditing, setNowEditing] = useState(-1);

	useEffect(() => {
		if (list) setListItems(list[activeTab]);
		setNowEditing(-1);
	}, [activeTab]);

	useEffect(() => {
		getData().then((data) => {
			setList(data);
			setListItems(data[activeTab]);
		});
	}, []);

	return (
		<div
			className="d-flex flex-column justify-content-top align-items-center"
			style={{ height: "100vh", width: "100vw" }}
		>
			<Col sm={10} lg={8} xl={6} xs={12}>
				<Container fluid style={{ marginTop: "10vh", maxHeight: "80vh" }}>
					<Tabs justify activeKey={activeTab} onSelect={(k) => k && setActiveKey(k as keyof List)}>
						{TABS.map((tab) => (
							<Tab key={tab} eventKey={tab} title={<span className={"p-0 " + getColor(tab)}>{tab}</span>}>
								<ListGroup className="mt-3" style={{ overflowX: "hidden" }}>
									<AddButton
										tab={tab}
										onFocus={() => setNowEditing(-1)}
										onAdd={(item) => {
											setListItems([item, ...listItems]);
											setList({
												...(list as List),
												[tab]: [item, ...listItems],
											});
										}}
									/>
									{listItems.length === 0 ? (
										<motion.div
											initial={{ opacity: 0, y: -20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20, height: 0 }}
											transition={{ duration: 0.3 }}
										>
											<ListGroup.Item className="d-flex justify-content-center align-items-center">
												No items
											</ListGroup.Item>
										</motion.div>
									) : (
										<AnimatePresence initial={true}>
											{listItems.map((item, i) => (
												<ListItem
													key={item}
													item={item}
													i={i}
													onDelete={() => {
														setNowEditing(-1);
														removeItemFromList(tab, item);
														setListItems([...listItems.slice(0, i), ...listItems.slice(i + 1)]);
														setList({
															...(list as List),
															[tab]: [...listItems.slice(0, i), ...listItems.slice(i + 1)],
														});
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
			</Col>
		</div>
	);
}
