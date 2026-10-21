export const getCacheAge = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();

    if (!createdAt || isNaN(createdTime)) {
        return ""; 
    }

    const now = new Date().getTime();
    const elapsedMinutes = Math.floor((now - createdTime) / (1000 * 60));
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    if (elapsedMinutes < 1) return "Just now";
    if (elapsedMinutes < 60) return `${elapsedMinutes} minutes ago`;
    if (elapsedHours < 24) return `${elapsedHours} hours ago`;
    return `${elapsedDays} days ago`;
};