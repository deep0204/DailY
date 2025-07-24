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
import { useCreatePost, useUpdatePost, useUpdateProfile } from '@/lib/react-query/queries&mutation'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { toast } from 'sonner'
import { INewPost } from '@/types';
import ProfileImage from '../ui/ProfileImage'
// import FileUploaderProfile from '../ui/shared/FileUploaderProfile'
const formSchema = z.object({
        username:z.string().min(2).max(100) ,
        file:z.custom<File[]>(),
        bio: z.string().min(2).max(2200),
        name:z.string().min(2).max(100) ,

    })
type ProfileFormProps = {
    user?:Models.Document;
    
}
const ProfileForm = ({user}:ProfileFormProps) => {
    const navigate = useNavigate();
     const {mutateAsync:updateProfile,isPending:isUpdatingProfile}=useUpdateProfile();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user?user?.username : "",
            file:[],
            bio : user?user?.bio : "",
            name: user?user?.name : "",

        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        
            const updatedProfile = await updateProfile({
                ...values,
                userId:user?.$id||'',
                imageId:user?.imageId,
                imageUrl:user?.imageUrl
            })
            if(!updatedProfile){
                toast.error("Profile Not Updated ! Please try again later");
            }else{
                toast.success("Profile Updated Successfully");
            }
            return navigate('/');

        
       
    }

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-8 max-w-5xl">
        <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem className='flex flex-row gap-2 w-full items-center'>
                        <FormControl>
                            <ProfileImage
                            fieldChange={field.onChange}
                            mediaUrl = {user?.imageUrl}/>
                        </FormControl>
                        <FormMessage className='shad-form_message'/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem >
                        <FormLabel className='shad-form_label'>{'Name'}</FormLabel>
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
            
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                   <FormItem >
                        <FormLabel className='shad-form_label'>Username</FormLabel>
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
                name="bio"
                render={({ field }) => (
                    <FormItem >
                        <FormLabel className='shad-form_label'>{'Bio'}</FormLabel>
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
                <Button type="submit" className='shad-button_primary'>{isUpdatingProfile?(<img src='/assets/icons/loader.svg' width={20} height={20}/>):("Submit")}</Button>
            </div>
        </form>
    </Form>
)
}

export default ProfileForm
