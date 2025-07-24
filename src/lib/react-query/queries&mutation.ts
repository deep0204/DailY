import { useQuery,useQueryClient,useMutation,useInfiniteQuery, QueryClient } from "@tanstack/react-query";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types';
import { createPost, createUser, deletePost, deleteSaved, getAllUsers, getCurrentUser, getInfinitePosts, getPostById, getPostsByUserId, getRecentPosts, getUserById, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost, updateProfile } from "../appwrite/api";
import { use } from "react";
import { QueryKeys } from "./queryKeys";
export const useCreateUserAccount = ()=>{
    return useMutation({
        mutationFn: async (user:INewUser) => createUser(user)
    })
}
export const useSignInAccount = ()=>{
    return useMutation({
        mutationFn: async (user:{email:string,password:string}) => signInAccount(user)
    })
}
export const useSignOutAccount = ()=>{
    return useMutation({
        mutationFn:signOutAccount
    })
}
export const useCreatePost = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(post:INewPost)=>createPost(post),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
            queryKey: [QueryKeys.GET_RECENT_POSTS],
        })
        } 
    })
}
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QueryKeys.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
    
}
export const useLikePost = () =>{
    const queryClient =  useQueryClient();
    return useMutation({
        mutationFn:({postId,likesArray}:{postId:string,likesArray:string[]})=> {
            return likePost(postId,likesArray);
        },
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_POST_BY_ID]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_CURRENT_USER]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_INFINITE_POSTS]
            });
        }
            
        
    })
}
export const useSavePost = () =>{
    const queryClient =  useQueryClient();
    return useMutation({
        mutationFn:({postId,userId}:{postId:string,userId:string})=> {
            return savePost(postId,userId);
        },
        onSuccess:(date)=>{
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_CURRENT_USER]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_INFINITE_POSTS]
            });
        }
            
        
    })
}
export const useDeleteSavedPost = () =>{
    const queryClient = new QueryClient();
    return useMutation({
        mutationFn:({savedRecord}:{savedRecord:string})=> {
            return deleteSaved(savedRecord);
        },
        onSuccess:(date)=>{
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_CURRENT_USER]
            });
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_RECENT_POSTS]
            });
        }
            
        
    })
}
export const useGetCurrentUser = ()=>{
    return useQuery({
        queryKey:[QueryKeys.GET_CURRENT_USER],
        queryFn:getCurrentUser
    })
}
export const useGetPostById = (postId:string)=>{
    return useQuery({
        queryKey:[QueryKeys.GET_POST_BY_ID,postId],
        queryFn:()=>getPostById(postId),
        enabled:!!postId,
    })
}
export const useUpdatePost = ()=>{
    const queryClient =  useQueryClient();
    return useMutation({
        mutationFn:(post:IUpdatePost)=> updatePost(post),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_POST_BY_ID,data?.$id],
                
            }),
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_RECENT_POSTS],
                
            })
        }
    })
}
export const useDeletePost = ()=>{
    const queryClient =  useQueryClient();
    return useMutation({
        mutationFn:({postId,imageId}:{postId:string,imageId:string})=>deletePost(postId,imageId),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_RECENT_POSTS],
                
            })
        }
    })
}
export const useGetAllUsers = () =>{
    return useQuery({
        queryKey:[QueryKeys.GET_USERS],
        queryFn:getAllUsers,
    })
}
export const useGetInfinitePosts = () => {
    return useInfiniteQuery({
        queryKey:[QueryKeys.GET_INFINITE_POSTS],
        queryFn:getInfinitePosts,
        getNextPageParam:(lastPage)=>{
            if(lastPage?.documents.length === 0) return null;
            const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
        refetchOnMount: "always",
        initialPageParam:''
    })
}
export const useSearchPosts = (searchTerm:string) => {
    return useQuery({
        queryKey:[QueryKeys.SEARCH_POSTS,searchTerm],
        queryFn:() => searchPosts(searchTerm),
        enabled:!!searchTerm
    }
    );
}
export const useGetUserById = (userId:string)=>{
    return useQuery({
        queryKey:[QueryKeys.GET_POST_BY_ID,userId],
        queryFn:()=>getUserById(userId),
        enabled:!!userId,
    })
}
export const useGetUserPosts = (userId:string) => {
    return useQuery({
        queryKey:[QueryKeys.GET_USER_POSTS,userId],
        queryFn:() => getPostsByUserId(userId),
        enabled:!!userId
    });
}
export const useUpdateProfile = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(user:IUpdateUser)=>updateProfile(user),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QueryKeys.GET_CURRENT_USER],
            })
        }
    })
}
