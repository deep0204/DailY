import React from 'react'
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SignUpValidation } from '@/lib/validation'
import { Link ,useNavigate} from 'react-router-dom'
import { toast } from "sonner"
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queries&mutation'
import { useAuthContext } from '@/context/AuthContext'
"use client"




// const isLoading = false;
const Signupform = () => {
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
  const navigate=useNavigate();
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  const {checkAuthUser,isLoading:isUserLoading} = useAuthContext();

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUser(values);
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })
    if (!session) {
      return toast.error("Something went wrong, please try again later");
    }
    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      navigate('/');
    }else{
      toast.error("Sign-up failed, please try again later");
    }
  }
  return (


    <Form {...form}>
      <div className='max-w-[250px] sm:max-w-[420px] mx-auto flex-center flex-col py-5 ' >
        <img src="/assets/images/logo1.png" alt="logo" height={30} />


        <h1 className='h3-bold  py-5 sm:py-15 text-center '>Create new Account</h1>
        <p className='base-regular text-center'>Create a new account to start your journey today</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-5 mt-4 sm:mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className='shad-input'{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input className='shad-input'{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input className='shad-input'{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className='shad-input'{...field} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='shad-button_primary'>{isCreatingUser ? (<img src='/assets/icons/loader.svg' className='w-[24px]' />) : ("Sign-up")}</Button>
          <p className='text-small-regular text-center'>Already Have an account? <Link to='/sign-in' className='text-primary-500 text-small-bold'>Sign-in</Link></p>
        </form>
      </div>
    </Form>

  )
}

export default Signupform
