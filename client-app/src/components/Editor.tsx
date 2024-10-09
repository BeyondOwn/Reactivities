'use client'
import { useChatCommentStore } from '@/app/stores/chatCommentStore'
import agent, { baseURL } from '@/utils/agent'
import type EditorJS from '@editorjs/editorjs'
import { BlockToolConstructable } from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'react-toastify'
import { z, ZodObject, ZodTypeAny } from 'zod'




interface EditorProps {
  formSchema:ZodObject<{ [key: string]: ZodTypeAny }>,
//   onSubmit:(message:any)=>void,
  activityId:number,
  className?:string
}

const Editor: FC<EditorProps> = ({formSchema,activityId,className}) => {
    const addComment = useChatCommentStore((state)=>state.addComment);
    const setLoadingImageDimensions = useChatCommentStore((state)=>state.setLoadingImageDimensions)
    const {
        register,
        handleSubmit,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const ref = useRef<EditorJS>()
    const [isMounted,setIsMounted] = useState<boolean>(false)
    const _titleRef = useRef<HTMLTextAreaElement>(null)
    const pathname = usePathname()
    const router = useRouter()

    const onSubmitMessage = async(message:z.infer<typeof formSchema>) =>{
        const editor = ref.current;
        let editorContent;

        if (editor) {
            try {
                editorContent = await editor.save();
            } catch (error) {
                console.error('Failed to save editor content:', error);
            }
        }

        // Assuming the image URL is stored within the content
        const imageUrl = editorContent?.blocks?.find(block => block.type === 'image')?.data?.file?.url || '';

        // Include imageUrl in your message
        const messageWithImage = {
            ...message,
            imageUrl,
        };

        console.log("message with image URL: ", messageWithImage);

        // Send the message to SignalR
        addComment(messageWithImage, activityId.toString());
        clearErrors();
        reset();
    }

    const handleKeyDown = (event:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            // Prevent the default behavior (new line)
            console.log("key down")
            event.preventDefault();
            handleSubmit(onSubmitMessage)(); // Call the submit handler
        }
    };
   

    const initializeEditor = useCallback(async ()=>{
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        // @ts-ignore
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        // @ts-ignore
        const Code = (await import('@editorjs/code')).default
        const List = (await import('@editorjs/list')).default
        // @ts-ignore
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default
        if(!ref.current){
            const editor = new EditorJS({
                holder:'editor',
                onReady(){
                    ref.current = editor
                    const plusButton = document.querySelector('.ce-toolbar__plus');
                    if (plusButton) {
                        plusButton.classList.add('custom-toolbar-plus');
                    }

                    const codexEditor = document.querySelector('.codex-editor');
                    if (codexEditor) {
                        codexEditor.classList.add('codex_editor');
                    }
                },
                inlineToolbar:true,
                data:{
                    blocks:[]
                },
                tools:{
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: `${baseURL}/Link/fetch-meta`
                        },
                    },
                    image: {
                        class:ImageTool as unknown as BlockToolConstructable,
                        config:{
                            uploader:{
                                async uploadByFile(file:File){

                                    const res = await agent.Profiles.uploadPhoto(file);
                                    
                                    return {
                                        success: 1,
                                        file:{
                                            url:res.data.url,
                                        }
                                    }
                                }
                            }
                        }
                    },
                    list:List,
                    code: Code,
                    InlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                    
                }
            })
        }
    }, [])

    useEffect(()=>{
        if (typeof window !== 'undefined') {
            setIsMounted(true)
        }
    },[])

    useEffect(() =>{
        const init = async () =>{
            await initializeEditor()

            setTimeout(()=>{
                _titleRef.current?.focus()
            },0)
        }
        if(isMounted){
            init()

            return () =>{
                ref.current?.destroy()
                ref.current = undefined
            }
        }
    },[isMounted,initializeEditor])



    useEffect(() =>{
        if(Object.keys(errors).length){
            for (const [_key, value] of Object.entries(errors)) {
                toast.error(`Something went wrong ${(value as {message:string}).message}`)
            }
        }
    },[errors])

    const {ref: titleRef, ...rest} = register('body')

  return <div className="w-full">
    <form id='subreddit-post-form' className='' onSubmit={handleSubmit(onSubmitMessage)}>
        <div className=''>
            <TextareaAutosize onKeyDown={handleKeyDown} {...register('body')} ref={(e)=>{
                titleRef(e)
                // @ts-ignore
                _titleRef.current = e
            }} 
            {...rest}
            placeholder='Message' />
             <div id='editor' className={className}></div>
        </div>
    </form>
    </div>
}

export default Editor