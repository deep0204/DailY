import { ID, Models } from "appwrite";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteconfig, avatars, databases, storage } from "./config";
// import { Query } from "@tanstack/react-query";
import { Query } from "appwrite";
import { no } from "zod/dist/types/v4/locales";
import { stat } from "fs";
import imageCompression from 'browser-image-compression';

export async function createUser(user:INewUser) {
    try{
        const newAccount = await account.create(ID.unique(),user.email,user.password,user.name)
        if(!newAccount) {
            throw new Error("User creation failed");
        }
        const avatarUrl =  await avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: new URL(avatarUrl),
        })
        if(!newUser) {
            throw new Error("User creation failed");
        }
        return newUser;

    }
    catch(error){
        console.log(error);
        return error;
    }
}
export async function saveUserToDB(user: {
    accountId: string,
    name: string,
    username: string,
    email: string,
    imageUrl: URL,
}) {
    try {
        const newUser = await databases.createDocument(appwriteconfig.database_id, appwriteconfig.users_collection_id,ID.unique(),user);
        console.log("User saved");
        return newUser;
    } catch (error) {
        console.error("Error saving user to DB:", error);
        throw error; // Re-throw the error for further handling
    }
}
export async function signInAccount(user: { email: string, password: string }) {
try {
    const session = await account.createEmailPasswordSession(user.email, user.password);
    return session;
} catch (error) {
    console.error("Error signing in:", error);
    throw error; // Re-throw the error for further handling
}
}
export async function signOutAccount() {
try {
    const session = await account.deleteSession("current");
    return session;
} catch (error) {
    console.error("Error signing Out:", error);
    throw error; // Re-throw the error for further handling
}
}
export async function createPost(post:INewPost) {
try {
    const uploadedFile=await uploadFile(post.file[0]);
    if(!uploadedFile) {
        throw Error;
    }


    const fileUrl = getFileView(uploadedFile.$id);
    console.log("File URL:", fileUrl);
    if(!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
    }
    const tags = post.tags?.replace(/ /g,'').split(',')||[];
    const newPost = await databases.createDocument(appwriteconfig.database_id, appwriteconfig.posts_collection_id, ID.unique(), {
        caption:post.caption,
        location: post.location,
        tags: tags,
        imageUrl: fileUrl,
        creator:post.userId,
        imageId: uploadedFile.$id,

    });
    if(!newPost) {
        deleteFile(uploadedFile.$id);
        throw Error;
    }
    return newPost;
} catch (error) {
    console.error("Error Creating Post:", error);
    throw error; // Re-throw the error for further handling
}
}
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get(); 
        if (!currentAccount) {
            throw new Error("No user is currently logged in");
        }
        const currentUser = await databases.listDocuments(
            appwriteconfig.database_id,
            appwriteconfig.users_collection_id,
            [Query.equal("accountId", currentAccount.$id)]
            )
        if (!currentUser) {
            throw new Error("User not found in database");
        }
        return currentUser.documents[0];
    } catch (error) {
        console.error("Error getting current user:", error);
       
    }
}
export async function compressImage(file:File) {
    try {
     const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  };
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
    });
        return compressedFile
} catch (error) {
    console.log(error, "Error compressing image");
}
}
export async function uploadFile(file:File){
    const compressedFile = await compressImage(file);
    if(!compressedFile) {
        throw new Error("File compression failed");
    }
    try {
        const uploadedFile = await storage.createFile(appwriteconfig.storage_id,ID.unique(),compressedFile);
        return uploadedFile;
    } catch (error) {
        console.log(error,"Error uploading file");
    }
}
export function getFileView(fileId:string) {
    try {
        const fileUrl = storage.getFileView(appwriteconfig.storage_id, fileId );
        return fileUrl;
    } catch (error) {
        console.error("Error getting file preview:", error);
        throw error; // Re-throw the error for further handling
    }
}
export const deleteFile = async (fileId:string) => {
    try {
        const deletedFile = await storage.deleteFile(appwriteconfig.storage_id, fileId);
        return {status:'ok'};
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error; // Re-throw the error for further handling
        
    }
}

