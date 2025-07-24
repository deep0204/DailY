import GridPosts from '@/components/ui/shared/GridPosts';
import SearchResults from '@/components/ui/shared/SearchResults';
import useDebounce from '@/hooks';
import { useGetInfinitePosts, useSearchPosts } from '@/lib/react-query/queries&mutation';
import React from 'react'
import { useInView } from "react-intersection-observer";
import { useState,useEffect } from 'react'

const Explore = () => {
  const {data:posts,hasNextPage,fetchNextPage,isFetchingNextPage} = useGetInfinitePosts();
  const [searchTerm, setsearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const {data:searchPosts,isFetching:isFetchingPosts} = useSearchPosts(debouncedSearchTerm);
  const showSearchResults = searchTerm.length > 0;
  const { ref, inView, entry } = useInView();
  useEffect(() => {
    if(inView&&!searchTerm)fetchNextPage();
  }, [inView,searchTerm])
  if( !posts) {
    return (
      <div className='flex flex-center w-full'>
        <img src="/assets/icons/loader.svg" alt="loading..." width={30} />
      </div>
    )
  }
  const showGridPosts = !showSearchResults && posts.pages.every((page:any)=> page.length > 0);
  
  
  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <div className="h3-bold md:h2">
          Search Posts
        </div>
        <div className="w-full bg-dark-4 rounded-full flex items center px-3 py-3">
          <img src="/assets/icons/search.svg" alt="search" width={25}/>
          <input type="text" placeholder='Search'className='bg-dark-4 w-full px-3 border-none focus:outline-none base-regular text-light-3' value={searchTerm} onChange={(e)=> setsearchTerm(e.target.value)}/>
        </div>
        <div className='text-left h3-bold w-full mt-10'>Popular Today</div>
      </div>
      
      {showSearchResults?(
        isFetchingPosts?(
          (
            <div className='flex flex-center w-full'>
              <img src="/assets/icons/loader.svg" alt="loading..." width={30} />
            </div>
          )
        ):(<SearchResults post={searchPosts?.documents}/>)
        
        
        
      ):
      showGridPosts?(
        <p>End of Posts</p>
      ):(
        posts.pages.map((page,index)=>{
          return <GridPosts key={index} post={page?.documents} showStats={true}/>
        })
        
        
      )}
      {hasNextPage&&!searchTerm &&(
          <div ref={ref} className='mt-10'>
            <img src="/assets/icons/loader.svg" alt="" width={30}/>
          </div>
        )}
    </div>
    
    
  )
}

export default Explore
