'use client';

// `@true-tech-team/ui-components/app` - app-builder layer on top of the core components.
// Import core modules by relative path (not '../index') so the core barrel and its stylesheet
// side effect are shared with the main entry rather than pulled in twice.

export * from './AppProvider';
export * from './router';
export * from './params';
export * from './page';
export * from './data';
export * from './templates';
