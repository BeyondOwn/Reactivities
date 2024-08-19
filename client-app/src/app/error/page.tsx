'use client'
import { Button } from '@/components/ui/button';
import { default as agent } from '@/utils/agent';
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";


export default function TestErrors() {
    const baseUrl = 'http://localhost:5039/api/'


    function handleNotFound() {
        agent.requests.get(baseUrl + 'Buggy/not-found').catch(err => console.log(err.response));
    }

    function handleBadRequest() {
        agent.requests.get(baseUrl + 'Buggy/bad-request').catch(err => console.log(err.response));
    }

    function handleServerError() {
        agent.requests.get(baseUrl + 'Buggy/server-error').catch(err => console.log(err.response));
    }

    function handleUnauthorised() {
        agent.requests.get(baseUrl + 'Buggy/unauthorised').catch(err => console.log(err.response));
    }

    function handleBadGuid() {
        agent.requests.get(baseUrl + 'activities/notaguid').catch(err => console.log(err.response));
    }

    function handleValidationError() {
        agent.requests.post(baseUrl + 'activities', {}).catch(err => console.log(err));
    }

    function notify(){
        toast.success("Wow a notification!");
    }

    

    return (
        <div className='flex justify-center items-center'>
                <div className='flex flex-col w-32 gap-4'>
                    <Button onClick={handleNotFound}>Not Found</Button>
                    <Button onClick={handleBadRequest}>Bad Request</Button>
                    <Button onClick={handleValidationError}>Validation Error</Button>
                    <Button onClick={handleServerError}>Server Error</Button>
                    <Button onClick={handleUnauthorised}>Unathorized</Button>
                    <Button onClick={handleBadGuid}>bad Guid</Button>
                    </div>
                    
        </div>
    )
}