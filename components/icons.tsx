

import React from 'react';

interface IconProps {
    className?: string;
}

export const GhostIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2a9 9 0 00-9 9c0 4.97 4.03 9 9 9h.535a3.5 3.5 0 013.465 3.5v.5a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-.5a5.5 5.5 0 00-5.5-5.5H12a7 7 0 01-7-7 7 7 0 017-7 7 7 0 017 7v1a1 1 0 002 0V11a9 9 0 00-9-9zm-3 8a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.25a1.75 1.75 0 00-1.75 1.75v3.315a9.754 9.754 0 00-5.223 3.483c-1.156 1.45-1.637 3.29-1.54 5.152.12 2.27.893 4.414 2.301 6.021a1.75 1.75 0 002.824-1.956 9.453 9.453 0 01-1.353-3.664c-.066-1.18.22-2.355.83-3.328a8.254 8.254 0 014.512-2.932V20a1.75 1.75 0 003.5 0V6.315a1.75 1.75 0 00-1.75-1.75h-1.75V3a1.75 1.75 0 00-1.75-1.75zm3.5 17.25a.75.75 0 10-1.5 0v-2.125a.75.75 0 10-1.5 0V20a.75.75 0 10-1.5 0v-4a.75.75 0 10-1.5 0v2.75h-1.5v-3.5a.75.75 0 10-1.5 0v3.5h-1.5v-3.5a.75.75 0 10-1.5 0v3.5h-1.5V15a.75.75 0 10-1.5 0v5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-5a.75.75 0 10-1.5 0v3.5z" clipRule="evenodd" />
    </svg>
);

export const RadarIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm-1.06 4.72a.75.75 0 011.06-1.06l6 6a.75.75 0 01-1.06 1.06l-6-6zM12 13a1 1 0 100 2 1 1 0 000-2z" /><path d="M10.875 10.875a3.001 3.001 0 014.242 0A.75.75 0 0114.05 9.81a4.5 4.5 0 00-6.364 0 .75.75 0 011.188 1.065z" /><path d="M8.757 8.757a6 6 0 018.486 0 .75.75 0 11-1.06 1.06A4.5 4.5 0 009.81 14.05a.75.75 0 11-1.06-1.061 6 6 0 010-8.486z" />
    </svg>
);

export const ActivityIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.75 3h16.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75a.75.75 0 01.75-.75zM5.25 5.25v13.5h13.5V5.25H5.25z" /><path d="M6 18h1.5v-6H6v6zm3 0h1.5v-9H9v9zm3 0h1.5V9h-1.5v9zm3 0h1.5v-5h-1.5v5z" />
    </svg>
);

export const ZapIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.644 1.59a.75.75 0 01.712 0l8.25 4.814a.75.75 0 01.218.882l-3.375 7.02a.75.75 0 01-.64.402H7.21a.75.75 0 01-.64-.402l-3.375-7.02a.75.75 0 01.218-.882l8.25-4.814zM12 3.492L5.43 7.5l2.625 5.456h7.89l2.625-5.456L12 3.492z" /><path d="M12.98 15.75a.75.75 0 01-.96 0l-3.75-2.25a.75.75 0 010-1.316l3.75-2.25a.75.75 0 01.96 1.316L10.324 12l2.656 1.594a.75.75 0 010 1.316l-3.75 2.25a.75.75 0 01-.96 0l3.75 2.25a.75.75 0 010 1.316l-3.75 2.25a.75.75 0 01-.96-1.316L12 18.324l-2.656-1.594a.75.75 0 010-1.316l3.75-2.25a.75.75 0 01.96 0z" />
    </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.535 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

export const StopIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
);

export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2a4.5 4.5 0 00-4.5 4.5c0 1.54.78 2.9 2 3.74V12h-2v2h2v1a4 4 0 004 4h1v2h2v-2h1a2 2 0 002-2v-1h2v-2h-2v-1.76a4.503 4.503 0 002-3.74A4.5 4.5 0 0012 2zm-2.5 4.5a2.5 2.5 0 015 0c0 1.1-.73 2.05-1.75 2.37V12h-1.5V8.87C10.23 8.55 9.5 7.6 9.5 6.5zM15 17a2 2 0 01-2 2h-1v-2h3v2z" />
        <path d="M3 12a1 1 0 011-1h1v2H4a1 1 0 01-1-1zm3 0h1v2H6v-2zm13 0a1 1 0 011 1v0a1 1 0 01-1 1h-1v-2h1zm-3 0h1v2h-1v-2z" />
    </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M15 6a3 3 0 11-6 0 3 3 0 016 0zM17 8a5 5 0 10-10 0 5 5 0 0010 0zM22 17a1 1 0 00-1-1h-1.615a5.573 5.573 0 00-11.77 0H6a1 1 0 00-1 1v3a1 1 0 001 1h14a1 1 0 001-1v-3zM8.385 18H7v1h1.385a3.57 3.57 0 016.23 0H16v-1h-1.385a3.57 3.57 0 01-6.23 0z" />
    </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M3 3.75A1.75 1.75 0 014.75 2h14.5A1.75 1.75 0 0121 3.75v16.5A1.75 1.75 0 0119.25 22H4.75A1.75 1.75 0 013 20.25V3.75zm3.25 3.5a.75.75 0 00-1.5 0v1.25a.75.75 0 001.5 0V7.25zM7.695 8.016a.75.75 0 011.06 0l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06L9.69 12.06 7.695 9.076a.75.75 0 010-1.06zM13 14.25a.75.75 0 000-1.5h-3a.75.75 0 000 1.5h3z" clipRule="evenodd" />
    </svg>
);

