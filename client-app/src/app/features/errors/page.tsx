'use client'
import { useCommonStore } from "@/app/stores/commonStore";

export default function ServerError () {
    const setErrorValue = useCommonStore((state) => state.setErrorValue);
    const errorValue = useCommonStore((state) => state.error);

    return (
        <div>
            <h1>Server Error</h1>
            <h5 className="text-red-500">{errorValue?.message}</h5>
            {errorValue?.details}
        </div>
    )
}