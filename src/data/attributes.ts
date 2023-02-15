const attributes = ['Mobile Number', 'Email', 'Name', 'Others'] as const;

export default attributes;

export type AttributeType = (typeof attributes)[number];
