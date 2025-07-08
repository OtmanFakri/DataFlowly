import { doc, setDoc, serverTimestamp, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import {db} from "./config.ts";

export interface Diagram {
    id?: string; // optional, Firestore will generate if not provided
    name: string;
    description?: string;
    engine: 'mysql' | 'postgresql' | 'sqlserver';
    tableCount?: number;
    relationshipCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    isStarred: boolean;
    thumbnail?: string;
    collaborators?: number;
    userId?: string;
    schema?: any;
}
export async function createDiagram(diagram: Omit<Diagram, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const newDocRef = doc(db, 'diagrams', /* you can generate an id here or let Firestore generate */);
    const now = serverTimestamp();

    const diagramData = {
        ...diagram,
        createdAt: now,
        updatedAt: now,
    };

    await setDoc(newDocRef, diagramData);

    return newDocRef.id; // return the generated document ID
}

export async function getAllDiagrams(userId: string): Promise<Diagram[]> {
    const diagramsQuery = query(collection(db, 'diagrams'), where('userId', '==', userId));
    const snapshot = await getDocs(diagramsQuery);
    return snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
        } as Diagram;
    });
}

export async function getDiagramById(id: string): Promise<Diagram | null> {
    const docRef = doc(db, 'diagrams', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
    } as Diagram;
}


export async function updateDiagramSchema(id: string, schema: any): Promise<void> {
    const docRef = doc(db, 'diagrams', id);
    await setDoc(docRef, { schema }, { merge: true });
}
export async function getDiagramSchemaById(id: string): Promise<any | null> {
    const docRef = doc(db, 'diagrams', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return data.schema ?? null;
}