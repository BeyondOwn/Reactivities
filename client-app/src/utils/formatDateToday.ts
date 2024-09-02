export const formatDateToday = (dateString:string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Set time to start of the day
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    
    // Check if the date is today or yesterday
    if (date >= startOfToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date >= startOfYesterday && date < startOfToday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    }
  };