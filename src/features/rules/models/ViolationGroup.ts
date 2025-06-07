import { Violation } from "./Violation";

export interface ViolationGroup {
    id: string;
    title: string;
    violations: Violation[];
}
