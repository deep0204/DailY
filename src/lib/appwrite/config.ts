import { Client , Databases, Account,ID,Storage,Avatars} from "appwrite";
export const appwriteconfig = {
    url : import.meta.env.VITE_APPWRITE_URL,
    project_id : import.meta.env.VITE_APPWRITE_PROJECT_ID,
    database_id: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    users_collection_id: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    storage_id: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    posts_collection_id: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
    saves_collection_id: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
}
export const client = new Client();
client.setProject(appwriteconfig.project_id);
client.setEndpoint(appwriteconfig.url);
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

