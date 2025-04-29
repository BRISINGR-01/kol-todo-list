// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { arrayRemove, arrayUnion, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

export interface List {
	Venlo: string[];
	Eindhoven: string[];
	Alex: string[];
	Kol: string[];
	Watchlist: string[];
}
export const TABS: (keyof List)[] = ["Eindhoven", "Venlo", "Alex", "Kol", "Watchlist"];

const app = initializeApp({
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
});
const db = getFirestore(app);
const dbRef = doc(db, "list", "list");

export async function getData() {
	// if (import.meta.env.DEV)
	// 	return {
	// 		Eindhoven: ["Eindhoven", "Eindhoven - 1", "Eindhoven - 2", "Eindhoven - 3"],
	// 		Venlo: [],
	// 		Alex: ["Alex"],
	// 		Kol: ["Kol"],
	// 		Watchlist: ["Watchlist"],
	// 	} as List;

	const data = (await getDoc(dbRef)).data() as List;
	for (const key of TABS) {
		data[key] = data[key].filter((item) => item.length > 0);
	}

	return data;
}

export function addItemToList(tab: string, item: string) {
	if (item.length === 0) return;

	return updateDoc(dbRef, { [tab]: arrayUnion(item) });
}

export function removeItemFromList(tab: string, item: string) {
	return updateDoc(dbRef, { [tab]: arrayRemove(item) });
}

export function getColor(tab: keyof List) {
	switch (tab) {
		case "Watchlist":
			return "gray";
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

export function getColorVal(tab: keyof List) {
	return getComputedStyle(document.documentElement).getPropertyValue(`--${getColor(tab)}`);
}
