import { Activity } from "@/app/models/activity";
import { paginatedResults } from "@/app/models/paginatedResults";
import { fetchPage } from "@/utils/useActivities";

export async function loadInitialData(){
    return await fetchPage(1) as paginatedResults<Activity>;
  }