// FIX: Add missing icons
export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M11.54 22.351l.07.07.07-.07a.75.75 0 00-1.06-1.06l-.07.07-.071-.071a.75.75 0 00-1.06 1.06l.071.071.07.07-.07.07a.75.75 0 001.06 1.06l.07-.07.07.07a.75.75 0 001.06-1.06l-.07-.07-.07.07.07.07a.75.75 0 001.06-1.06l-2.02-2.02a.75.75 0 00-1.06 0l-2.02 2.02a.75.75 0 001.06 1.06l.07-.07.07.07-.07.07a.75.75 0 001.06 1.06l.07-.07.07.07a.75.75 0 001.06-1.06l-.07-.07.07-.07zm-4.88-3.41a.75.75 0 00-1.06-1.06l-2.02 2.02a.75.75 0 001.06 1.06l2.02-2.02zM12 2.25c-4.83 0-8.75 3.92-8.75 8.75 0 4.83 3.92 8.75 8.75 8.75s8.75-3.92 8.75-8.75C20.75 6.17 16.83 2.25 12 2.25zM8.25 12a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" clipRule="evenodd" />
    </svg>
);

export const MuteIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.94 12l-2.22 2.22a.75.75 0 101.06 1.06L20 13.06l2.22 2.22a.75.75 0 101.06-1.06L21.06 12l2.22-2.22a.75.75 0 10-1.06-1.06L20 10.94l-2.22-2.22z" clipRule="evenodd" />
    </svg>
);

export const SoloIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.25a.75.75 0 01.75.75v.518c.988.24 1.88.758 2.65 1.472l.47-.235a.75.75 0 01.88.88l-.234.47a6.723 6.723 0 011.473 2.65l.518-.044a.75.75 0 01.75.75v3a.75.75 0 01-.75.75l-.518-.043a6.723 6.723 0 01-1.473 2.65l.234.47a.75.75 0 01-.88.88l-.47-.235a6.723 6.723 0 01-2.65 1.472v.518a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-.518a6.723 6.723 0 01-2.65-1.472l-.47.235a.75.75 0 01-.88-.88l.234-.47a6.723 6.723 0 01-1.473-2.65l-.518.044a.75.75 0 01-.75-.75v-3a.75.75 0 01.75-.75l.518.043a6.723 6.723 0 011.473-2.65l-.234-.47a.75.75 0 01.88-.88l.47.235A6.723 6.723 0 018.25 3.518V3a.75.75 0 01.75-.75h3zm-1.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </svg>
);

export const RecordIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 15a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z" clipRule="evenodd" />
    </svg>
);

export const SampleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M10.5 5.25a.75.75 0 00-1.5 0v2.25H6.75a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25h2.25a.75.75 0 000-1.5h-2.25V5.25z" /><path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v1.5H3a.75.75 0 000 1.5h1.5v3H3a.75.75 0 000 1.5h1.5v3H3a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h3v1.5a.75.75 0 001.5 0v-1.5h3v1.5a.75.75 0 001.5 0v-1.5h3v1.5a.75.75 0 001.5 0v-1.5H21a.75.75 0 000-1.5h-1.5v-3H21a.75.75 0 000-1.5h-1.5v-3H21a.75.75 0 000-1.5h-1.5v-1.5a.75.75 0 00-1.5 0v1.5h-3v-1.5a.75.75 0 00-1.5 0v1.5h-3v-1.5a.75.75 0 00-1.5 0v1.5H4.5V3.75a.75.75 0 000-1.5H6v-1.5a.75.75 0 00-1.5 0v1.5H4.5zM6 6.75h3v3H6v-3zm9 0h-3v3h3v-3zm-3 9v-3h3v3h-3zm3 0h3v-3h-3v3zm-9-3v3h3v-3H6zm0-3h3v3H6v-3z" clipRule="evenodd" />
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 1.25a1.75 1.75 0 00-1.75 1.75v3.315a9.754 9.754 0 00-5.223 3.483c-1.156 1.45-1.637 3.29-1.54 5.152.12 2.27.893 4.414 2.301 6.021a1.75 1.75 0 002.824-1.956 9.453 9.453 0 01-1.353-3.664c-.066-1.18.22-2.355.83-3.328a8.254 8.254 0 014.512-2.932V20a1.75 1.75 0 003.5 0V6.315a1.75 1.75 0 00-1.75-1.75h-1.75V3a1.75 1.75 0 00-1.75-1.75zm3.164 6.32a.75.75 0 01.185 1.045l-4.25 6a.75.75 0 01-1.198-.01l-2.25-3.5a.75.75 0 111.23-0.782l1.636 2.556 3.65-5.152a.75.75 0 011.045-.185z" clipRule="evenodd" />
    </svg>
);