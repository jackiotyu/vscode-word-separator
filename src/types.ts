export type GroupType = Record<string, string>;
export interface GroupItem {
    name: string;
    separators: string[];
    isDefault?: boolean;
}
export type GroupListType =  GroupItem[];
