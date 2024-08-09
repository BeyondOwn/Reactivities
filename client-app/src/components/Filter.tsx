import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from 'react';

interface FilterProps {
  onFilterChange:(newState:string)=>void
  filterValue: string
}



const Filter: FC<FilterProps> = ({onFilterChange,filterValue}) => {
  

  return <div className="flex items-center gap-1">
    <h1 className="">Filter By</h1>
    <Select onValueChange={onFilterChange}>
  <SelectTrigger  className="w-[180px] font-bold bg-white ring-0 focus:ring-0">
    <SelectValue placeholder="Id" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="default">Id</SelectItem>
    <SelectItem value="date">Date</SelectItem>
  </SelectContent>
</Select>
  </div>
}

export default Filter