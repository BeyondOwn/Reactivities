import { useFilterStore } from "@/app/stores/FilterStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from 'react';

interface FilterProps {
}



const Filter: FC<FilterProps> = () => {

  const onFilterChange = useFilterStore((state) => state.setFilterValue)

  return <div className="flex items-center gap-1">
    <h1 className="">Filter By</h1>
    <Select onValueChange={onFilterChange}>
  <SelectTrigger  className="w-[180px] font-bold ring-0 focus:ring-0 bg-card">
    <SelectValue placeholder="Id" />
  </SelectTrigger>
  <SelectContent className="bg-card">
    <SelectItem value="default">Id</SelectItem>
    <SelectItem value="date">Date</SelectItem>
  </SelectContent>
</Select>
  </div>
}

export default Filter