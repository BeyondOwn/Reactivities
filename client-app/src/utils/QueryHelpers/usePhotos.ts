import { useQuery } from "@tanstack/react-query";
import agent from "../agent";
import { useUser } from "../UserContext";

export const usePhotos = () => {
    const user = useUser().user;
    
    return useQuery({
        queryKey: ["photos"],
        queryFn: async () => {
            if (!user || !user.username) {
                throw new Error("User is not authenticated or doesn't have a username");
            }
            const profile = await agent.Profiles.get(user.username);
            return profile.photos;
        },
        enabled: !!user && !!user.username,
    });
};