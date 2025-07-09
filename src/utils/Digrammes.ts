import { doc, setDoc, serverTimestamp, collection, getDocs, query, where, getDoc, deleteDoc } from 'firebase/firestore';
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



export async function deleteDiagramById(id: string): Promise<void> {
    const docRef = doc(db, 'diagrams', id);
    await deleteDoc(docRef);
}


export async function updateDiagramSchema(id: string, schema: any): Promise<void> {
    const tables = schema?.database?.tables;
    const relationships = schema?.database?.relationships;
    const tableCount = Array.isArray(tables) ? tables.length : 0;
    const relationshipCount = Array.isArray(relationships) ? relationships.length : 0;
    const docRef = doc(db, 'diagrams', id);
    await setDoc(
        docRef,
        { schema, tableCount, relationshipCount, updatedAt: serverTimestamp() },
        { merge: true }
    );
}
export async function getDiagramSchemaById(id: string): Promise<any | null> {
    const docRef = doc(db, 'diagrams', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return data.schema ?? null;
}