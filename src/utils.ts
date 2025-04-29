// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { arrayRemove, arrayUnion, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

const app = initializeApp({
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
});
const db = getFirestore(app);

export async function getData() {
	// if (import.meta.env.DEV)
	// 	return {
	// 		Eindhoven: ["Eindhoven", "Eindhoven - 1", "Eindhoven - 2", "Eindhoven - 3"],
	// 		Venlo: [],
	// 		Alex: ["Alex"],
	// 		Kol: ["Kol"],
	// 	};

	const docRef = doc(db, "list", "list");
	const docSnap = await getDoc(docRef);
	const list = docSnap.data() as List;

	return list;
}

export async function addItemToList(tab: string, item: string) {
	const docRef = doc(db, "list", "list");

	await updateDoc(docRef, {
		[tab]: arrayUnion(item), // Add the item to the array, ensuring no duplicates
	});
}

export async function removeItemFromList(tab: string, item: string) {
	const docRef = doc(db, "list", "list");

	await updateDoc(docRef, {
		[tab]: arrayRemove(item), // Add the item to the array, ensuring no duplicates
	});
}

export const TABS: (keyof List)[] = ["Eindhoven", "Venlo", "Alex", "Kol"];

export function getColor(tab: string) {
	switch (tab) {
		case "Eindhoven":
		case "Alex":
			return "blue";
		case "Venlo":
		case "Kol":
			return "green";
		default:
			throw new Error("Unknown tab: " + tab);
	}
}

export function getColorVal(tab: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(`--${getColor(tab)}`);
}

// export async function updateList() {
// 	const docRef = await addDoc(collection(db, "todos"), {
// 		text: newTodo,
// 		completed: false,
// 	});
// }

export interface List {
	Venlo: string[];
	Eindhoven: string[];
	Alex: string[];
	Kol: string[];
}
