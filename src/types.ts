export type GroupType = Record<string, string>;
export interface GroupItem {
    name: string;
    separators: string[];
    isDefault?: boolean;
    id?: number;
}
export type GroupCloseItem = {
    name: string;
    separators: string;
    isDefault?: boolean;
    id?: number;
};
export type GroupListType = GroupItem[];