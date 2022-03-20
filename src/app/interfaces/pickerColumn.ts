import { PickerColumnOption } from "@ionic/angular";

export interface PickerColumn {
    name: string;
    align?: string;
    selectedIndex?: number;
    prevSelected?: number;
    prefix?: string;
    suffix?: string;
    options: PickerColumnOption[];
    cssClass?: string | string[];
    columnWidth?: string;
    prefixWidth?: string;
    suffixWidth?: string;
    optionsWidth?: string;
    refresh?: () => void;
} 