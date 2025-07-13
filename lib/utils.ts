export const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
};

export const getCleanFirstName = (rawName?: string): string => {
    if (!rawName) return "Guest";

    const name = rawName.trim();

    // Try to find first capitalized word (e.g., "Suryakanta")
    const match = name.match(/[A-Z][a-z]+/);
    if (match) return match[0];

    // If no match, fallback to first alpha word
    const fallback = name.match(/[a-zA-Z]+/);
    return fallback ? fallback[0][0].toUpperCase() + fallback[0].slice(1).toLowerCase() : "Guest";
};
