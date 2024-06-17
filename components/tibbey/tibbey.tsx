'use client'
import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { FaPaperPlane } from 'react-icons/fa6'
import { Textarea } from '../ui/textarea'
import { useChat, Message } from 'ai/react'

const TibbeyComponent = () => {

    const { input, messages, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="w-11/12 md:w-3/4 lg:w-2/3 h-5/6 lg:h-5/6 flex flex-col border border-gray-200 bg-white rounded-lg chat-shadow">

    {/*MESSAGES */}

    <ScrollArea className="h-auto my-2 rounded-t-lg grow">
     <div className='bg-white h-4/5 flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 h-2/4 w-full text-white'>
      {messages?.map((message: Message) => {
      return (
        <div key={message.id} className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
  

        <div className={`p-2 rounded-md max-w-48 md:max-w-80 lg:max-w-96 ${message.role === 'user' ? 'bg-[#4D6273] self-end' : 'bg-[#245501] self-start'}`}>
          <div>
            {message.content.split('\n').map((textBlock: string, index: any) => {
                return (
                    <p key={message.id + index}>
                        {
                            textBlock === '' ? (<span>&nbsp;</span>) : (<span>{textBlock}</span>)
                        }
                    </p>
                )
            })}
            </div>
        </div>
      </div>
      )
      })}

    </div>
    </ScrollArea>


    {/*MESSAGE INPUT */}


    <form onSubmit={handleSubmit}>
    <div className='relative flex items-center p-2 px-4 md:px-6 border-t border-gray-200 text-lg bg-white rounded-b-lg shadow-inner w-full'>

        <input
        value={input}
        onChange={handleInputChange}
        placeholder='Ask anything you would like to know...'
        className='flex-1 border-none p-2 outline-none md:ml-4 text-base'
        />

        <button className='cursor-pointer ml-2 text-[#525354]' type='submit'>
        <FaPaperPlane />
        </button>

        </div>
    </form>
  </div>
  )
}

export default TibbeyComponent
