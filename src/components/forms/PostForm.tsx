import React from 'react'
"use client"
import { Models } from 'appwrite' 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import FileUploader from "@/components/ui/shared/FileUploader"
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queries&mutation'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { toast } from 'sonner'
import { INewPost } from '@/types';
import ProfileImage from '../ui/ProfileImage'
// import FileUploaderProfile from '../ui/shared/FileUploaderProfile'
const formSchema = z.object({
        caption:z.string().min(2).max(2200) ,
        file:z.custom<File[]>(),
        location: z.string().min(2).max(100),
        tags:z.string()
    })
type PostFormProps = {
    post?:Models.Document;
    action : 'Update' | 'Create'
}
const PostForm = ({post,action}:PostFormProps) => {
    const navigate = useNavigate();
    const {mutateAsync:createPost,isPending:isCreatingPost}=useCreatePost();
     const {mutateAsync:updatePost,isPending:isUpdatingPost}=useUpdatePost();
    const {user} = useAuthContext();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            caption: post?post?.caption : "",
            file:[],
            location:post?post?.location : "",
            tags: post?post?.tags.join(', ') : "",

        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if(post&&action == 'Update'){
            const updatedPost = await updatePost({
                ...values,
                postId:post?.$id,
                imageId:post?.imageId,
                imageUrl:post?.imageUrl
            })
            if(!updatedPost){
                toast.error("Post Not Updated ! Please try again later");
            }else{
                toast.success("Post Updated Successfully");
            }
            return navigate('/');

        }
       const newPost = await createPost({
        ...values,
        userId:user.id,
       });
       if(!newPost){
        toast.error("Please try again")
       }
       navigate('/');
    }

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-1/2 gap-8 max-w-5xl">
            <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='shad-form_label'>Caption</FormLabel>
                        <FormControl>
                            <Textarea className='shad-textarea custom-scrollbar' placeholder="Type the Post Caption here" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='shad-form_label'>Add Photos</FormLabel>
                        <FormControl>
                            <FileUploader
                            fieldChange={field.onChange}
                            mediaUrl = {post?.imageUrl}/>
                        </FormControl>
                        <FormMessage className='shad-form_message'/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='shad-form_label'>Add Location</FormLabel>
                        <FormControl>
                            <Input type='text' className='shad-input'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='shad-form_label'>{'Add Tags (Separated by commas ",")'}</FormLabel>
                        <FormControl>
                            <Input type='text' className='shad-input'
                                placeholder="Coding , React, JavaScript"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='flex items-center gap-4 justify-start'>
                <Button type="button" className='shad-button_dark_4' onClick={()=>{return navigate('/')}}>Cancel</Button>
                <Button type="submit" className='shad-button_primary'>{isCreatingPost || isUpdatingPost?(<img src='/assets/icons/loader.svg' width={20} height={20}/>):("Submit")}</Button>
            </div>
        </form>
    </Form>
)
}

export default PostForm