export async function getRecentPosts(){
    try {
        const posts = await databases.listDocuments(
            appwriteconfig.database_id,
            appwriteconfig.posts_collection_id,
            [Query.orderDesc("$createdAt"),Query.limit(20)],
        )
        if(!posts) {
            throw new Error("No posts found");
        }
        return posts;
    } catch (error) {
        console.log(error,"Error fetching posts from appwrite")
    }
}
export async function likePost(postId:string, likesArray:string[]){
    try {
        const updatedPost = await databases.updateDocument(appwriteconfig.database_id, appwriteconfig.posts_collection_id,postId,{
        likes:likesArray
    })
    if(!updatedPost) throw Error;
    return updatedPost;
    } catch (error) {
        console.log(error)
    }
}
export async function savePost(postId:string, userId:string){
    try {
        const updatedPost = await databases.createDocument(appwriteconfig.database_id, appwriteconfig.saves_collection_id,ID.unique(),{
        post:postId,
        user:userId
    });
    if(!updatedPost) throw Error;
    return updatedPost;
    } catch (error) {
        console.log(error)
    }
}
export async function deleteSaved(savedRecord:string){
    try {
        const statusCode = await databases.deleteDocument(appwriteconfig.database_id, appwriteconfig.saves_collection_id,savedRecord);
    if(!statusCode) throw Error;
    return {status:'ok'}
    } catch (error) {
       console.log(error) 
    }
};
export async function getPostById(postId:string){
    try {
        const post = await databases.getDocument(appwriteconfig.database_id,appwriteconfig.posts_collection_id,postId);
        if(!post) throw Error;
        return post;
    } catch (error) {
        console.log(error,"Cannot get post by ID")
    }
}
export async function updatePost(post:IUpdatePost){
    try {
    const hasNewImage = post.file.length>0;
    let image = {
        imageUrl:post.imageUrl,
        imageId:post.imageId
    }
    if(hasNewImage){
        
        const uploadedFile=await uploadFile(post.file[0]);
        if(!uploadedFile) {
            throw Error;
        }
        const fileUrl = getFileView(uploadedFile.$id);
        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        }
        image.imageId = uploadedFile.$id;
        image.imageUrl = fileUrl;
    }
    const tags = post.tags?.replace(/ /g,'').split(',')||[];
    const updatedPost = await databases.updateDocument(appwriteconfig.database_id, appwriteconfig.posts_collection_id, post.postId, {
        caption:post.caption,
        location: post.location,
        tags: tags,
        imageUrl: image.imageUrl,
        imageId: image.imageId,

    });
    if(!updatedPost) {
        if(hasNewImage)deleteFile(post.imageId);
        throw Error;
    }
    return updatedPost;
} catch (error) {
    console.error("Error Creating Post:", error);
    throw error; // Re-throw the error for further handling
}
}
export async function deletePost(postId:string,imageId:string){
    if(!imageId||!postId){
        throw Error;
    }
    try {
        const status = await databases.deleteDocument(appwriteconfig.database_id,appwriteconfig.posts_collection_id,postId);
        if(!status){
            throw Error;
        }
        return {status:'ok'};
    } catch (error) {
        console.log(error)
    }
}
export async function getAllUsers(){
    try {
        const users = await databases.listDocuments(appwriteconfig.database_id,appwriteconfig.users_collection_id)
        if(!users) {
            throw new Error("No users found");
        }
        return users;
    } catch (error) {
        console.log(error, "Error fetching users from appwrite")
    }
    
}
export async function getInfinitePosts ({pageParam}:{pageParam:string}){
    const queries : any[] = [Query.orderDesc("$updatedAt"),Query.limit(10)];
    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try {
        const posts = await databases.listDocuments(appwriteconfig.database_id, appwriteconfig.posts_collection_id, queries);
        if(!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error, "Error fetching infinite posts from appwrite")
    }
}
export async function searchPosts (searchTerm:string){
    
    try {
        const posts = await databases.listDocuments(appwriteconfig.database_id, appwriteconfig.posts_collection_id,
            [Query.search("caption",searchTerm)]
        );
        if(!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error, "Error fetching search posts from appwrite")
    }
}
export async function getUserById(userId:string){
    try {
        const post = await databases.getDocument(appwriteconfig.database_id,appwriteconfig.users_collection_id,userId);
        if(!post) throw Error;
        return post;
    } catch (error) {
        console.log(error,"Cannot get user by ID")
    }
}
export async function getPostsByUserId(userId:string){
    try {
        const posts = await databases.listDocuments(appwriteconfig.database_id, appwriteconfig.posts_collection_id,
            [Query.equal("creator",userId),Query.orderDesc("$createdAt")]
        );
        if(!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error, "Error fetching user posts from appwrite")
    }
}

export async function updateProfile(user:IUpdateUser){
    try {
    const hasNewImage = user.file.length>0;
    let image = {
        imageUrl:user.imageUrl,
        imageId:user.imageId
    }
    if(hasNewImage){
        
        const uploadedFile=await uploadFile(user.file[0]);
        if(!uploadedFile) {
            throw Error;
        }
        const fileUrl = getFileView(uploadedFile.$id);
        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        }
        image.imageId = uploadedFile.$id;
        image.imageUrl = fileUrl;
    }
    
    const updatedProfile = await databases.updateDocument(appwriteconfig.database_id, appwriteconfig.users_collection_id, user.userId, {
        name: user.name,
        username: user.username,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,

    });
    if(!updatedProfile) {
        if(hasNewImage)deleteFile(user.imageId);
        throw Error;
    }
    return updatedProfile;
} catch (error) {
    console.error("Error Creating Post:", error);
    throw error; // Re-throw the error for further handling
}
}